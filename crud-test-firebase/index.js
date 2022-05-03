const firebaseConfig = {
    apiKey: "AIzaSyBnxIFmXshn0AMEtqV1-Fwz3bZOIiQfpnw",
    authDomain: "alene-ef99f.firebaseapp.com",
    projectId: "alene-ef99f",
    storageBucket: "alene-ef99f.appspot.com",
    messagingSenderId: "434544182339",
    appId: "1:434544182339:web:f0385992b5fbbc01fd80f6",
    measurementId: "G-1Q7M2DT7G5"
  };
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

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
``

const form = document.getElementById("task-form");
const but = document.getElementById("buttonSave");

form.addEventListener('submit', e =>{
    e.preventDefault();
})

but.addEventListener('click', async (e) => {
    let nombre = document.getElementById("Nombre").value;
    let apellido = document.getElementById("Apellido").value;

    const response = await db.collection('user').doc().set({
        nombre,
        apellido
    })

    console.log(response);

    console.log(nombre, apellido);
});
