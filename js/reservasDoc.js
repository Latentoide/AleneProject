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

export const updateRes = (id, newData) => {
  updateDoc(doc(db, "cita",id), newData)
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
                cita = doc;
              });
                getSmth("paciente", "id",cita.data().idPaciente);
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
                    console.log(cita.data().fecha);
                    console.log(date);
                    if(cita.data().fecha === date){
                      html += `
                      <tr>
                        <td scope="row">${cita.data().fecha}</td>
                        <td>${cita.data().hora}</td>
                        <td>${docId.nombre}</td>
                        <td class="regEnt">
                          <button data-id="${cita.id}" data-cita="${cita.data().id}" type="submit" class="citaIcono2 oculta">
                              <img src="../img/editar.png" alt="icono editar cita">
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
let form = null;
const observacionChange = document.getElementById("observaciopCita");
const btnRecargar = document.getElementById("recarga");
btnRecargar.addEventListener("click", (e) => {
  e.preventDefault();
  const btnChange = citas.querySelectorAll('.citaIcono2');
      btnChange.forEach(btn => {
          let theSamebool = false;
          if(!theSamebool){
              getSmth("cita", "id", parseInt(btn.dataset.cita));
              let cita = null;
              getWithQ((snapshot) => {
                  snapshot.docs.forEach((doc) => {
                      cita = doc.data();
                  })
                  if(cita.entrada){
                      btn.classList.remove('oculta')
                      btn.addEventListener('click',  (s) => {
                          s.preventDefault();
                          let theTrue = false;
                          getSmth("cita", "id", parseInt(btn.dataset.cita));
                          let cita = null;
                          getWithQ((snapshot) => {
                              snapshot.docs.forEach((doc) => {
                                  cita = doc;
                              })

                              getSmth("paciente", "id", cita.data().idPaciente);
                              let paciente = null;
                              getWithQ((snapshot) => {
                                snapshot.docs.forEach((doc) => {
                                  paciente = doc.data();
                                })
                                let html = `

                                
                              `
                              if(!theTrue){
                                  observacionChange.classList.remove('oculta');

                                  const numCita = document.getElementById("numCita");
                                  const fechaHora = document.getElementById("fechaHora");
                                  const pacienteAp = document.getElementById("pacienteAp");
                                  let as = `
                                    ${cita.data().id}
                                  `;
                                  numCita.innerHTML = as;

                                  as = `
                                    FECHA : ${cita.data().fecha} HORA : ${cita.data().hora}
                                  `;
                                  fechaHora.innerHTML = as;
                                  as = `
                                  PACIENTE : ${paciente.nombre} ${paciente.apellidos}
                                  `;
                                  laCitaNormal = cita.data();
                                  elDiCita = cita.id;
                                  pacienteAp.innerHTML = as;
                                  theTrue =true;
                                  theSamebool = true;
 
                              }
                              })
                          })                                  
                       })
                  }
              })  
          }
  })
})
let laCitaNormal = null;
let elDiCita = null;
const theButton = document.getElementById("buttonChange");
const elForm = document.getElementById("texto");
  theButton.addEventListener("click", async (e)=>{
    e.preventDefault();
    const laCita = laCitaNormal;
    const idCita = elDiCita;
    let laFor =  elForm.value
    laCita.observacion = laFor;
    console.log(laCita.observacion)
    async function a(id, cita){
      Swal.fire({
          title: '¿Confirmar observacion?',
          text: "No podrás revertir este proceso",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirmar!'
      }).then((result) => {
          if (result.isConfirmed) {
              updateRes(id, {
                  entrada : true,
                  fecha : cita.fecha,
                  hora : cita.hora,
                  id : cita.id,
                  idDoc : cita.idDoc,
                  idPaciente : cita.idPaciente,
                  observacion : cita.observacion,    
                  }) ;
              function ass (){
                  Swal.fire(
                      'Confirmado!',
                      'Se ha registrado la observacion.',
                      'success'
                  )
              }
              ass();
          }
      })
    }
    a(idCita, laCita);
  })

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