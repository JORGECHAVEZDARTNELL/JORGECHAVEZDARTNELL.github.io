const db = firebase.firestore();

//login
const loginForm = document.getElementById('login-form');
var main = document.getElementById("main");


const getUser = (username, password) => db.collection("users").where("username","==",username).where("password","==",password).get();

loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const username = loginForm["login-username"];
    const password = loginForm["login-pass"];
    try{const querySnapshot = await getUser(username.value, password.value);
    querySnapshot.forEach( doc => {
        const user = {id: doc.id, info: doc.data()};
        inciaPagina(user.info.username);
        cargaPagina(user);
    })}catch(e){
        window.alert("Error en sesion")
    }
});
function inciaPagina(username){
    main.innerHTML =`
    <div class="row">
    <div class="col-12 col-lg-3 section-sm-bottom-30">
        <a class="btn button-primary btn-icon btn-icon-left" style="float:right" href=""><span>X</span></a>
        <h3>${username}</h3>
        <div class="row row-30 text-md-left justify-content-sm-center" id="cursosContainer">

        </div>
    </div>
    <div class="col-12 col-lg-9">
        <div class="table-responsive clearfix">
        
        <table class="table-dark-blue table-custom table table-custom-wrap" id="tabla">
      </table>
      <div class="offset-top-20 offset-bottom-20" id="secondary"></div>
      <button id ="btnImprimir"class="btn button-primary btn-icon btn-icon-left offset-top-20" href="javascript:imprimirNotas('main')">
            Imprimir
        </button>
        </div>

    </div>

    
  </div>`;
}
async function cargaPagina(user){
    let userData = user;
    const cursos = user.info.cursos;

    var cursosContainer = document.getElementById("cursosContainer");
    var tabla = document.getElementById("tabla");

    await cursos.forEach(async curso=>{
        const dataCurso = await db.collection("curso").doc(curso).get();
        const dataCriterios = await db.collection("curso/"+curso+"/criterios").get();
        let indice = cursos.indexOf(curso)
        userData.info.cursos[indice]={id: curso, info: dataCurso.data()};
        let criterios =new Array();
        await dataCriterios.forEach(async criterio=>{
            
            
            let instrumentos=criterio.data().instrumentos;
            await instrumentos.forEach(async instrumento=>{
                let notas= await db.collection("curso/"+curso+"/notas").where("criterio","==",criterio.data().criterio).where("instrumento","==",instrumento).get();
                notas.forEach(nota=>{
                    const indiceInstrumento=instrumentos.indexOf(instrumento);
                    instrumentos[instrumento]={ notas:nota.data().nota};
                })
            });
            criterios.push({id: criterio.id, criterio: criterio.data().criterio,instrumentos});
            
        });
        userData.info.cursos[indice].criterios=criterios;           
        console.log(userData);
        if(userData.info.tipo=="Alumno"){
            cursosContainer.innerHTML+=`
            <div class="col">
                <article class="post-news post-news-wide">
                    <div class="post-news-body">
                        <h6>${dataCurso.data().nombre}</h6>
                        <div class="offset-top-20 offset-bottom-20">
                        <button class="btn button-primary btn-icon btn-icon-left btn-ver-mas" data-id="${curso}" href="">
                        ver más
                        </button>

                    </div>
                </article>
            </div>`;
            const btnVerMas = await document.querySelectorAll(".btn-ver-mas");
            btnVerMas.forEach(btn=>{
                btn.addEventListener('click', (e)=>{
                    let cursoId = e.target.dataset.id;
                    let cursosList=userData.info.cursos;
                    let strCriterios=``;
                    let strInstrumento=``;
                    let strNotas=`<td><a class="text-primary" href="">${userData.info.dni} </a></td>`;
                    let strCurso=``;
                    for (i in cursosList){
                        if(cursosList[i].id==cursoId){
                            let criterios = cursosList[i].criterios;
                            strCurso=cursosList[i].info.nombre
                            criterios.forEach(criterio=>{
                                let colspan= criterio.instrumentos.length;
                                 strCriterios+= `<th class"criterios" colspan="${colspan}">${criterio.criterio}</th>`;                                
                                 let instrumentos = criterio.instrumentos;
                                 instrumentos.forEach(instrumento=>{
                                    strInstrumento+=`<td><a class="text-secondary">${instrumento}</a></td>`;

                                    let nota=instrumentos[instrumento].notas;
                                    let indiceAlumno= cursosList[i].info.alumnos.indexOf(userData.info.dni);

                                    strNotas+=`<td><a class="text-secondary">${nota[indiceAlumno]}</a></td>`;
                                 })
                                 strInstrumento+=`<td><a class="text-secondary">${criterio.criterio}</a></td>`;     
                                 strInstrumento+=`<td><a class="text-secondary">Nota:</a></td>`;     
                                
                            });

                            strCriterios+=`<th class"criterios" colspan="${criterios.length}">Promedios</th>`;
                            strCriterios+=`<th class"criterios">Final</th>`;
                        };
                    }
                    tabla.innerHTML=`<tbody>
                    <tr>
                      <th colspan="100%" class="table-dark-blue" >${strCurso}</th>
                    </tr>
                    <tr>
                      <th class="table-dark-blue">ID</th>
                      ${strCriterios}         
                      
                    </tr>
                    <tr>
                      <td><a class="text-primary" href="">instrumentos :</a></td>
                      ${strInstrumento}
                    </tr>
                    <tr>
                    ${strNotas}
                    </tr>
                </tbody>`;
                });
            });
 
        }else{
            const divSecondary = document.getElementById("secondary");
            cursosContainer.innerHTML+=`
            <div class="col">
                <article class="post-news post-news-wide">
                    <div class="post-news-body">
                        <h4>${dataCurso.data().nombre } - ${ dataCurso.data().grado } - ${dataCurso.data().seccion}</h4> 
                        </h6> ${ dataCurso.data().nivel}</h6>

                        <div class="offset-top-20 offset-bottom-20">
                        <button class="btn button-primary btn-icon btn-icon-left btn-ver-mas" data-id="${curso}" href="">
                        ver más
                        </button>
                        <button class="btn button-primary btn-icon btn-icon-left btn-configurar" data-id="${curso}" href="">
                        configurar
                        </button>

                    </div>
                </article>
            </div>`;
            const btnVerMas = await document.querySelectorAll(".btn-ver-mas");
            const btnConfig = await document.querySelectorAll(".btn-configurar");
            btnConfig.forEach(btn=>{
                btn.addEventListener('click',(e)=>{
                    divSecondary.innerHTML="";
                    let cursoId = e.target.dataset.id;
                    let cursosList=userData.info.cursos;
                    let strCriterios=``;
                    let strInstrumento=``;
                    let strCurso=``;
                    let strButton=``;
                    let indice ="";
                    for (i in cursosList){
                        if(cursosList[i].id==cursoId){
                            let criterios = cursosList[i].criterios;
                            indice=""+i;
                            strCurso=cursosList[i].info.nombre
                            //strButton+=`<button class="btn button-secondary btn-icon btn-icon-left" id="guardar" style:"margin-left:10px"data-id="${i}" href="">Guardar</button>`
                            strButton+=`<button class="btn button-secondary btn-icon btn-icon-left" id="addCriterio" style:"margin-left:10px" data-id="${i}" href="">
                                 Agregar Criterio
                                 </button></th>`;
                            criterios.forEach(criterio=>{
                                let colspan= criterio.instrumentos.length;
                                 strCriterios+= `<th class"criterios" colspan="${colspan}">${criterio.criterio}`;                                
                                 let instrumentos = criterio.instrumentos;
                                 strCriterios+=`<button class="btn button-secondary btn-edit" data-id="${criterios.indexOf(criterio)}" href="">
                                 Editar
                                 </button></th>`;
                                 let alumnos= cursosList[i].info.alumnos;
                                    instrumentos.forEach(instrumento=>{
                                        strInstrumento+=`<td>${instrumento}</td>`;
                                     });
                            });

                        
                        };
                    }
                    tabla.innerHTML=`<tbody>
                    <tr>
                      <th colspan="100%" class="table-dark-blue" style="text-align:center">${strCurso.toUpperCase()}  ${strButton}
                      
                    </tr>
                    <tr>
                      <th class="table-dark-blue">Criterios :</th>
                      ${strCriterios}         
                      
                    </tr>
                    <tr>
                      <td><a class="text-primary" href="">instrumentos :</a></td>
                      ${strInstrumento}
                    </tr>
                </tbody>`;
                const btnEdit= document.querySelectorAll(".btn-edit");
                const btnAgregarCriterio=document.getElementById("addCriterio");
                let strTableEdit=`<table class="table-dark-blue table-custom table table-custom-wrap">
                    <tbody>
                    <tr>
                      <th class="table-dark-blue" style="text-align:center">Criterio:</th>
                      <th class="table-dark-blue" style="text-align:center"><input id="criterio" type="text" value="" data-constraints="@Required"></th>
                    </tr>
                    <tr>
                      <td class="text-secondary" style="text-align:center">Instrumento</th>
                      <td class="text-secondary " style="text-align:center"><input id="instrumento-0" type="text" data-id="0" value="" data-constraints="@Required"></th>
                    </tr>
                    <tr>
                      <td class="text-secondary" style="text-align:center">Instrumento</th>
                      <td class="text-secondary" style="text-align:center"><input id="instrumento-1" type="text" data-id="1" value="" data-constraints="@Required"></th>
                    </tr>
                    <tr>
                      <td class="text-secondary" style="text-align:center">Instrumento</th>
                      <td class="text-secondary" style="text-align:center"><input id="instrumento-2" type="text" data-id="2" value="" data-constraints="@Required"></th>
                    </tr>
                    <tr>
                      <td class="text-secondary" style="text-align:center">Instrumento</th>
                      <td class="text-secondary" style="text-align:center"><input id="instrumento-3" type="text" data-id="3" value="" data-constraints="@Required"></th>
                    </tr>`;
                btnAgregarCriterio.addEventListener('click', (e)=>{
                    let nInstrumentos=2;
                    divSecondary.innerHTML=`${strTableEdit}
                    </tbody>
                    </table>`;
                    
                    divSecondary.innerHTML+=`<button class="btn button-secondary btn-icon offset-top-20 btn-icon-left" id="guardar" style:"margin-left:10px"data-id="${indice}" href="">Guardar</button>`;


                    const btnGuardar=document.getElementById('guardar');

                    btnGuardar.addEventListener('click',async (e)=>{
                        const criterioName = document.getElementById('criterio');
                        let instrumentos=new Array();
                        //console.log(userData.info.cursos[indice].id,userData.info.cursos[indice].criterios[e.target.dataset.id].id);
                        for(var i = 0; i<=3; i++){
                            const instrumentoName = document.getElementById('instrumento-'+i);
                            if(instrumentoName.value!=""){
                                instrumentos.push(instrumentoName.value);
                            }
                            
                        }
                        let curso=userData.info.cursos[indice];
                        let notasIniciales=new Array();

                        for(i in curso.info.alumno){
                            notasIniciales.push(0);
                        }
                        
                        await db.collection('curso/'+userData.info.cursos[indice].id+'/criterios').doc().set({
                            criterio: criterioName.value,
                            instrumentos: instrumentos
                        });
                        instrumentos.forEach(async (instrumento)=>{
                            await db.collection('curso/'+userData.info.cursos[indice].id+'/notas').doc().set({
                                criterio:criterioName.value,
                                instrumento: instrumento,
                                nota: notasIniciales
                            })    
                        })
                        cargaPagina(user);
                        
                        //console.log(instrumentos);
                        
                    });
                });
                btnEdit.forEach(btn=>{
                    btn.addEventListener('click', (e)=>{
                        let criterioId= e.target.dataset.id;
                        let criterioData=userData.info.cursos[indice].criterios[criterioId];
                    });
                })

                })
            });
            
            btnVerMas.forEach(btn=>{
                btn.addEventListener('click', (e)=>{
                    divSecondary.innerHTML="";
                    let cursoId = e.target.dataset.id;
                    let cursosList=userData.info.cursos;
                    let strCriterios=``;
                    let strInstrumento=``;
                    let strNotas=`<td><a class="text-primary" href="">${userData.info.dni} </a></td>`;
                    let strCurso=``;
                    for (i in cursosList){
                        if(cursosList[i].id==cursoId){
                            let criterios = cursosList[i].criterios;
                            strCurso=cursosList[i].info.nombre
                            criterios.forEach(criterio=>{
                                let colspan= criterio.instrumentos.length;
                                 strCriterios+= `<th class"criterios" colspan="${colspan}">${criterio.criterio}</th>`;                                
                                 let instrumentos = criterio.instrumentos;
                                 let alumnos= cursosList[i].info.alumnos;
                                 alumnos.forEach(alumno=>{
                                    instrumentos.forEach(instrumento=>{
                                        strInstrumento+=`<td><a class="text-secondary">${instrumento}</a></td>`;
    
                                        let nota=instrumentos[instrumento].notas;
                                        let indiceAlumno =alumnos.indexOf(alumno);
    
                                        strNotas+=`<td><a class="text-secondary">${nota[indiceAlumno]}</a></td>`;
                                        
                                     })
                                     strInstrumento+=`<td><a class="text-secondary">${criterio.criterio}</a></td>`;     
                                     strInstrumento+=`<td><a class="text-secondary">Nota:</a></td>`;
                                     
                                 });
                                 strCriterios+=`<th class"criterios" colspan="${criterios.length}">Promedios</th>`;
                            strCriterios+=`<th class"criterios">Final</th>`;
                                 
                            });

                        
                        };
                    }
                    tabla.innerHTML=`<tbody>
                    <tr>
                      <th colspan="100%" class="table-dark-blue" style="text-align:center">${strCurso.toUpperCase()}  <button class="btn button-secondary btn-icon btn-icon-left btn-configurar" id="guardar"href="">
                      Guardar
                      </button></th>
                    </tr>
                    <tr>
                      <th class="table-dark-blue">ID</th>
                      ${strCriterios}         
                      
                    </tr>
                    <tr>
                      <td><a class="text-primary" href="">instrumentos :</a></td>
                      ${strInstrumento}
                    </tr>
                    <tr>
                    ${strNotas}
                    </tr>
                </tbody>`;
                });
            });
        }
    });

async function agregarCriterio(idCurso){

}
async function editarCriterio(idCurso, idCriterio){

}
    const btnImprimir= document.getElementById('btnImprimir');
    btnImprimir.addEventListener('click', (e)=>{
        window.print();
    })
}
