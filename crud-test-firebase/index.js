import {saveTask, getUsu, onGetUsu, deleteTask} from './firebase.js'

const form = document.getElementById("task-form");
const taskCont = document.getElementById('tasks-container');

window.addEventListener('DOMContentLoaded', async () => {
    onGetUsu((querySnapshot) => {
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


form.addEventListener('submit', e =>{
    e.preventDefault();

    let nombre = form['Nombre'].value;
    let apellido = form['Apellido'].value;

    saveTask(nombre, apellido);

    form.reset();
})
