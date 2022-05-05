
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
var tabla = "";


export const saveTask = (nombre, apellido, email, telf, dir, pob, pro, pais, usu, cont, numeroId) => {
    addDoc(collection(db, tabla), { nombre:nombre,apellido: apellido,email: email,telefono: telf,direccion: dir,poblacion: pob,provincia: pro,ais: pais,usuario: usu,contrasenya: cont,id: numeroId})
}

export const getUsu = () =>{
    getDocs(collection(db,tabla));
}

export const onGetUsu = (callback) => {
    onSnapshot(collection(db,tabla),callback);
}

export const deleteTask = id => {
    deleteDoc(doc(db, tabla, id));
};

var q = query(collection(db, "especialidad"), where( "id","==", 1));

export const getUsus = (callback) => {
    onSnapshot(q, callback);
}

function tablaIs(tab){
    tabla = tab;
}










const form = document.getElementById("task-form");
const taskCont = document.getElementById('tasks-container');

window.addEventListener('DOMContentLoaded', async () => {
    tablaIs("paciente");
    q = query(collection(db, tabla), orderBy("id", "desc"), limit(1) );
    var numeroId = 0;
    getUsus((snapshot) => {
        snapshot.docs.forEach((doc) => {
            numeroId = doc.data().id +1;
            console.log(numeroId);
        })
    });
    /*onGetUsu((querySnapshot) => {
        let html ='';
        //Coger todos los datos de una lista
        querySnapshot.forEach(doc =>{
            const tarea = doc.data();
            html += `
                <div>
                    <h3>${tarea.title}</h3>
                    <p>${tarea.descripcion}</p>
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
                deleteTask(dataset.id);
            })
        })
    })*/




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


form.addEventListener('submit', e =>{
    e.preventDefault();

    let nombre = form['Nombre'].value;
    let apellido = form['Apellido'].value;
    let email = form['Email'].value;
    let telf = form['Telefono'].value;
    let dir = form['Direccion'].value;
    let pob = form['Poblacion'].value;
    let pro = form['Provincia'].value;
    let pais = form['Pais'].value;
    let usu = form['Usuario'].value;
    let cont = form['Contrasenya'].value;
    q = query(collection(db, tabla), orderBy("id", "desc"), limit(1) );
    var numeroId = 0;
    getUsus((snapshot) => {
        snapshot.docs.forEach((doc) => {
            numeroId = doc.data().id +1;
        })
    });    
    saveTask(nombre, apellido, email, telf, dir, pob, pro, pais, usu, cont, numeroId);
    console.log(numeroId);
    MSJOK();
    

    form.reset();
})
