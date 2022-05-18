
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

const db = getFirestore();


export const addPacDoc = (nombre, apellido, email, telf, dir, pob, pro, pais, usu, cont, numeroId, idEspecialidad, esDoc, tabl) => {
    if(esDoc){
        addDoc(collection(db, tabl), { nombre:nombre,apellidos: apellido,email: email,telefono: telf,direccion: dir,poblacion: pob,provincia: pro,ais: pais,usuario: usu,contrasenya: cont,id: numeroId, idEspecialidad : idEspecialidad});
    }else{
        addDoc(collection(db, tabl), { nombre:nombre,apellidos: apellido,email: email,telefono: telf,direccion: dir,poblacion: pob,provincia: pro,ais: pais,usuario: usu,contrasenya: cont,id: numeroId});
        
    }

}

export const getTasks = () => getDocs(collection(db,tabl));

export const getTask = id => getDoc(doc(db, tabl, id));

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

export const updateTask = (id, newFields) => updateDoc(doc(db, tabl, id), newFields);

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
    if(form.dataset == "paciente"){
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

            /*const btnEdit = taskCont.querySelectorAll('.btn-edit');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async  ({target:{dataset}}) => {
                    const doc = await getTask(dataset.id);
                    form['usuario'].value = doc.data.usuario;
                    form['contrasenya'].value = doc.data.contrasenya;
                    storeId = dataset.id;
                    updateTask(storeId, {
                        usario: form['usuario'].value;
                        contrasenya : form['contrasenya'].value;
                    })
                })
            })*/
        })
    }else if(form.dataset.id === "recepcionista"){
        getLastOf("recepcionista");
        var numeroId = 0;
        getWithQ((snapshot) => {
            snapshot.docs.forEach((doc) => {
                numeroId = doc.data().id +1;
                console.log(numeroId);
            })
        });
    }
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
    if(form.dataset.id === "paciente" || form.dataset.id === "recepcionista"){
        console.log(form.dataset.id);
        nombre = form['nombre'].value;
        apellido = form['apellido'].value;
        email = form['email'].value;
        telf = form['telefono'].value;
        dir = form['direccion'].value;
        pob = form['poblacion'].value;
        pro = form['provincia'].value;
        pais = form['pais'].value;
        usu = form['usuario'].value;


        if(form.dataset.id === "recepcionista"){
            if(){ //no dejar que email y usuario esten repetidos aqui, funcion async para comprobar con una query, luego changePass recoger auth correcto
                cont = passwordDoIt();
                getLastOf("recepcionista");
                getWithQ((snapshot) =>{
                    snapshot.docs.forEach((doc) => {
                        numeroId = doc.data().id +1;
                        register("recepcionista");
                    })
                });
            }
        }else{
            cont = form['contrasenya'].value;
            contRep = form['cotnrasenyaRep'].value;
            if(cont === contRep){
                getLastOf("paciente");
                getWithQ((snapshot) =>{
                    snapshot.docs.forEach((doc) => {
                        numeroId = doc.data().id +1;
                        register("paciente");
                    })
                });
            }
        }
        
        form.reset()
    }
    else if(form.dataset.id === "doctor"){

    }
})

async function register(tabl){
    const auth = getAuth();
            var user = null;
            const credentialsuser = await createUserWithEmailAndPassword(auth, email, cont)
            .then((userCredential) => {
                user = userCredential.user;
                MSJOK();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                MSJERROR();
            });
            await sendEmailVerification(user).then(() =>{
                addPacDoc(nombre, apellido, email, telf, dir, pob, pro, pais, usu, cont, numeroId, 0, false, tabl);
                //redirigir a la página buena
            });
}





let simbolos = "$#_-.,'¿?!¡%&/()";
let mayusculas = "ABCDEFGHIJKLMOPQRSTUVWXYZ";
let minusculas = "abcdefghijklmnopqrsetuvwxyz";
let numeros = "1234567890";

let random = simbolos+mayusculas+minusculas+numeros;

let haveMayus = false;
let haveMinus = false;
let havaNum = false;
let haveSim = false;

let theChar = '';
let i = 0;

let str = "";

function passwordDoIt(){
    do{
        i = getRandomNum();
        theChar = random.charAt(i);
        if(simbolos.includes(theChar)){
            haveSim = true;
            i++;
        }
        if(mayusculas.includes(theChar)){
            haveMayus = true;
            i++;
        }
        if(minusculas.includes(theChar)){
            haveMinus = true;
            i++;
        }
        if(numeros.includes(theChar)){
            havaNum = true;
            i++;
        }
        str += theChar;
        if(str.length > 9){
            str ="";
            theChar = '';
            haveMayus = false;
            haveMinus = false;
            havaNum = false;
            haveSim = false;
        }
    }while(str.length < 8 && (haveMayus = true) && (haveMinus = true) && (havaNum = true) && (haveSim = true));
    console.log(str);
    return str;
}

function getRandomNum(){
    let u =Math.floor((Math.random()*(random.length-0+1)+0)) 
    return u;
}