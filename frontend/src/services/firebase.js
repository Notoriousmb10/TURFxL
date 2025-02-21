import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDNHdQM5yFhkx5bheyp-g4DFM7rqQGs-Gk",
  authDomain: "turf-booking-system-b52c8.firebaseapp.com",
  projectId: "turf-booking-system-b52c8",
  storageBucket: "turf-booking-system-b52c8.appspot.com",
  messagingSenderId: "292225614534",
  appId: "1:292225614534:web:25f0c58e10f26941b5cdc7",
  measurementId: "G-0CPQ6CVR7E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ✅ Prevent Analytics from running in Node.js
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { db, auth, googleProvider };
