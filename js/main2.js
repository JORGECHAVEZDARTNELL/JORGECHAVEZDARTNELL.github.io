const db = firebase.firestore();



//login
const loginForm = document.getElementById('login-form');
var main = document.getElementById("main");


const getUser = (username, password) => db.collection("users").where("username","==",username).where("password","==",password).get();
//const getNotas = (criterios)=> db.collection(criterios).doc("matematica").get();
const getNotas = (criterios)=> db.collection(criterios).get();

//const getLogin = (username, password) =>db.collection("users").where("username","==",username).where("password","==",password).get();



loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const username = loginForm["login-username"];
    const password = loginForm["login-pass"];
    const querySnapshot = await getUser(username.value, password.value);
    querySnapshot.forEach( async doc => {
       // var user = doc;
       
        //const userData = await loadData(doc);
        //localStorage.setItem("usuario", userData);
        await imprimirPantalla(doc);
    }
    )

    //const user=doc.data();
    //console.log(user);
});
function loadData(doc){
    let userData = {};

    userData.id=doc.id;
    userData.info=doc.data();
    //userData.aulas={};

    db.collection(`users/${doc.id}/aulas`).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach(function(aula){
            userData.aulas[doc.id+aula.id]={orden:orden.data()}
    
    db.collection("salones/"+doc.id+aula.id+"/cursos/").get()
    .then((querySnapshot)=>{
        querySnapshot.forEach(function(curso){
            let curso={}
            curso[curso.id]={profesor:curso.data()}
            
        })
    })
        })
    })

    //await obtenerAulas(userData.id, userData.info.nivel);
    
    
    return userData;

  }



async function obtenerAulas(user, nivel){
    let aulas={};

    var scriptConsulta = `users/${user}/aulas`;
    const querySnapshotAulas = await db.collection(scriptConsulta).get();

    await querySnapshotAulas.forEach(async aula=>{
        
        var orden=await db.collection("salones").doc(nivel+aula.id).get();
        let aulaData = { orden : orden.data(), cursos : await obtenerCursos(nivel+aula.id)};
        aulas[nivel+aula.id]=aulaData;
    });
    return aulas;

}
  async function obtenerCursos(id){
    let cursos={};
    const querySanpshotCursos = await db.collection("salones/"+id+"/cursos/").get();

    querySanpshotCursos.forEach(async curso=>{
        

        let cursoData={profesor : curso.data() , criterios : await obtenerCriterios(id,curso.id) };

        cursos[curso.id]=cursoData;
        //console.log(cursos)
    });
    return cursos;
}
  async function obtenerCriterios(id,curso){
    let criterios={};
    const querySnapshotCriterios = await db.collection("salones/"+id+"/cursos/"+curso+"/criterios").get();
    querySnapshotCriterios.forEach(async criterio=>{
        
        let criterioData={
            nombre:criterio.data().nombre,
            instrumentos: await obtenerInstrumentos(id,curso,criterio.id)
        };
        criterios[criterio.id]=  criterioData;
        //console.log(criterios);
    });
    
    return criterios;
  }
  async function obtenerInstrumentos(id,curso,criterio){
      let instrumentos={};
      const querySnapshotInstrumentos = await db.collection("salones/"+id+"/cursos/"+curso+"/criterios/"+criterio+"/instrumentos").get();
      querySnapshotInstrumentos.forEach(instrumento=>{
        let instrumentoData= instrumento.data();
        instrumentos[instrumento.id]=instrumentoData;
        //console.log(instrumentos);
      });
      
      return instrumentos;
}

async function imprimirPantalla(doc){
    const userData = await loadData(doc);
    //var a= userData.aulas.n2a1s1;
    console.log(userData);
    main.innerHTML =`
    <div class="row">
    <div class="col-12 col-lg-3 section-sm-bottom-30">
        <a class="btn button-primary btn-icon btn-icon-left" style="float:right" href=""><span>X</span></a>
        <h3>${userData.info.username}</h3>
        <div class="row row-30 text-md-left justify-content-sm-center" id="cursosContainer">

        </div>
    </div>
    <div class="col-12 col-lg-9">
        <div class="table-responsive clearfix">
        <table class="table-dark-blue table-custom table table-custom-wrap" id="tabla">
      </table>
        </div>
    </div>
  </div>`;

  var cursosContainer = document.getElementById("cursosContainer");
  var tabla = document.getElementById("tabla");
   

  }

