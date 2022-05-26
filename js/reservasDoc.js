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
var q = null;

export const addCita = (fecha, hora, idCita, idDoc, idPaciente, observacion) => {
  addDoc(collection(db, "cita"), { fecha:fecha,hora: hora,idCita: idCita,idDoc: idDoc,idPaciente: idPaciente,observacion: observacion, entrada:false });
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

export const saber = (tbl) => {
  q = query(collection(db, tbl), where( "email","==", email))
}

export const onGetCitas = (callback) => {
  onSnapshot(collection(db,"citas"),callback);
}

export const onGetEspecialidades = (callback) => {
  onSnapshot(collection(db,"especialidad"),callback);
}

export const onGetDoctores = (callback) => {
  onSnapshot(collection(db,"doctor"),callback);
}

export const getSmth = (tabla, campo, nomrbeEsp) => {
  q = query(collection(db, tabla), where( campo,"==", nomrbeEsp))
}

export const getFechaHora = (fechaj, idDocj) => {
  q = query(collection(db, "cita"), where( "fecha","==", fechaj), where("idDoc", "==", idDocj))
}

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
const isOn = true;
const db = getFirestore();
const user = null;
let email = null;
let numeroId = 0;
const auth = getAuth();
const citas = document.getElementById("citas");
const crearVer = document.getElementById("alejandro");
let usu = null;
let quienEs = "";
async function saberQuien(){
  saber("paciente");
  getWithQ((snapshot) => {
    snapshot.docs.forEach((doc) => {
      usu = doc.data();
    })
    console.log(usu);
    if(usu == null){
      saber("doctor");
      getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
          usu = doc.data();
        })
        console.log(usu);
        if(usu == null){
          saber("recepcionista");
          getWithQ((snapshot) => {
            snapshot.docs.forEach((doc) => {
              usu = doc.data();
            })
            if(usu == null){
              saber("admin");
              getWithQ((snapshot) => {
              snapshot.docs.forEach((doc) => {
                  usu = doc.data();
              })
              quienEs = "admin";
              console.log(quienEs);
              Inicio();
              });
            }else{
              quienEs = "recepcionista";
              console.log(quienEs);
              Inicio();
            }
          });
        }else{
          quienEs = "doctor";
          console.log(quienEs);
          Inicio();
        }
      });
    }
    else{
      quienEs = "paciente";
      console.log(quienEs);
      Inicio();
    }
  });

}
  async function Inicio(){
    console.log(crearVer.dataset.id)
    if(crearVer.dataset.id === "ver"){
      if(quienEs == "doctor"){
        console.log("ver");
        if(isOn){
          MSJCUENTA();  
          let idPac = null;
          getSmth("doctor", "email", email)
          getWithQ((snapshot) => {
            snapshot.docs.forEach((doc) => {
              idPac = doc.data();
            })
            getSmth("cita", "idDoc", idPac.id);
            let cita = null;
            let html = null;
            getWithQ((snapshot) => {
              snapshot.docs.forEach((doc) => {
                cita = doc.data();
              });
                getSmth("paciente", "id",cita.idPaciente);
                let docId = null;
                let espId = null;
                getWithQ((snapshot) => {
                  snapshot.docs.forEach((doc) => {
                    docId = doc.data();
                  })

                  getSmth("especialidad", "id",idPac.idEspecialidad);
                  getWithQ((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                      espId = doc.data();
                    })

                    if(cita.fecha == date){
                      html += `
                      <tr>
                        <td scope="row">${cita.fecha}</td>
                        <td>${cita.hora}</td>
                        <td>${docId.nombre}</td>
                        <td class="regEnt">
                          <button type="submit" class="citaIcono2 oculta">
                              <img data-id="${cita.id} " src="../img/editar.png" alt="icono editar cita">
                          </button>   
                        </td>
                      </tr>
                      `
                      citas.innerHTML=html;
                    }
                  })
                });   
              })
              citas.innerHTML=html;
            })
        }
      }
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        user = auth.currentUser;
        email = user.email;
        saberQuien();
      } else {
        isOn = false;
      }
    });
})


function MSJCUENTA(){
    let timerInterval
  Swal.fire({
    title: 'Inicio correcto!',
    html: 'Bienvenido tu inicio a sido correcto',
    timer: 1500,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  })
  }