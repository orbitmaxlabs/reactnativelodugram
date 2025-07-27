// Firebase configuration for Lodugram
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkWfYFDm84s3bz_aUAUAfUDmxxjg7DNnw",
  authDomain: "lodugram.firebaseapp.com",
  projectId: "lodugram",
  storageBucket: "lodugram.appspot.com",
  messagingSenderId: "506675227207",
  appId: "1:506675227207:web:162dee371450d6cdccdf62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Lazy initialization functions
let _auth = null;
let _db = null;
let _storage = null;

export const getFirebaseAuth = () => {
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
};

export const getFirebaseDB = () => {
  if (!_db) {
    _db = getFirestore(app);
  }
  return _db;
};

export const getFirebaseStorage = () => {
  if (!_storage) {
    _storage = getStorage(app);
  }
  return _storage;
};

// For backward compatibility
export const auth = getFirebaseAuth();
export const db = getFirebaseDB();
export const storage = getFirebaseStorage();

export default app; 