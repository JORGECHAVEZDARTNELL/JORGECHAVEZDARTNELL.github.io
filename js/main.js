const db = firebase.firestore();

//login
const loginForm = document.getElementById('login-form');
var main = document.getElementById("main");

//const getLogin = (username, password) =>db.collection("users").where("username","==",username).where("password","==",password).get();
const getAula = db.collection("users").where("username","==",username.value).where("password","==",password.value).get();


loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const username = loginForm["login-username"];
    const password = loginForm["login-pass"];
    await db.collection("users").where("username","==",username.value).where("password","==",password.value).get()
    .then(function(querySnapshot){
        if(querySnapshot.size==1){
            querySnapshot.forEach(function(doc){
                loadNotas(doc);
                loadAula();
                
            })
        }
    }).catch(function(error){
        console.log("error");
    });

    //const user=doc.data();
    //console.log(user);
})

async function loadContent(){
    await db.collection("aulas").where("nivel","==", "1").where("grado","==","1")
    .where("seccion","==","1").get()
    .then(function(querySnapshot){
        if(querySnapshot.size>=1){
            querySnapshot.forEach(function(doc){
                
            })
        }
    }).catch(function(error){
        console.log("error:2");
    })
}






function loadNotas(doc){
    const user = doc.data();
    aulas= user.aulaseccion;
    aulas.forEach(function(element){
        console.log(element.split("-"));
    });
    main.innerHTML='';
    main.innerHTML+=`  <section class="section section-xl bg-default">
    <div class="container">
        <div class="row">
        <div class="col-lg-6">

        </div>
        </div>
        <div class="row">
        <div class="col-lg-6">
            
        </div>
        </div>
    </section>`;
}



//mesa de partes
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
    console.log(title, description);
    await saveTramite(tipoTramite.value,asunto.value,correo.value,telefono.value,dni.value);
    taskForm.reset();
    windows.alert("HEHE");

})