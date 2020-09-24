const db = firebase.firestore();

const tramiteForm = document.getElementById('tramite-form');


const saveTramite = (tipoTramite,asunto,correo,telefono,dni)=>{
    db.collection('tramites').doc().set({
        //title: title,
        //description:description
        tipoTramite,
        asunto,
        correo,
        telefono,
        dni
    });
}
//const getTask = ()=>db.collection('tasks').get();


tramiteForm.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const tipoTramite = tramiteForm["mesa-tipo-tramite"];
    const asunto = tramiteForm["mesa-asunto-tramite"];
    const correo = tramiteForm["mesa-email"];
    const telefono = tramiteForm["mesa-telfono"];
    const dni = tramiteForm["mesa-dni"];
    
    console.log(document.getElementById("mesa-doc").value);    
    //console.log(title, description);
    //await saveTramite(tipoTramite.value,asunto.value,correo.value,telefono.value,dni.value);
    //taskForm.reset();
    //windows.alert("HEHE");
    
    
})