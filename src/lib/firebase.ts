import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const defaultProjectId = "gen-lang-client-0570662670";
const defaultAppId = "1:745097466596:web:ec0ffe1ea46fae992f12f1";
const defaultApiKey = "AIzaSyB_622XWomHkUl_BMQf1MQhRO66DykqVyY";
const defaultAuthDomain = "gen-lang-client-0570662670.firebaseapp.com";
const defaultDbId = "ai-studio-nativaproductosn-ad59d247-7fa3-4d13-b676-cc6cf3987241";
const defaultStorageBucket = "gen-lang-client-0570662670.firebasestorage.app";
const defaultSenderId = "745097466596";

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || firebaseConfigJson?.apiKey || defaultApiKey,
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || firebaseConfigJson?.authDomain || defaultAuthDomain,
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || firebaseConfigJson?.projectId || defaultProjectId,
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || firebaseConfigJson?.storageBucket || defaultStorageBucket,
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || firebaseConfigJson?.messagingSenderId || defaultSenderId,
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || firebaseConfigJson?.appId || defaultAppId
};

const databaseId = (import.meta.env.VITE_FIRESTORE_DATABASE_ID as string) || firebaseConfigJson?.firestoreDatabaseId || defaultDbId;

// Initialize Firebase App safely
let appInstance: any;
let authInstance: any;
let dbInstance: any;
let storageInstance: any;

try {
  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
  dbInstance = databaseId ? getFirestore(appInstance, databaseId) : getFirestore(appInstance);
  storageInstance = getStorage(appInstance);
} catch (initErr) {
  console.warn('Firebase initialization notice (safe fallback applied):', initErr);
  try {
    appInstance = initializeApp(firebaseConfig, 'fallback-nativa');
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
  } catch (secondaryErr) {
    console.warn('Firebase secondary initialization warning:', secondaryErr);
  }
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  Timestamp,
  serverTimestamp,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadString
};

export type { User };
