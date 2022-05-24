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
 import { getAuth, sendEmailVerification, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";
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

export const addCita = (fecha, hora, idCita, idDoc, idPaciente, observacion) => {
  addDoc(collection(db, "cita"), { fecha:fecha,hora: hora,idCita: idCita,idDoc: idDoc,idPaciente: idPaciente,observacion: observacion});
}

export const getLastOf = (tabl) => {
  q = query(collection(db, tabl), orderBy("id", "desc"), limit(1) );
}

export const getWithQ = (callback) => {
  onSnapshot(q, callback);
}

export const getOne = () => {
  q = query(collection(db, "paciente"), where( "email","==", email))
}
export const onGetCitas = (callback) => {
  onSnapshot(collection(db,"citas"),callback);
}
const isOn = true;
const db = getFirestore();
const user = null;
    const displayName = null;
    const email = null;
    const photoURL = null;
    const emailVerified = null;
    const uid = null;
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    user = auth.currentUser;
    displayName = user.displayName;
    email = user.email;
    photoURL = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;
  } else {
    isOn = false;
  }
});
const taskCont = document.getElementById('tasks-container');
const form = document.getElementById("task-form");

window.addEventListener('DOMContentLoaded', async () => {
  if(form.dataset == "showpaciente" || form.dataset == "showdoctor"){
    if(isOn){
      onGetPacientes((querySnapshot) => {
        let html ='';
        //Coger todos los datos de una lista
        querySnapshot.forEach(doc =>{
            const cita = doc.data();
            if(cita.email === email){
                html += `
                <div>
                    <h3>${cita.nombre}</h3>
                    <p>${cita.apellidos}</p>
                    <p>${cita.id}</p>
                    <button class='btn-delete' data-id="${doc.id}">Delete</button>
                    <button class='btn-edit' data-id="${doc.id}">Edit</button>
                </div>
            `
            }
            taskCont.innerHTML=html;
        })
      })
    }
  }else if(form.dataset == "crearCita"){
    getLastOf("cita");
    var citaId = 0;
    getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
          citaId = doc.data().id +1;
        })
    });
  }
})

form.addEventListener("submit", async () => {
  const l = getTheIdPac();
    //queda hacer select de doctores disponibles
  await awaitaddCita(form["fecha"].value,form["hora"].value, citaId, form["idDoc"].value, l.id, form["observacion"].value);
})
await function getTheIdPac(){
 return getOne;
}