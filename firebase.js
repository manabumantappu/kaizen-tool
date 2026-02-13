// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAp8eV7ImhbPiS3sJFBq_hj-ngijh1e3b8",
  authDomain: "kaizen-tool-c59a3.firebaseapp.com",
  projectId: "kaizen-tool-c59a3",
  storageBucket: "kaizen-tool-c59a3.firebasestorage.app",
  messagingSenderId: "146761737018",
  appId: "1:146761737018:web:e2165574f49cca321aa603"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
