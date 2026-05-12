import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdVUrgAeSCbzBVCQVk0wnLRcKcywxp5bY",
  authDomain: "dineevent.firebaseapp.com",
  projectId: "dineevent",
  storageBucket: "dineevent.firebasestorage.app",
  messagingSenderId: "775751591653",
  appId: "1:775751591653:web:88a846761a8f8bba4e160c",
  measurementId: "G-EHH6XHWV7Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);


