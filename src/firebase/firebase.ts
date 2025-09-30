// // src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc-9ZY-GkTctbdS02kLEia_csYfMeHyNQ",
  authDomain: "indisk-torsdag.firebaseapp.com",
  projectId: "indisk-torsdag",
  storageBucket: "indisk-torsdag.firebasestorage.app",
  messagingSenderId: "989609146773",
  appId: "1:989609146773:web:9c2bd9b530ead06ee49e9c",
  measurementId: "G-V9PH9BS0CR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
