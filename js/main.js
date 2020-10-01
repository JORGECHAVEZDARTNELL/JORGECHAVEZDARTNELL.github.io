const db = firebase.firestore();



//login
const loginForm = document.getElementById('login-form');
var main = document.getElementById("main");
var user=null;


const getUser = (username, password) => db.collection("users").where("username","==",username).where("password","==",password).get();

//const getLogin = (username, password) =>db.collection("users").where("username","==",username).where("password","==",password).get();



loginForm.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const username = loginForm["login-username"];
    const password = loginForm["login-pass"];
    const querySnapshot = await getUser(username.value, password.value);
    querySnapshot.forEach(doc => {
        var user = doc;
        localStorage.setItem("usuario", doc);
        testPlantilla(doc.data());
    }
    )

    //const user=doc.data();
    //console.log(user);
})

function testPlantilla(doc){
    console.log(doc);
    var strHtml =`
    
    <div class="row">
    <div class="col-12 col-lg-3">
    <a class="btn button-primary btn-icon btn-icon-left" style="float:right" href=""><span>--</span></a>
        <h2>--</h2>
        <div class="row row-30 text-md-left justify-content-sm-center">
            <div class="col">
                <article class="post-news post-news-wide">
                    <div class="post-news-body">
                        <h6>--</h6>
                        <div class="offset-top-20 offset-bottom-20"><a class="btn button-primary btn-icon btn-icon-left" href="shopping-cart.html"><span>--</span></a></div>         
                    </div>
                </article>
            </div>
            <div class="col">
                <article class="post-news post-news-wide">
                    <div class="post-news-body">
                        <h6>--</h6>
                        <div class="offset-top-20 offset-bottom-20"><a class="btn button-primary btn-icon btn-icon-left" href="shopping-cart.html"><span>--</span></a></div>         
                    </div>
                </article>
            </div>
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