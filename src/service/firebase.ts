import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAV83NbWXuoO_dlD6vH6jgnyICRJTpztDs",
  authDomain: "confluence-lube.firebaseapp.com",
  projectId: "confluence-lube",
  storageBucket: "confluence-lube.firebasestorage.app",
  messagingSenderId: "964207708790",
  appId: "1:964207708790:web:77f5a9f9aff2c93ad56d57",
  measurementId: "G-NDPCP746VK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
