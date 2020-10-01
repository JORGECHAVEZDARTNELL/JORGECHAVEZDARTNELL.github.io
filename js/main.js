const db = firebase.firestore();



//login
const loginForm = document.getElementById('login-form');
var main = document.getElementById("main");
//var user=null;
var notas = {
    cursos: null,
    aula: null,
};


const getUser = (username, password) => db.collection("users").where("username","==",username).where("password","==",password).get();
//const getNotas = (criterios)=> db.collection(criterios).doc("matematica").get();
const getNotas = (criterios)=> db.collection(criterios).get();

//const getLogin = (username, password) =>db.collection("users").where("username","==",username).where("password","==",password).get();



loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const username = loginForm["login-username"];
    const password = loginForm["login-pass"];
    const querySnapshot = await getUser(username.value, password.value);
    querySnapshot.forEach(doc => {
        //var user = doc;
        localStorage.setItem("usuario", doc);
        
        testPlantilla(doc);
        


    }
    )

    //const user=doc.data();
    //console.log(user);
})

async function testPlantilla(doc){
    var user=doc.data();
    var scriptConsulta = `users/${doc.id}/aulas`;
    const aulas = await db.collection(scriptConsulta).get();
    var h2 ="";
    var strCursos="";
    aulas.forEach(aula=>{
        if(user.tipo="Alumno" || user.nivel=="n1"){
            h2=user.nivel.concat(aula.id);
            var cursos = aula.data().cursos;
            cursos.forEach(curso=>{
                strCursos+=`
                    <div class="col">
                        <article class="post-news post-news-wide">
                            <div class="post-news-body">
                                <h6>${curso}</h6>
                                <div class="offset-top-20 offset-bottom-20">
                                <button class="btn button-primary btn-icon btn-icon-left" data-id="${aula.id}" href="">
                                ver más
                                </button></div>         
                            </div>
                        </article>
                    </div>`
            });
        }else{
            h2="cursos";
            var cursos = aula.data().cursos;
            cursos.forEach(curso=>{
            strCursos+=`
                    <div class="col">
                        <article class="post-news post-news-wide">
                            <div class="post-news-body">
                                <h6>${curso - aula.id.substr(2,1)}</h6>
                                <div class="offset-top-20 offset-bottom-20">
                                <button class="btn button-primary btn-icon btn-icon-left" data-id="${aula.id}" href="">
                                -->
                                </button></div>         
                            </div>
                        </article>
                    </div>`;
            });
        }
        console.log(aula.data());
        

    });


    var strHtml =`
    
    <div class="row">
    <div class="col-12 col-lg-3 section-sm-bottom-30">
    <a class="btn button-primary btn-icon btn-icon-left" style="float:right" href=""><span>X</span></a>
        <h2>${h2}</h2>
        <div class="row row-30 text-md-left justify-content-sm-center">
        ${strCursos}
    </div>
    </div>
    <div class="col-12 col-lg-9">
        <div class="table-responsive clearfix">
        <table class="table-dark-blue table-custom table table-custom-wrap">
        <tbody>
          <tr>
            <th>--</th>
            <th colspan="3">--</th>
            <th colspan="3">--</th>
            <th colspan="3">--</th>
            <th colspan="3">--</th>

          </tr>
          <tr>
            <td><a class="text-primary" href="">-- --</a></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            <td><input class="" type="number" data-zeros="true" value="1" min="1" max="20"></td>
            
            
          </tr>
      </tbody>
      </table>
        </div>
    </div>
  </div>`;

    main.innerHTML=strHtml;
   
}
main.addEventListener(onchange, async(e)=>{
    await console.log("pupu");
});


function loadNotas(doc){
    const user = doc.data();
    aulas= user.aulaseccion;
    aulas.forEach(function(element){
        console.log(element.split("-"));
        testPlantilla();
    });
    main.innerHTML='';
    
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