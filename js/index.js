
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


export const addPacDoc = (nombre, apellido, email, telf, dir, pob, pro, pais, usu, cont, numeroId, idEspecialidad, esDoc, tabl) => {
    if(esDoc){
        addDoc(collection(db, tabl), { nombre:nombre,apellidos: apellido,email: email,telefono: telf,direccion: dir,poblacion: pob,provincia: pro,ais: pais,usuario: usu,contrasenya: cont,id: numeroId, idEspecialidad : idEspecialidad});
    }else{
        addDoc(collection(db, tabl), { nombre:nombre,apellidos: apellido,email: email,telefono: telf,direccion: dir,poblacion: pob,provincia: pro,ais: pais,usuario: usu,contrasenya: cont,id: numeroId});
    }

}

/*export const getUsu = (tabl) =>{
    getDocs(collection(db,tabl));
}*/

export const onGetPacientes = (callback) => {
    onSnapshot(collection(db,"paciente"),callback);
}
export const onGetDoctores = (callback) => {
    onSnapshot(collection(db,"doctor"),callback);
}
export const onGetRecepcionistas = (callback) => {
    onSnapshot(collection(db,"recepcionista"),callback);
}
export const onGetEspecialidades = (callback) => {
    onSnapshot(collection(db,"especialidad"),callback);
}

export const deleteTask = (id, tabl) => {
    deleteDoc(doc(db, tabl, id));
};

var q = null;

export const getOne = (tabl, id) => {
    q = query(collection(db, tabl), where( "id","==", id))
}

export const getLastOf = (tabl) => {
    q = query(collection(db, tabl), orderBy("id", "desc"), limit(1) );
}


export const getWithQ = (callback) => {
    onSnapshot(q, callback);
}









const form = document.getElementById("task-form");
const taskCont = document.getElementById('tasks-container');

window.addEventListener('DOMContentLoaded', async () => {
    getLastOf("paciente");
    var numeroId = 0;
    getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
            numeroId = doc.data().id +1;
            console.log(numeroId);
        })
    });
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

var numeroId = 0;
let nombre = null;
    let apellido = null;
    let email = null;
    let telf = null;
    let dir = null;
    let pob = null;
    let pro = null;
    let pais = null;
    let usu = null;
    let cont = null;
form.addEventListener('submit', async (e) =>{
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

 
    var coso = 0;
    getLastOf("paciente");
    getWithQ((snapshot) =>{
        snapshot.docs.forEach((doc) => {
            numeroId = doc.data().id +1;
            console.log(numeroId);
        })
    });
    try{
        addWithWait(20);
    }catch{
        MSJERROR();
    }

    function addWithWait(x) {
        return new Promise(resolve => {
          setTimeout(() => {
            addPacDoc(nombre, apellido, email, telf, dir, pob, pro, pais, usu, cont, numeroId, "a", false, "paciente");
            MSJOK(); 
            resolve(x);
          }, 2000);
        });
    }
    form.reset()
})





