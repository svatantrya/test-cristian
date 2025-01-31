import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "flatease-79932",
  storageBucket: "flatease-79932.firebasestorage.app",
  messagingSenderId: "1000356661600",
  appId: "1:1000356661600:web:37656daff5e99224e5b605",
};

// Inițializează Firebase
export const app = initializeApp(firebaseConfig);

// Inițializează Firestore
export const db = getFirestore(app);

// Expune Firebase Authentication
const auth = getAuth(app);

export default auth;
