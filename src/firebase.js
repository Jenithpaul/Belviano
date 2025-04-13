// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-N-ls6j2RqlaPgDUv2vGBrt4CbQ56h0s",
  authDomain: "belviano-2045e.firebaseapp.com",
  projectId: "belviano-2045e",
  storageBucket: "belviano-2045e.firebasestorage.app",
  messagingSenderId: "808389066006",
  appId: "1:808389066006:web:938b7fc365bc25c6f52437",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);