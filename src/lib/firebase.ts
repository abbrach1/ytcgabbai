import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPtv9mqf7w_vpG8PbPjjW_t3kqXFu9D6s",
  authDomain: "ytcnetwork.firebaseapp.com",
  projectId: "ytcnetwork",
  storageBucket: "ytcnetwork.firebasestorage.app",
  messagingSenderId: "397887943496",
  appId: "1:397887943496:web:92a4b69eb90882e4a4b97d",
  measurementId: "G-WSPPD5454E",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
