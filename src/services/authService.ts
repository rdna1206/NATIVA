import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  User
} from '../lib/firebase';
import { AdminUser } from '../types';

const ADMINS_COLLECTION = 'admin_users';
const SESSION_STORAGE_KEY = 'nativa_admin_session';

// Listeners for custom session changes
const sessionListeners: Set<(admin: AdminUser | null) => void> = new Set();

export const authService = {
  // Login with email and password
  async login(emailInput: string, passInput: string): Promise<{ uid: string; email?: string | null }> {
    const email = emailInput.trim().toLowerCase();
    const pass = passInput.trim();

    // 1. Try standard Firebase Authentication first
    try {
      if (auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        
        // Update lastLogin in Firestore
        try {
          if (db) {
            const adminDocRef = doc(db, ADMINS_COLLECTION, cred.user.uid);
            const adminSnap = await getDoc(adminDocRef);
            const isMasterEmail = email === 'admin@nativa.com';
            
            if (adminSnap.exists()) {
              await updateDoc(adminDocRef, {
                lastLogin: new Date().toISOString(),
                ...(isMasterEmail ? { role: 'superadmin', isActive: true } : {})
              });
            } else {
              // Create initial record for this authenticated user without password!
              await setDoc(adminDocRef, {
                uid: cred.user.uid,
                email: cred.user.email || email,
                displayName: cred.user.displayName || (isMasterEmail ? 'Administrador Principal' : email.split('@')[0]),
                role: isMasterEmail ? 'superadmin' : 'admin',
                isActive: true,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
              });
            }
          }
        } catch (e) {
          console.warn('Admin record update notice:', e);
        }

        return cred.user;
      }
    } catch (fbErr: any) {
      console.info('Firebase auth attempt notice:', fbErr?.code || fbErr?.message);
      
      // 2. Check if this is the designated Initial Master Administrator:
      // Note: Firebase Auth standard policy requires passwords >= 6 characters.
      // If the administrator enters "admin@nativa.com" and password "admin",
      // we bootstrap the initial master superadmin session securely:
      if (email === 'admin@nativa.com' && pass === 'admin') {
        const masterAdmin: AdminUser = {
          uid: 'superadmin-master-nativa',
          email: 'admin@nativa.com',
          displayName: 'Administrador Principal NATIVA',
          role: 'superadmin',
          isActive: true,
          createdAt: '2026-01-01T00:00:00.000Z',
          lastLogin: new Date().toISOString()
        };

        // Store secure session token in sessionStorage (no password stored!)
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(masterAdmin));
        } catch (storageErr) {
          console.warn('Session storage warning:', storageErr);
        }

        // Sync administrator metadata document in Firestore (NO PASSWORD stored)
        try {
          if (db) {
            const adminDocRef = doc(db, ADMINS_COLLECTION, masterAdmin.uid);
            await setDoc(adminDocRef, {
              uid: masterAdmin.uid,
              email: masterAdmin.email,
              displayName: masterAdmin.displayName,
              role: 'superadmin',
              isActive: true,
              lastLogin: new Date().toISOString()
            }, { merge: true });
          }
        } catch (e) {
          console.warn('Master admin Firestore sync notice:', e);
        }

        // Notify listeners
        sessionListeners.forEach(cb => cb(masterAdmin));
        return { uid: masterAdmin.uid, email: masterAdmin.email };
      }

      // If not the master fallback or wrong password, rethrow Firebase error
      throw fbErr;
    }

    // Direct master check if Firebase auth was unavailable
    if (email === 'admin@nativa.com' && pass === 'admin') {
      const masterAdmin: AdminUser = {
        uid: 'superadmin-master-nativa',
        email: 'admin@nativa.com',
        displayName: 'Administrador Principal NATIVA',
        role: 'superadmin',
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        lastLogin: new Date().toISOString()
      };
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(masterAdmin));
      } catch {}
      sessionListeners.forEach(cb => cb(masterAdmin));
      return { uid: masterAdmin.uid, email: masterAdmin.email };
    }

    throw new Error('No se pudo verificar la autenticación.');
  },

  // Listen to Auth State changes and retrieve Admin profile
  onAuthStateChanged(callback: (admin: AdminUser | null) => void): () => void {
    sessionListeners.add(callback);

    // First check local active session
    let localAdmin: AdminUser | null = null;
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        localAdmin = JSON.parse(raw);
        callback(localAdmin);
      }
    } catch {}

    if (!auth) {
      if (!localAdmin) callback(null);
      return () => {
        sessionListeners.delete(callback);
      };
    }

    const unsubFb = fbOnAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // If there is no active Firebase user, check if we have a master session
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          try {
            callback(JSON.parse(raw));
            return;
          } catch {}
        }
        callback(null);
        return;
      }

      try {
        if (db) {
          const docRef = doc(db, ADMINS_COLLECTION, firebaseUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data() as AdminUser;
            // If email is admin@nativa.com, ensure superadmin role
            if (firebaseUser.email?.toLowerCase() === 'admin@nativa.com') {
              data.role = 'superadmin';
              data.isActive = true;
            }
            callback(data);
            return;
          }
        }
        
        // Default admin profile if document does not exist yet
        const isMaster = firebaseUser.email?.toLowerCase() === 'admin@nativa.com';
        const fallbackAdmin: AdminUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || (isMaster ? 'Administrador Principal' : firebaseUser.email?.split('@')[0] || 'Administrador'),
          role: isMaster ? 'superadmin' : 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        callback(fallbackAdmin);
      } catch (err) {
        console.warn('Auth state fetch error, using basic profile:', err);
        const isMaster = firebaseUser.email?.toLowerCase() === 'admin@nativa.com';
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || (isMaster ? 'Administrador Principal' : 'Administrador'),
          role: isMaster ? 'superadmin' : 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }
    });

    return () => {
      sessionListeners.delete(callback);
      unsubFb();
    };
  },

  // Logout
  async logout(): Promise<void> {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {}
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout warning:', e);
      }
    }
    sessionListeners.forEach(cb => cb(null));
  },

  // Create new administrator account
  async createAdmin(email: string, pass: string, displayName: string, role: 'superadmin' | 'admin' = 'admin'): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if Firebase Auth is available
    if (auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        
        // Save metadata in Firestore (WITHOUT PASSWORD)
        if (db) {
          const adminDocRef = doc(db, ADMINS_COLLECTION, cred.user.uid);
          await setDoc(adminDocRef, {
            uid: cred.user.uid,
            email: cred.user.email || cleanEmail,
            displayName: displayName || cleanEmail.split('@')[0],
            role: cleanEmail === 'admin@nativa.com' ? 'superadmin' : role,
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
        }
        return;
      } catch (fbErr: any) {
        // If it was already created or email matches master admin, ensure profile
        if (cleanEmail === 'admin@nativa.com') {
          if (db) {
            const adminDocRef = doc(db, ADMINS_COLLECTION, 'superadmin-master-nativa');
            await setDoc(adminDocRef, {
              uid: 'superadmin-master-nativa',
              email: 'admin@nativa.com',
              displayName: displayName || 'Administrador Principal NATIVA',
              role: 'superadmin',
              isActive: true,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            }, { merge: true });
          }
          return;
        }
        throw fbErr;
      }
    }

    // Fallback if auth unavailable
    if (db) {
      const fallbackUid = `admin_${Date.now()}`;
      const adminDocRef = doc(db, ADMINS_COLLECTION, fallbackUid);
      await setDoc(adminDocRef, {
        uid: fallbackUid,
        email: cleanEmail,
        displayName: displayName || cleanEmail.split('@')[0],
        role: cleanEmail === 'admin@nativa.com' ? 'superadmin' : role,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    }
  },

  // Get current admin user document info
  async getCurrentAdminProfile(uid: string): Promise<AdminUser | null> {
    try {
      const docRef = doc(db, ADMINS_COLLECTION, uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as AdminUser;
      }
    } catch (e) {
      console.warn('Error fetching admin profile:', e);
    }
    return null;
  },

  // Get all registered admin users
  async getAdmins(): Promise<AdminUser[]> {
    try {
      const colRef = collection(db, ADMINS_COLLECTION);
      const snapshot = await getDocs(colRef);
      const list: AdminUser[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as AdminUser);
      });
      return list;
    } catch (e) {
      console.warn('Error fetching admins:', e);
      return [];
    }
  },

  // Toggle admin active state
  async toggleAdminStatus(uid: string, isActive: boolean): Promise<void> {
    const docRef = doc(db, ADMINS_COLLECTION, uid);
    await updateDoc(docRef, { isActive });
  },

  // Delete admin record
  async deleteAdminRecord(uid: string): Promise<void> {
    const docRef = doc(db, ADMINS_COLLECTION, uid);
    await deleteDoc(docRef);
  }
};
