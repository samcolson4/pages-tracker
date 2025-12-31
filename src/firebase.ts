// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB37mYZvfbWBVTdOuag8130T6VlXSTY9Jw",
  authDomain: "pages-tracker.firebaseapp.com",
  projectId: "pages-tracker",
  storageBucket: "pages-tracker.firebasestorage.app",
  messagingSenderId: "112804549876",
  appId: "1:112804549876:web:18019e33345eaa53f8faa1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
