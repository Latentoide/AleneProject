// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-analytics.js";
import { getFirestore, 
    collection, 
    addDoc,
    getDocs,
    deleteDoc,
    onSnapshot,
    doc,
    query,
    where,
    orderBy,
    limit 
 } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js";
 import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";

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

const db = getFirestore();
const auth = getAuth();
var q = null;
export const getWithQ = (callback) => {
    onSnapshot(q, callback);
}

export const onGetPacientes = (callback) => {
    onSnapshot(collection(db,"paciente"),callback);
}

export const getOneUser = (tabl, usuario, contrasenya) => {
    q = query(collection(db, tabl), where("usuario", "==", usuario), where("contrasenya", "==", contrasenya));
}


const form = document.getElementById("task-form"); 
//const taskCont = document.getElementById("task-form");

window.addEventListener('DOMContentLoaded', e => {
    e.preventDefault();
})
form.addEventListener("submit", async e => {
    signOut(auth).then(() => {
      }).catch((error) => {
      });
      
    e.preventDefault();
    let usuario = form["usuario"].value;
    let contrasenya = form["password"].value;

    getOneUser("paciente", usuario, contrasenya);
    let nombre = "";
    let apellido = "";
    getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
            const paciente = doc.data();
            nombre = paciente.nombre;
            apellido = paciente.apellidos;
            //aqui ya ha recogido el usuario
            signInWithEmailAndPassword(auth, paciente.email, paciente.contrasenya)
            .then((userCredential) => {
                window.location.assign("crearCitas.html");
                MSJOK();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                MSJERROR();
            });
        })
    });






    
})

const MSJOK = () =>{
    Swal.fire(
        'Buen trabajo!',
        'Datos guardados correctamente',
        'success'
    )
}

const MSJERROR = () =>{
    Swal.fire(
        'Oops!',
        'Los datos no fueron guardados correctamente',
        'error'
    )
}

async function put (){
    onGetPacientes((querySnapshot) => {
        let html ='';
        //Coger todos los datos de una lista
        querySnapshot.forEach(doc =>{
            const paciente = doc.data();
            html += `
                <div>
                    <h3>${paciente.nombre}</h3>
                    <p>${paciente.apellidos}</p>
                    <p>${paciente.id}</p>
                    <button class='btn-delete' data-id="${doc.id}">Delete</button>
                    <button class='btn-edit' data-id="${doc.id}">Edit</button>
                </div>
            
            `
        })

        taskCont.innerHTML=html;

        const btnDelete = taskCont.querySelectorAll('.btn-delete');
        // borrar un dato de una lista
        btnDelete.forEach(btn => {
            btn.addEventListener('click', ({target:{dataset}}) => {
                deleteTask(dataset.id, "paciente");
            })
        })
    })
}