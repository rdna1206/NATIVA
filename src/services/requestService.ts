import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from '../lib/firebase';
import { CustomerRequest, RequestStatus } from '../types';

const REQUESTS_COLLECTION = 'requests';
const LOCAL_STORAGE_KEY = 'nativa_local_requests';

export const requestService = {
  // Save new customer request from landing page
  async createRequest(reqData: Omit<CustomerRequest, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const now = new Date().toISOString();
    const generatedId = `req_${Date.now()}`;
    const newRequest: CustomerRequest = {
      ...reqData,
      id: generatedId,
      status: 'pendiente' as RequestStatus,
      createdAt: now,
      updatedAt: now
    };

    // Save to localStorage as immediate offline cache
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      existing.unshift(newRequest);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    } catch {}

    if (!db) {
      return generatedId;
    }

    try {
      const colRef = collection(db, REQUESTS_COLLECTION);
      const newDoc = await addDoc(colRef, {
        ...reqData,
        status: 'pendiente' as RequestStatus,
        createdAt: now,
        updatedAt: now
      });
      return newDoc.id;
    } catch (err) {
      console.warn('Firestore write failed, request saved locally:', err);
      return generatedId;
    }
  },

  // Real-time subscription to customer requests (for Admin Panel)
  subscribeRequests(callback: (requests: CustomerRequest[]) => void): () => void {
    const getLocal = (): CustomerRequest[] => {
      try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      } catch {
        return [];
      }
    };

    if (!db) {
      callback(getLocal());
      return () => {};
    }

    try {
      const colRef = collection(db, REQUESTS_COLLECTION);
      
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const list: CustomerRequest[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<CustomerRequest, 'id'>;
          list.push({
            ...data,
            id: docSnap.id
          });
        });

        // Merge any local offline requests if not in firestore
        const local = getLocal();
        local.forEach(locReq => {
          if (!list.some(r => r.id === locReq.id)) {
            list.push(locReq);
          }
        });

        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(list);
      }, (error) => {
        console.warn('Firestore requests subscription notice:', error);
        callback(getLocal());
      });

      return unsubscribe;
    } catch (e) {
      callback(getLocal());
      return () => {};
    }
  },

  // Update request status (pendiente | contactada | completada)
  async updateStatus(requestId: string, status: RequestStatus, notes?: string): Promise<void> {
    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    await updateDoc(docRef, updateData);
  },

  // Delete customer request
  async deleteRequest(requestId: string): Promise<void> {
    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    await deleteDoc(docRef);
  }
};
