import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAp8eV7ImhbPiS3sJFBq_hj-ngijh1e3b8",
  authDomain: "kaizen-tool-c59a3.firebaseapp.com",
  projectId: "kaizen-tool-c59a3",
  storageBucket: "kaizen-tool-c59a3.firebasestorage.app",
  messagingSenderId: "146761737018",
  appId: "1:146761737018:web:e2165574f49cca321aa603"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const kaizenRef = collection(db, "kaizens");

export async function saveKaizenToFirebase(data) {
  return await addDoc(kaizenRef, {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function getAllKaizens() {
  const q = query(kaizenRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function deleteKaizenById(id) {
  return await deleteDoc(doc(db, "kaizens", id));
}

import { doc, updateDoc } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export async function updateKaizenById(id, data) {
  const ref = doc(db, "kaizens", id);
  await updateDoc(ref, data);
}
import { getDoc } from 
"https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

export async function getKaizenById(id) {
  const ref = doc(db, "kaizens", id);
  const snapshot = await getDoc(ref);
  return { id: snapshot.id, ...snapshot.data() };
}
