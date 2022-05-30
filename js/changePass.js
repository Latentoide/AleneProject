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
 import { getAuth, updatePassword,signInWithEmailAndPassword,  sendEmailVerification, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js";
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

export const getOne = (tabl, id) => {
    q = query(collection(db, tabl), where( "id","==", id))
}

export const getWithQ = (callback) => {
    onSnapshot(q, callback);
  }
  

export const getSmth = (tabla, campo, nomrbeEsp) => {
    q = query(collection(db, tabla), where( campo,"==", nomrbeEsp))
}

export const getUsu = (tabla, nomrbeEsp, pass) => {
    q = query(collection(db, tabla), where( "usuario","==", nomrbeEsp), where( "email","==", pass))
}


const form = document.getElementById("task-form");
let storeId = "";
window.addEventListener('DOMContentLoaded', async () => {

})
form.addEventListener("submit", (e) => {
    e.preventDefault();
    getUsu(form.dataset.id, form["usuario"].value, form["email"].value);
    let usu = null;
    getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
          usu = doc;
        })
        let contadorMin = 0;
        let contadorMay = 0;
        let contadorNum = 0;
        let contadorSim = 0;
        let haveIt = false;
        let contra = form['contrasenyaReg'].value;
        if(form['contrasenyaReg'].value == form['contrasenyaRep'].value){
            if(form['contrasenyaReg'].value == form['contrasenyaRep'].value){
                for (let index = 0; index < contra.length; index++) {
                    
                    var letra=contra.charAt(index);
                    if(letra.match(/[a-z]/)){
                        contadorMin++;
                    }else if(letra.match(/[A-Z]/)){
                        contadorMay++;
                    }else if(letra.match(/[0-9]/)){
                        contadorNum++;
                    }else if(letra==="$"||"!"||"%"||"#"||"="||"?"||"^"||"<"||">"||"-"||"@"){
                        contadorSim++;
                    }
                }
                if(contadorMay>0){
                    if(contadorMin>0){
                        if(contadorNum>0){
                            if(contadorSim>0){
                                haveIt =true;
                            }
                        }
                    }
                }
                    
                if(haveIt){
                    let newPassword = form['contrasenyaReg'].value;
                    let user;
                    signInWithEmailAndPassword(auth, usu.data().email, usu.data().contrasenya)
                    .then((userCredential) => {
                        user = userCredential.user;
                        MSJOK();
                    })
                    .catch((error) => {
                        MSJERROR();
                    });
                    updatePassword(user, newPassword).then(() => {
                        MSJOK();
                        if(form.dataset.id === "paciente"){
                            updateTask(usu.id, {
                                direccion : usu.direccion,
                                email : usu.email,
                                id : usu.id,
                                nombre : usu.nombre,
                                poblacion : usu.poblacion,
                                provincia : usu.provincia,
                                telefono : usu.provincia,
                                apellidos : usu.apellidos,
                                usario: usu.usuario,
                                contrasenya : form['contrasenya'].value
                            }).catch((error) => {
                            MSJERROR();
                            });
                        }
                        else if(form.dataset.id === "admin"){
                            updateTask(usu.id, {
                                email : usu.email,
                                usario: usu.usuario,
                                contrasenya : form['contrasenya'].value
                            }).catch((error) => {
                            MSJERROR();
                            });
                        }else if(form.dataset.id === "doctor"){
                            updateTask(usu.id, {
                                direccion : usu.direccion,
                                email : usu.email,
                                id : usu.id,
                                nombre : usu.nombre,
                                poblacion : usu.poblacion,
                                provincia : usu.provincia,
                                telefono : usu.provincia,
                                apellidos : usu.apellidos,
                                usario: usu.usuario,
                                idEspecialidad : usu.idEspecialidad,
                                contrasenya : form['contrasenya'].value
                            }).catch((error) => {
                            MSJERROR();
                            });
                        }
            
                    })
                }else{
                    MSJCONT();
                }
            }
        }
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

const MSJCONT = () =>{
    Swal.fire(
        'Oops!',
        'La contraseña tiene que tener al menos 8 caracteres, 1 mayúsucla, 1 minúsucla, 1 número, 1 simbolo como estos = "$!%#=?^<>-"',
        'error'
    )
}
