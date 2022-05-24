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


const isOn = true;
const db = getFirestore();
const user = null;
let email = null;
let numeroId = 0;
const auth = getAuth();

const taskCont = document.getElementById('tasks-container');
const form = document.getElementById("task-form");
const select = document.getElementById("especialidad_select");
const selectdoctor = document.getElementById("doctor_select");
const dia = document.getElementById("dia");
const horas = document.getElementById("horas");
let theDoc = null;
let usu = null;
let quienEs = null;
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
            quienEs = "recepcionista";
            console.log(quienEs);
          });
        }else{
          quienEs = "doctor";
          console.log(quienEs);
        }
      });
    }
    else{
      quienEs = "paciente";
      console.log(quienEs);
    }
  });

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
  //necesito componente que no sea null para comprobar si esta creando no
  if(quienEs == "paciente" || quienEs == "doctor"){
    if(isOn){
      MSJCUENTA();
      let a = `<option selected>Doctor</option>`;
      selectdoctor.innerHTML = a;
      onGetDoctores((querySnapshot) => {
        let html ='';
        //Coger todos los datos de una lista
        querySnapshot.forEach(doc =>{
            const doctor = doc.data();
                html += `
                  <option>${doctor.nombre}, ${doctor.apellidos}</option>
                `
            selectdoctor.innerHTML=html;
        })
      })

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
  }else if(form.dataset.id === "crearCita"){
    MSJCUENTA();
    onGetEspecialidades((querySnapshot) =>{
      let html ='';
      //Coger todos los datos de una lista
      querySnapshot.forEach(doc =>{
          const especialidad = doc.data();
          html += `
              <option>${especialidad.nombre}</option>
          `
      })

      select.innerHTML=html;
  })
    select.addEventListener("change", async (e) =>{
      e.preventDefault();
      getSmth("especialidad", "nombre", select.value);
      await getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
          numeroEsp  = doc.data();
        })
        getSmth("doctor", "idEspecialidad", numeroEsp.id);
        getWithQ((snapshot) => {
          let html ='';
          snapshot.docs.forEach((doc) => {
            const doctor = doc.data();
      
            html += `
                <option data-id="${doctor.id}">${doctor.nombre}</option>
            `
          })
      
          selectdoctor.innerHTML=html;
          getSmth("doctor", "nombre", selectdoctor.value);

          let horasAr = [];
          getWithQ((snapshot) => {
            snapshot.docs.forEach((doc) => {
                theDoc = doc.data();
            })
            dia.addEventListener("change", async (e) => {
              getFechaHora(dia.value, theDoc.id);
              getWithQ((snapshot) => {
                let putHora = '';
                let hora = null;
                let tiempo = 8;
                let cantidad = 0;
                let prueba = false;
                snapshot.docs.forEach((doc) => {
                  hora = doc.data();
                  horasAr[cantidad++] = hora.hora;
                })
                let u = 0;
                for(var i = 8; i < 15; i++){
                  console.log(horasAr[u]);
                  if(i >= 10){
                    if(i+":00" === horasAr[u]){
                    }else{
                      putHora = `
                        <option>${i}:00<option>
                      `;
                      horas.innerHTML += putHora;
                    }
                  }else{
                    if("0"+i+":00" === horasAr[u]){
                    }else{
                      putHora = `
                        <option>0${i}:00<option>
                      `;
                      horas.innerHTML += putHora;
                    }
                  }
                  u++;
                }
              });
            })
            
          });
        });
      });
    })
  }
  
})
function MSJCUENTA(){
  let timerInterval
Swal.fire({
  title: 'Inicio correcto!',
  html: 'Bienvenido tu inicio a sido correcto',
  timer: 1000,
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
let numeroEsp = null;


form.addEventListener("submit", async (e) => {
  e.preventDefault();
  getLastOf("citas");
  let citaId = 0;
  getWithQ((snapshot) => {
    snapshot.docs.forEach((doc) => {
      citaId = doc.data().id +1;
    })
  });
  getOne();
  let l = null;
  getWithQ((snapshot) => {
    snapshot.docs.forEach((doc) => {
        l = doc.data();
        console.log(l);
    })
    addCita(dia.value,horas.value, citaId, theDoc.id, l.id, null);
  });

    //queda hacer select de doctores disponibles

})