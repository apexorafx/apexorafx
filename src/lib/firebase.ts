
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-RjrXMLmXluwIgR2BSPPhydSbzII8q70",
  authDomain: "apexorafx-a4ceb.firebaseapp.com",
  projectId: "apexorafx-a4ceb",
  storageBucket: "apexorafx-a4ceb.appspot.com",
  messagingSenderId: "457224606026",
  appId: "1:457224606026:web:fafe48920285e9056fb1b3",
  measurementId: "G-B7JTMN9B6P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Analytics only on the client side
if (typeof window !== 'undefined') {
  try {
    getAnalytics(app);
  } catch (error) {
    console.log('Failed to initialize Analytics', error);
  }
}

export { app, auth };
