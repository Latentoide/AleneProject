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
 import { getAuth, updatePassword, sendEmailVerification, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";
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

export const getOne = (tabl, id) => {
    q = query(collection(db, tabl), where( "id","==", id))
}

const form = document.getElementById("form-changePass");
let storeId = "";
window.addEventListener('DOMContentLoaded', async () => {
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

        const btnEdit = taskCont.querySelectorAll('.btn-edit');
        btnDelete.forEach(btn => {
            btn.addEventListener('click', async  ({target:{dataset}}) => {
                const doc = await getTask(dataset.id);
                form['usuario'].value = doc.data.usuario;
                form['contrasenya'].value = doc.data.contrasenya;
                storeId = dataset.id;
            })
        })
    })
})

form.addEventListener("submit", () => {
    let newPassword = form['newPass'].value;
    updatePassword(user, newPassword).then(() => {
        MSJOK();
      }).catch((error) => {
       MSJERROR();
      });

      updateTask(storeId, {
        usario: form['usuario'].value,
        contrasenya : form['contrasenya'].value
    })
})

const MSJOK = () =>{
    Swal.fire(
        'Buen trabajo!',
        'PassWord Updateado',
        'success'
    )
}

const MSJERROR = () =>{
    Swal.fire(
        'Oops!',
        'Lo siento el password no fue guardado correctamente',
        'error'
    )
}
