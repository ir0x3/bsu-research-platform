import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBsiaMZVLNfQ9by3d3hFYRYxZ-xxkwZGrQ",
  authDomain: "bsu-platform.firebaseapp.com",
  projectId: "bsu-platform",
  storageBucket: "bsu-platform.firebasestorage.app",
  messagingSenderId: "783215904036",
  appId: "1:783215904036:web:3ef460827bed5db1ef1fb1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);