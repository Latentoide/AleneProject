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
let q = null;
const db = getFirestore();
const auth = getAuth();
export const getLastOf = (tabl) => {
    q = query(collection(db, tabl), orderBy("id", "desc"), limit(1) );
  }

export const onGetDespSol = (callback) => {
    onSnapshot(collection(db,"solicita_despacho"),callback);
}

  export const onGetDesp= (callback) => {
    onSnapshot(collection(db,"despacho"),callback);
}

export const getWithQ = (callback) => {
    onSnapshot(q, callback);
}

export const getSmth = (tabla, campo, nomrbeEsp) => {
    q = query(collection(db, tabla), where( campo,"==", nomrbeEsp))
}

export const addsolDes = (fecha, id, idDespacho, idDoc) => {
    addDoc(collection(db, "solicita_despacho"), { fecha:fecha,id: id,idDespacho: idDespacho,idDoc: idDoc});
}


const selection = document.getElementById("reg-form");
const fecha = document.getElementById("fecha");
const fechacambiante = document.getElementById("laFecha");
let despachoJ = null;
let user = null;
let email = null;

window.addEventListener('DOMContentLoaded', async () => {
    onAuthStateChanged(auth, (user) => {
        if (user != null) {
          user = auth.currentUser;
          email = user.email;
        } else {
          isOn = false;
        }
      });
})
fechacambiante.addEventListener("change", async ()=>{
    onGetDespSol((querySnapshot) =>{
        selection.innerHTML = "";
        //Coger todos los datos de una lista
        querySnapshot.forEach(doc =>{
            console.log(doc.data())
            getSmth("solicita_despacho", "idDespacho", doc.data().idDespacho);
            getWithQ((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    despachoJ = doc.data();
                })
                onGetDesp((querySnapshot) =>{
                    querySnapshot.forEach(doc =>{
                        console.log(doc.data())
                        if(despachoJ.idDespacho != doc.data().id){
                            let html =`
                                <option data-id="${despachoJ.idDespacho}">Puerta: ${doc.data().puerta} Piso: ${doc.data().piso}</option>
                            `;
                            selection.innerHTML += html;
                        }

                    })
                })
            })
        })
    })
})
fecha.addEventListener("submit", async (e)=>{
    e.preventDefault();
    getLastOf("solicita_despacho");
    let numId = 0;
    let doctor = null;
    getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
            numId = doc.data();
        })
        getSmth("doctor", "email", email);
        getWithQ((snapshot) => {
            snapshot.docs.forEach((doc) => {
                doctor = doc.data();
            })
            console.log(selection);
            addsolDes(fechacambiante, numId,selection.value.dataset.id ,doctor.id);
        })
    })

})