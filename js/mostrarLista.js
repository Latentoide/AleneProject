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
const db = getFirestore();

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
  onSnapshot(collection(db,"cita"),callback);
}

export const getSmth = (tabla, campo, nomrbeEsp) => {
  q = query(collection(db, tabla), where( campo,"==", nomrbeEsp))
}

export const getCitas = () => {
  q = query(collection(db, "cita"), where( "entrada","==", true), orderBy("hora", "asc"))
}

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");

const lista = document.getElementById("lista");

window.addEventListener("DOMContentLoaded", async ()=>{
  getCitas();
  getWithQ((snapshot) => {
    let cita = null;
    snapshot.docs.forEach((doc) => {
      cita = doc.data();
    })
    let html = "";
        getSmth("doctor", "id", cita.idDoc);
        let elDoctor = null;
        getWithQ((snapshot) => {
            snapshot.docs.forEach((doc) => {
                elDoctor = doc.data();
            })
            getSmth("especialidad", "id", elDoctor.idEspecialidad);
            let laEspecialidad = null;
            getWithQ((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    laEspecialidad = doc.data();
                })
                getSmth("paciente", "id", cita.idPaciente);
                let elPaciente = null;
                getWithQ((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        elPaciente = doc.data();
                    })
                    if(cita.fecha == date){
                      getSmth("solicita_despacho", "fecha", date);
                      let elSolicita = null;
                      getWithQ((snapshot) => {
                          snapshot.docs.forEach((doc) => {
                              elSolicita = doc.data();
                          })
                          console.log(elSolicita.idDespacho);
                          getSmth("despacho", "id", elSolicita.idDespacho);
                          let elDespacho = null;
                          getWithQ((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                              elDespacho = doc.data();
                              })
                              html += `
                                <tr data-id="${cita.id}">
                                    <td scope="row">${cita.hora}</td>
                                    <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                    <td>${elPaciente.nombre} ${elPaciente.apellidos}</td>
                                    <td>Piso:${elDespacho.piso} Puerta:${elDespacho.puerta}</td>
                                </tr>
                                `
                              lista.innerHTML=html;
                          })  
                        })
                    }

                  })

            })
        })
      })

      setTimeout(refrescar, 60000);
      function refrescar(){
        location.reload();
      }
  })