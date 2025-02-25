import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQLCznWbXwqstV228X42vjhTi_EaUEvGM",
  authDomain: "todo-ee06c.firebaseapp.com",
  projectId: "todo-ee06c",
  storageBucket: "todo-ee06c.firebasestorage.app",
  messagingSenderId: "975882962991",
  appId: "1:975882962991:web:316bbb8a59e11d02dd9eda"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
