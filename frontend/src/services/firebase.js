// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNHdQM5yFhkx5bheyp-g4DFM7rqQGs-Gk",
  authDomain: "turf-booking-system-b52c8.firebaseapp.com",
  projectId: "turf-booking-system-b52c8",
  storageBucket: "turf-booking-system-b52c8.appspot.com",
  messagingSenderId: "292225614534",
  appId: "1:292225614534:web:25f0c58e10f26941b5cdc7",
  measurementId: "G-0CPQ6CVR7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and export the `auth` object
const auth = getAuth(app); // This initializes the authentication

// Export any other Firebase modules you might need
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
