import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-FzV1h6cTebjQmAdprX63EDDK9eAV3hM",
  authDomain: "candlelighttechnology-55f34.firebaseapp.com",
  projectId: "candlelighttechnology-55f34",
  storageBucket: "candlelighttechnology-55f34.firebasestorage.app",
  messagingSenderId: "820398677702",
  appId: "1:820398677702:web:af5724061e23ebac8e81c7",
  measurementId: "G-QTB0YDJJGQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export default app;
