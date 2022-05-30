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
 import {onAuthStateChanged, getAuth, signOut, updatePassword,signInWithEmailAndPassword,  sendEmailVerification, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";
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
          
  export const saber = (tbl) => {
    q = query(collection(db, tbl), where( "email","==", email))
  }
  export const getWithQ = (callback) => {
    onSnapshot(q, callback);
  }
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let q = null;
let usu = null;
let quienEs = null;
let email = null;
const db = getFirestore();
const auth = getAuth();

const paciente = document.getElementById("pacLinks");
const doctor = document.getElementById("docLinks");
const recepcionista = document.getElementById("recLinks");
const admin = document.getElementById("aminLinks");
const cerrar = document.getElementById("cerrar");

window.addEventListener('DOMContentLoaded', async () => {
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        user = auth.currentUser;
        email = user.email;
        saberQuien();
      } else {
        isOn = false;
      }
    });
})

function quite(){
    if(quienEs === "paciente"){
        paciente.classList.remove("oculta")
        cerrar.classList.remove("oculta")
    }else if(quienEs === "doctor"){
        doctor.classList.remove("oculta")
        cerrar.classList.remove("oculta")
    }else if(quienEs === "recepcionista"){
        recepcionista.classList.remove("oculta")
        cerrar.classList.remove("oculta")
    }
    else if(quienEs === "admin"){
        admin.classList.remove("oculta")
        cerrar.classList.remove("oculta")
    }
}

cerrar.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.assign("index.html");
      }).catch((error) => {
    });
})

async function saberQuien(){
    saber("paciente");
    getWithQ((snapshot) => {
      snapshot.docs.forEach((doc) => {
        usu = doc.data();
      })
      console.log(usu);
      if(usu == null){
        saber("doctor");
        getWithQ((snapshot) => {
          snapshot.docs.forEach((doc) => {
            usu = doc.data();
          })
          console.log(usu);
          if(usu == null){
            saber("recepcionista");
            getWithQ((snapshot) => {
              snapshot.docs.forEach((doc) => {
                usu = doc.data();
              })
              if(usu == null){
                saber("admin");
                getWithQ((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    usu = doc.data();
                })
                quienEs = "admin";
                console.log(quienEs);
                quite();
                });
              }else{
                quienEs = "recepcionista";
                console.log(quienEs);
                quite();
              }
            });
          }else{
            quienEs = "doctor";
            console.log(quienEs);
            quite();
          }
        });
      }
      else{
        quienEs = "paciente";
        console.log(quienEs);
        quite();
      }
    });
  
  }