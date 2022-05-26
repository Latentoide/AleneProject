// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-analytics.js";
import { getFirestore, 
    collection, 
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    doc,
    query,
    where,
    orderBy,
    limit 
 } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";
 import { getAuth, sendEmailVerification, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBnxIFmXshn0AMEtqV1-Fwz3bZOIiQfpnw",
    authDomain: "alene-ef99f.firebaseapp.com",
    projectId: "alene-ef99f",
    storageBucket: "alene-ef99f.appspot.com",
    messagingSenderId: "434544182339",
    appId: "1:434544182339:web:f0385992b5fbbc01fd80f6",
    measurementId: "G-1Q7M2DT7G5"
};
          
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
var q = null;

export const getLastOf = (tabl) => {
  q = query(collection(db, tabl), orderBy("id", "desc"), limit(1) );
}

export const getWithQ = (callback) => {
  onSnapshot(q, callback);
}

export const saber = (tbl) => {
  q = query(collection(db, tbl), where( "email","==", email))
}

export const onGetCitas = (callback) => {
  onSnapshot(collection(db,"citas"),callback);
}

export const getSmth = (tabla, campo, nomrbeEsp) => {
  q = query(collection(db, tabla), where( campo,"==", nomrbeEsp))
}

const lista = document.getElementById("lista");

window.addEventListener("DOMContentLoaded", async ()=>{
    onGetCitas((querySnapshot) => {
        querySnapshot.forEach(doc =>{
            const cita = doc.data();
            
        })
    })
})  
