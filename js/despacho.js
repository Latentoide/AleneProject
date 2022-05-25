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

var alert_despacho_s = document.getElementById('alert_despacho_s');
var alert_despacho_d = document.getElementById('alert_despacho_d');
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
export const getDespacho = (pisoq, puertaq,) => {
    q = query(collection(db, "despacho"), where( "piso","==", pisoq), where( "puerta","==", puertaq))
}

export const getDepsSol = (id,) => {
    q = query(collection(db, "solicita_despacho"), where( "fecha","==", fechacambiante.value), where( "idDoc","==", id))
}

export const addsolDes = (fecha, id, idDespacho, idDoc) => {
    addDoc(collection(db, "solicita_despacho"), { fecha:fecha,id: id,idDespacho: idDespacho,idDoc: idDoc});
}


const selection = document.getElementById("puerta_select");
const selectionpiso = document.getElementById("piso_select");
const fecha = document.getElementById("reg-form");
const fechacambiante = document.getElementById("dia");
let despachoJ = null;
let user = null;
let email = null;
let as = false;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
var tomorrow = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+(today.getDate()+1).toString().padStart(2,"0");

window.addEventListener('DOMContentLoaded', async () => {
    as = false;
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
    if(fechacambiante.value <= date){
        fechacambiante.value = tomorrow;
    }
    onGetDespSol((querySnapshot) =>{
        selection.innerHTML = "";
        selectionpiso.innerHTML = "";
        //Coger todos los datos de una lista
        querySnapshot.forEach(doc =>{
            getSmth("solicita_despacho", "idDespacho", doc.data().idDespacho);
            getWithQ((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    despachoJ = doc.data();
                })
                onGetDesp((querySnapshot) =>{
                    querySnapshot.forEach(doc =>{

                    })
                        
                    getWithQ((snapshot) => {
                        snapshot.docs.forEach((doc) => {
                            despachoJ = doc.data();
                        })
                        let theDoc = null;
                        getSmth("doctor", "email", email);
                        getWithQ((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                theDoc = doc.data();
                            })
                            
                            getDepsSol(theDoc.id);
                            let thing = null;
                            getWithQ((snapshot) => {
                                snapshot.docs.forEach((doc) => {
                                    thing = doc.data();
                                })

                                if(despachoJ.idDespacho != doc.data().id){
                                    console.log(thing);
                                    if(thing == null){
                                        alert_despacho_s.classList.remove('oculta');
                                        alert_despacho_d.classList.add('oculta');
                                    }else{
                                        alert_despacho_s.classList.add('oculta');
                                        alert_despacho_d.classList.remove('oculta');
                                    }
                                    let html =`
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        `;
            
                                        let a =`
                                            <option>1</option>
                                            <option>2</option>
                                        `;
            
                                    selectionpiso.innerHTML = a;
                                    selection.innerHTML = html;
                                }
                            })
                        })
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
    let thePiso =null;
    getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
            numId = doc.data();
        })
        getSmth("doctor", "email", email);
        getWithQ((snapshot) => {
            snapshot.docs.forEach((doc) => {
                doctor = doc.data();
            })
            getDespacho(parseInt(selectionpiso.value), parseInt(selection.value));
            getWithQ((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    thePiso = doc.data();
                })
                if(!as){
                    addsolDes(fechacambiante.value, numId.id+1,thePiso.id ,doctor.id);
                    as = true;
                }
            })
        })
    })

})