async function testPlantilla(doc){
    var user=doc.data();
    var scriptConsulta = `users/${doc.id}/aulas`;
    const aulas = await db.collection(scriptConsulta).get();
    var h2 ="";
    main.innerHTML =`
    <div class="row">
    <div class="col-12 col-lg-3 section-sm-bottom-30">
        <a class="btn button-primary btn-icon btn-icon-left" style="float:right" href=""><span>X</span></a>
        <h2>${user.username}</h2>
        <div class="row row-30 text-md-left justify-content-sm-center" id="cursosContainer">

        </div>
    </div>
    <div class="col-12 col-lg-9">
        <div class="table-responsive clearfix">
        <table class="table-dark-blue table-custom table table-custom-wrap" id="tabla">
      </table>
        </div>
    </div>
  </div>`;
  var cursosContainer = document.getElementById("cursosContainer");
  var tabla = document.getElementById("tabla");
  aulas.forEach(aula=>{
    var cursos = aula.data().cursos;
    cursos.forEach(curso=>{
        if(user.tipo="Alumno"){
            cursosContainer.innerHTML+=`
            <div class="col">
                <article class="post-news post-news-wide">
                    <div class="post-news-body">
                        <h6>${curso}</h6>
                        <div class="offset-top-20 offset-bottom-20">
                        <button class="btn button-primary btn-icon btn-icon-left btn-ver-mas" data-id="${curso}" href="">
                        ver más
                        </button>

                    </div>
                </article>
            </div>`;
        const btnVerMas = document.querySelectorAll(".btn-ver-mas");
        btnVerMas.forEach(btn=>{
            btn.addEventListener('click', async(e)=>{
                let strCriterios="";
                const criterios = await db.collection("salones/"+user.nivel+aula.id+"/cursos/"+e.target.dataset.id+"/criterios").get();
                criterios.forEach(criterio=>{
                    strCriterios += `<th class"criterios" id="`+criterio.id+`">${criterio.data().nombre}</th>`;
                    
                });
                tabla.innerHTML=`<tbody>
                    <tr>
                      <th>ID</th>
                      ${strCriterios}         
                      <th>Promedio</th>
                    </tr>
                    <tr id="notas">
                      <td><a class="text-primary" href="">${user.dni}</a></td>
                      
                    </tr>
                </tbody>`;
                var promedio = 0;
                var suma =0;
                var elementoNota = document.getElementById("notas");
                criterios.forEach(async criterio=>{
                    const instrumento = await db.collection("salones/"+user.nivel+aula.id+"/cursos/"+e.target.dataset.id+"/criterios/"+criterio.id+"/instrumentos").get();
                    const orden = await db.collection("salones").doc(user.nivel+aula.id).get()
                    suma=0;
                    instrumento.forEach(nota=>{
                        
                        //console.log(nota.data().notas[orden.data().alumnos.indexOf(user.dni)]);
                        suma += parseInt(nota.data().notas[orden.data().alumnos.indexOf(user.dni)]);
                        elementoNota.innerHTML+=`<td><a class="text-secondary" href="">${nota.data().notas[orden.data().alumnos.indexOf(user.dni)]}</a></td>`;
                        
                        //notas.concat(`<td><a class="text-secondary" href="">${nota.data().notas[orden.data().alumnos.indexOf(user.dni)]}</a></td>`);

                    });

                    document.getElementById(criterio.id).setAttribute("colspan",""+(instrumento.size));
                    suma= parseInt(suma/instrumento.size);
                    promedio+=parseInt(suma);
                });
                promedio= await promedio/criterios.size;
                elementoNota.innerHTML+=`<td><a class="text-secondary" href="">${promedio}</a></td>`;

                
            })
        })
        }else{
            cursosContainer.innerHTML+=`
            <div class="col">
                <article class="post-news post-news-wide">
                    <div class="post-news-body">
                        <h6>${curso}</h6>
                        <div class="offset-top-20 offset-bottom-20">
                        <button class="btn button-primary btn-icon btn-icon-left btn-ver-mas" data-id="${curso}" href="">
                        ver más
                        </button>

                    </div>
                </article>
            </div>`;
        const btnVerMas = document.querySelectorAll(".btn-ver-mas");
        btnVerMas.forEach(btn=>{
            btn.addEventListener('click', async(e)=>{
                let strCriterios="";
                const criterios = await db.collection("salones/"+user.nivel+aula.id+"/cursos/"+e.target.dataset.id+"/criterios").get();
                criterios.forEach(criterio=>{
                    strCriterios += `<th class"criterios" id="`+criterio.id+`">${criterio.data().nombre}</th>`;
                    
                });
                tabla.innerHTML=`<tbody>
                    <tr>
                      <th>ID</th>
                      ${strCriterios}         
                      <th>Promedio</th>
                    </tr>
                    <tr id="notas">
                      <td><a class="text-primary" href="">${user.dni}</a></td>
                      
                    </tr>
                </tbody>`;
                var promedio = 0;
                var suma =0;
                var elementoNota = document.getElementById("notas");
                criterios.forEach(async criterio=>{
                    const instrumento = await db.collection("salones/"+user.nivel+aula.id+"/cursos/"+e.target.dataset.id+"/criterios/"+criterio.id+"/instrumentos").get();
                    const orden = await db.collection("salones").doc(user.nivel+aula.id).get()

                    instrumento.forEach(nota=>{
                        //console.log(nota.data().notas[orden.data().alumnos.indexOf(user.dni)]);
                        
                        elementoNota.innerHTML+=`<td><a class="text-secondary" href="">${nota.data().notas[orden.data().alumnos.indexOf(user.dni)]}</a></td>`;

                        //notas.concat(`<td><a class="text-secondary" href="">${nota.data().notas[orden.data().alumnos.indexOf(user.dni)]}</a></td>`);
                    });

                    document.getElementById(criterio.id).setAttribute("colspan",""+(instrumento.size));

                });

                elementoNota.innerHTML+=`<td><a class="text-secondary" href="">${promedio}</a></td>`;
            })
        })
        }


        
    });



    

    /*
    if(user.tipo="Alumno" || user.nivel=="n1"){

    }else{

    }
    console.log(aula.data());
    */

});
   
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