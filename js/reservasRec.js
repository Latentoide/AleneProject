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

export const updateRes = (id, newData) => {
    updateDoc(doc(db, "cita",id), newData)
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
  onSnapshot(collection(db,"cita"),callback);
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

export const getLaCita = (id) => {
    q = query(collection(db, "cita"), where( "id","==", id))
}

export const getDesp = (idDocss, fechaas) => {
    q = query(collection(db, "solicita_despacho"), where("fecha","==", fechaas), where("idDoc", "==", idDocss))
  }

export const getFechaHora = (fechaj, idDocj) => {
  q = query(collection(db, "cita"), where( "fecha","==", fechaj), where("idDoc", "==", idDocj))
}

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,"0")+'-'+today.getDate().toString().padStart(2,"0");
const filtroDoctor = document.getElementById("doctor_select");

const isOn = true;
const db = getFirestore();
const auth = getAuth();

const user = null;
let email = null;
let usu = null;
let quienEs = "";

let numeroId = 0;


const citas = document.getElementById("citasRec");

const crearVer = document.getElementById("alejandro");

const btnRecargar = document.getElementById("recarga");

async function saberQuien(){
    onGetDoctores((querySnapshot) => {
        let html ='';
        //Coger todos los datos de una lista
        querySnapshot.forEach(doc =>{
            const doctor = doc.data();
                html += `
                  <option>${doctor.usuario}</option>
                `
                filtroDoctor.innerHTML=html;
        })
        let a = `
        <option selected>Doctor</option>
      `
      filtroDoctor.innerHTML+=a;
    })
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
    let html = "";  
    console.log(crearVer.dataset.id)
    if(crearVer.dataset.id === "ver"){
      if(quienEs == "recepcionista"){
        if(isOn){
            MSJCUENTA();
            let docCita = null;
            onGetCitas((querySnapshot) =>{
                //Coger todos los datos de una lista
                querySnapshot.forEach(doc =>{
                    let cita = doc;
                    getSmth("doctor", "id", cita.data().idDoc);
                    let elDoctor = null;
                    getWithQ((snapshot) => {
                        snapshot.docs.forEach((doc) => {
                            elDoctor = doc.data();
                        })
                        getSmth("especialidad", "id", elDoctor.idEspecialidad);
                        let laEspecialidad = null;
                        getWithQ((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                laEspecialidad = doc.data();
                            })
                            getSmth("paciente", "id", cita.data().idPaciente);
                            let elPaciente = null;
                            getWithQ((snapshot) => {
                                snapshot.docs.forEach((doc) => {
                                    elPaciente = doc.data();
                                })

                                //getDesp("solicita_despacho", "2022-05-27", 1);
                                //getSmth("solicita_despacho", "idDoc", elDoctor.id);
                                getSmth("solicita_despacho", "fecha", cita.data().fecha);
                                let elSolicita = null;
                                getWithQ((snapshot) => {
                                    snapshot.docs.forEach((doc) => {
                                        elSolicita = doc.data();
                                    })
                                    getSmth("despacho", "id", elSolicita.idDespacho);
                                    let elDespacho = null;
                                    getWithQ((snapshot) => {
                                        snapshot.docs.forEach((doc) => {
                                            elDespacho = doc.data();
                                        })
                                        
                                        if(!as){
                                            if(cita.data().entrada == true){
                                                if(elDespacho == null){
                                                    html += `
                                                    <tr>
                                                        <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                        <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                        <td>${laEspecialidad.nombre}</td>
                                                        <td>${elPaciente.nombre}</td>
                                                        <td>Piso:0 Puerta:0</td>
                                                        <td class="regEnt">
                                                            <button type="button" class="citaIcono oculta">
                                                                <img data-id="${cita.id} " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                            </button>   
                                                        </td>
                                                    </tr>
                                                    `
                                                }else{
                                                    if(elDoctor.id == elSolicita.idDoc){
                                                        html += `
                                                        <tr>
                                                            <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                            <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                            <td>${laEspecialidad.nombre}</td>
                                                            <td>${elPaciente.nombre} ${elPaciente.apellidos}</td>
                                                            <td>Piso:${elDespacho.piso} Puerta:${elDespacho.puerta}</td>
                                                            <td class="regEnt">
                                                                <button data-id="${cita.id}" data-cita="${cita.data().id}" type="button" class="citaIcono oculta">
                                                                    <img " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                                </button>   
                                                            </td>
                                                        </tr>
                                                        `
                                                    }
                                                }
                                            }else{
                                                if(elDespacho == null){
                                                    html += `
                                                    <tr>
                                                        <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                        <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                        <td>${laEspecialidad.nombre}</td>
                                                        <td>${elPaciente.nombre}</td>
                                                        <td>Piso:0 Puerta:0</td>
                                                        <td class="regEnt">
                                                            <button type="button" class="citaIcono oculta">
                                                                <img data-id="${cita.id} " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                            </button>   
                                                        </td>
                                                    </tr>
                                                    `
                                                }else{
                                                    if(elDoctor.id == elSolicita.idDoc){
                                                        html += `
                                                        <tr>
                                                            <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                            <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                            <td>${laEspecialidad.nombre}</td>
                                                            <td>${elPaciente.nombre} ${elPaciente.apellidos}</td>
                                                            <td>Piso:${elDespacho.piso} Puerta:${elDespacho.puerta}</td>
                                                            <td class="regEnt">
                                                                <button data-id="${cita.id}" data-cita="${cita.data().id}" type="button" class="citaIcono oculta">
                                                                    <img " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                                </button>   
                                                            </td>
                                                        </tr>
                                                        `
                                                    }
                                                }
                                            }
                                        }
                                        citas.innerHTML=html;
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }
      }
    }

    
}
let as = false;
let doctorFiltrado = null;
filtroDoctor.addEventListener("change", async (e)=>{
    e.preventDefault();
    let html = "";  
    getSmth("doctor", "usuario", filtroDoctor.value);

    getWithQ((snapshot) => {
        snapshot.docs.forEach((doc) => {
            doctorFiltrado = doc.data();
        })

            let docCita = null;
            onGetCitas((querySnapshot) =>{
                //Coger todos los datos de una lista
                querySnapshot.forEach(doc =>{
                    let cita = doc;
                    getSmth("doctor", "id", cita.data().idDoc);
                    let elDoctor = null;
                    getWithQ((snapshot) => {
                        snapshot.docs.forEach((doc) => {
                            elDoctor = doc.data();
                        })
                        getSmth("especialidad", "id", elDoctor.idEspecialidad);
                        let laEspecialidad = null;
                        getWithQ((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                laEspecialidad = doc.data();
                            })
                            getSmth("paciente", "id", cita.data().idPaciente);
                            let elPaciente = null;
                            getWithQ((snapshot) => {
                                snapshot.docs.forEach((doc) => {
                                    elPaciente = doc.data();
                                })

                                //getDesp("solicita_despacho", "2022-05-27", 1);
                                //getSmth("solicita_despacho", "idDoc", elDoctor.id);
                                getSmth("solicita_despacho", "fecha", cita.data().fecha);
                                let elSolicita = null;
                                getWithQ((snapshot) => {
                                    snapshot.docs.forEach((doc) => {
                                        elSolicita = doc.data();
                                    })
                                    getSmth("despacho", "id", elSolicita.idDespacho);
                                    let elDespacho = null;
                                    getWithQ((snapshot) => {
                                        snapshot.docs.forEach((doc) => {
                                            elDespacho = doc.data();
                                        })
                                        console.log("hi");
                                        if(!as){
                                            if(cita.data().entrada == true){
                                                if(elDespacho == null){
                                                    html += `
                                                    <tr>
                                                        <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                        <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                        <td>${laEspecialidad.nombre}</td>
                                                        <td>${elPaciente.nombre}</td>
                                                        <td>Piso:0 Puerta:0</td>
                                                        <td class="regEnt">
                                                            <button type="button" class="citaIcono oculta">
                                                                <img data-id="${cita.id} " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                            </button>   
                                                        </td>
                                                    </tr>
                                                    `
                                                }else{
                                                    if(elDoctor.id == elSolicita.idDoc && doctorFiltrado.id == elDoctor.id){
                                                        html += `
                                                        <tr>
                                                            <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                            <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                            <td>${laEspecialidad.nombre}</td>
                                                            <td>${elPaciente.nombre} ${elPaciente.apellidos}</td>
                                                            <td>Piso:${elDespacho.piso} Puerta:${elDespacho.puerta}</td>
                                                            <td class="regEnt">
                                                                <button data-id="${cita.id}" data-cita="${cita.data().id}" type="button" class="citaIcono oculta">
                                                                    <img " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                                </button>   
                                                            </td>
                                                        </tr>
                                                        `
                                                    }
                                                }
                                            }else{
                                                if(elDespacho == null){
                                                    html += `
                                                    <tr>
                                                        <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                        <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                        <td>${laEspecialidad.nombre}</td>
                                                        <td>${elPaciente.nombre}</td>
                                                        <td>Piso:0 Puerta:0</td>
                                                        <td class="regEnt">
                                                            <button type="submit" class="citaIcono oculta">
                                                                <img data-id="${cita.id} " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                            </button>   
                                                        </td>
                                                    </tr>
                                                    `
                                                }else{
                                                    if(elDoctor.id == elSolicita.idDoc && doctorFiltrado.id == elDoctor.id){
                                                        html += `
                                                        <tr>
                                                            <td scope="row">${cita.data().fecha} ${cita.data().hora}</td>
                                                            <td>${elDoctor.nombre} ${elDoctor.apellidos}</td>
                                                            <td>${laEspecialidad.nombre}</td>
                                                            <td>${elPaciente.nombre} ${elPaciente.apellidos}</td>
                                                            <td>Piso:${elDespacho.piso} Puerta:${elDespacho.puerta}</td>
                                                            <td class="regEnt">
                                                                <button data-id="${cita.id}" data-cita="${cita.data().id}" type="button" class="citaIcono oculta">
                                                                    <img " src="../img/registra_entrada.png" alt="icono registra entrada">
                                                                </button>   
                                                            </td>
                                                        </tr>
                                                        `
                                                    }
                                                }
                                            }
                                        }
                                        citas.innerHTML=html;
                                    })
                                })
                            })
                        })
                    })
                })
            })
    })
})
btnRecargar.addEventListener("click", (e) => {
    as= false;
    e.preventDefault();
    const btnChange = citas.querySelectorAll('.citaIcono');
        btnChange.forEach(btn => {
            let theSamebool = false;
            if(!theSamebool){
                getSmth("cita", "id", parseInt(btn.dataset.cita));
                let cita = null;
                getWithQ((snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        cita = doc.data();
                    })
                    if(!cita.entrada){
                        btn.classList.remove('oculta')
                        btn.addEventListener('click',  (s) => {
                            s.preventDefault();
                            let theTrue = false;
                            getSmth("cita", "id", parseInt(btn.dataset.cita));
                            let cita = null;
                            getWithQ((snapshot) => {
                                snapshot.docs.forEach((doc) => {
                                    cita = doc.data();
                                })
                                if(!theTrue){
                                    a(btn.dataset.id, cita);
                                    theTrue =true;
                                    theSamebool = true;
                                    as = true;
                                    myTable.classList.add("loaded");
                                }
                            })                                  
                         })
                    }
                })  
            }
    })
})
const myTable = document.getElementById("recTable");
window.addEventListener('DOMContentLoaded', async () => {
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        user = auth.currentUser;
        email = user.email;
        if(!as || !myTable.classList.contains("loaded")){
            saberQuien();
        }
      } else {
        isOn = false;
      }
    });
})

async function a(id, cita){
    Swal.fire({
        title: '¿Confirmar entrada?',
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
                    'Se ha registrado la entrada del paciente.',
                    'success'
                )
            }
            ass();
        }
    })
}

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



  