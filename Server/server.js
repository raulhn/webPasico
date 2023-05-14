const https = require('https');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const session = require('express-session');
const fileUpload = require('express-fileupload');
var cors = require('cors');
const req = require('express/lib/request');


const conexion = require('./conexion.js');
const TIPO_COMPONENTE_TEXTO = 1;

var dbConn = conexion.dbConn;

const componente = require('./componente.js');
const componente_componentes = require('./componente_componentes');
const componente_galeria = require('./componente_galeria.js');

const constantes = require('./constantes.js');
const parametro = require('./parametro.js');
const menu = require('./menu.js');
const gestion_usuarios = require('./usuario.js');
const gestion_ficheros = require('./gestion_ficheros.js');
const imagen = require('./imagen.js');

const servlet_componente = require('./servlet_componente.js');

const ESQUEMA_BD = constantes.ESQUEMA_BD;

var sesion_config = require('./config/sesion.json');

//https://www.w3schools.com/nodejs/nodejs_filesystem.asp
var fs = require('fs');

/** Desarrollo **/
var url_web = 'https://80.240.127.138:8081';
const PORT = 8444;

/** Producción **/
//var url_web = 'https://ladelpasico.es';
//const PORT = 8443;

app.use(cors({origin: url_web, credentials: true})); // Se configura el control de peticiones permitidas para poder recibir peticiones del front-end
                                                                     // credentials: true permite la comunicación de la sesión

// Habilitar la subida de documentos
app.use(fileUpload({
    createParentPath: true
}));

app.use(session(sesion_config));


/*
  app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, 	X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-	Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, 	DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function esLogueado(usuario)
{
    if(!usuario)
    {
       return false;
    }
    else
    {
        return true;
    }
}


app.get('/', function(req, res)
{
    return res.status(200).send({error: true, message: 'Hola mundo'})
});

app.get('/usuarios', function(req, res)
{
    if(esLogueado(req.session.nombre))
    {
        gestion_usuarios.esAdministrador(req.session.nombre).then(
            function(bAdministrador)
            {
                if (bAdministrador)
                {
                    gestion_usuarios.obtener_usuarios().then(
                        function(resultados)
                        {
                            return res.status(200).send({error: false, data: resultados, message: 'Lista de usuarios'});
                        }
                    ).catch(function()
                    {
                        return res.status(400).send({error: true, message: 'Error al obtener la lista de usuarios'})
                    })
                }
                return res.status(400).send({error: true, message: 'Error al obtener la lista de usuarios'})
            }
        ).catch(
            function()
            {
                return res.status(400).send({error: true, message: 'Error al obtener la lista de usuarios'})
            }
        )
    }

    
}
);

app.get('/logueado', function(req, res)
{
    
    if(!esLogueado(req.session.nombre))
    {
        res.status(200).send({logueado: false, message: 'No hay usuario logueado'});
    }
    else
    {
        res.status(200).send({logueado: true, usuario: req.session.nombre, message: 'Usuario ' + req.session.nombre});
    }
})

app.get('/logueado_administrador', function(req, res)
{
    if (esLogueado(req.session.nombre))
    {
        let usuario = req.session.nombre;
        gestion_usuarios.esAdministrador(usuario).then(
            function(bAdministrador)
            {
             
                if (bAdministrador)
                {
                    return res.status(200).send({error: false, administrador: true, message: 'Usuario administrador'});
                }
                return res.status(200).send({error: false, administrador: false, message: 'No encontrado usuario'});
            }
        );
    }
    else
    {
        return res.status(200).send({error: false, administrador: false, message: 'No encontrado usuario'});
    }
})

app.post('/login', function(req,res)
{

    let usuario = req.body.usuario;
    let password = req.body.pass;

    gestion_usuarios.login(usuario, password).then(
        function(bResultado)
        {
            if(bResultado)
            {
                req.session.nombre= usuario;
                return res.status(200).send({error: false, message: 'Usuario logueado'});
            }
            return res.status(400).send({error: true, message: 'El usuario o contraseña es incorrecta'})
        }
    )

})


app.get('/logout', function(req, res)
{
    req.session.destroy();
    res.status(200).send({error:false, message: 'Logout relizado'});
})


app.post('/registrar', function(req, res)
{
    let usuario = req.body.usuario;
    let password = req.body.pass;


    dbConn.query("insert into " + constantes.ESQUEMA_BD + ".usuario(usuario, pass) values(" + conexion.dbConn.escape(usuario) +", " + conexion.dbConn.escape(password) + ")" ,
        function(error, results, field)
        {
            if(error) {console.log(error); return res.status(400).send({message:'Error'});}
            return res.status(200).send({message:'Usuario registrado'});
        });
}
)


// ------------          MENU         --------------- //

app.get('/menu/:id', function(req, res)
{
    let id_menu = req.params.id;


    menu.obtiene_menu(id_menu).then(
        function(resultado)
        {
            return res.status(200).send({error: false, padre: id_menu, data: resultado, message: 'Lista de menu'});
        })
        .catch(
           error =>
            {
                console.log(error); return res.status(400).send({message:'Error'});
            }
        );
})

app.get('/obtener_titulo_menu/:id',
    (req, res) =>
    {
        let id_menu = req.params.id;
        menu.obtiene_titulo(id_menu).then(
            (vTitulo) => { return res.status(200).send({error: false, titulo: vTitulo, id: id_menu});}
        ).catch(
            () => {
                console.log(error); return res.status(400).send({message:'Error'});
            }

        )
    }
)

app.post('/addMenu', function(req,res)
{
    let titulo = req.body.titulo;
    let padre  = req.body.padre;

    let tipo_pagina = req.body.tipo_pagina;
    let enlace = req.body.enlace;

    if(esLogueado(req.session.nombre))
    {
        let login_sesion = req.session.nombre;

        gestion_usuarios.esAdministrador(login_sesion).then(function(bAdministrador)
            {
                if(bAdministrador)
                {
                    
                    menu.registrar_menu(titulo, padre, tipo_pagina, enlace).then(
                        function(bResultado)
                        {
                            if(bResultado)
                            {
                                return res.status(200).send({error: false, message:'Menu creado'});
                            }
                            return res.status(400).send({error: true, message:'Error'});
                        }
                    )
                }
               
            }
        );
    }
})

app.post('/eliminar_menu', 
    (req, res) =>
    {
        let id_menu = req.body.id_menu;
        gestion_usuarios.esAdministrador(req.session.nombre).then(
            (bEsAdministrador) =>
            {
                if(bEsAdministrador)
                {
                    menu.eliminar_menu(id_menu).then(
                        () => {return res.status(200).send({error: false, message: 'Página eliminada'})}
                    ).catch(
                        () => {return res.status(200).send({error: true, message: 'Ha ocurrido algún error'})}
                    )
                }
            }
        )
    }

)

app.post('/actualizar_titulo_menu',
    (req, res) =>
    {
        let id_menu = req.body.id_menu;
        let titulo = req.body.titulo;
        gestion_usuarios.esAdministrador(req.session.nombre).then(
            (bEsAdministrador) =>
            {
                if(bEsAdministrador)
                {
                    menu.actualizar_titulo_menu(id_menu, titulo).then(
                        () =>
                        {
                            return res.status(200).send({error:false, message: 'Titulo actualizado'})
                        }
                    )
                }
            }
        );
    }
)

// -----------   Componentes   ------------------ //


app.get('/tipo_componente/:id', function(req, res)
{
    
    let id_componente = req.params.id;

    componente.tipo_componente(id_componente).then(
        function(tipo)
        {
            return res.status(200).send({error: false, nTipo: tipo, message: 'Tipo componente'});
        }
    );
})

app.get('/componente_texto/:id', function(req, res)
{
    let id_componente = req.params.id;

    componente.obtiene_componente_texto(id_componente).then(
        function(resultado)
        {
            return res.status(200).send({error:false, componente: resultado, message:'Componente de texto'});
        }).catch(
            error =>
            {
                return res.status(200).send({error: true, message: 'No existe el componente'});
            }
        );

})


app.get('/parametro/:identificador', function(req, res)
{
    let identificador = req.params.identificador;

    parametro(identificador).then(
        function(resultado)
        {
            return res.status(200).send({error:false, valor: resultado});
        }
    ).cathc( (error) =>
        {
            return res.status(200).send({error: true, message: 'No existe el parametro'});
        }
    );
   
})

app.get('/numero_componentes/:id_pagina', function(req, res)
{
    let id_pagina = req.params.id_pagina;
    componente.obtiene_numero_componente(id_pagina).then((numero) => {return res.status(200).send({error:false, numero:numero})});
})

app.get('/obtiene_orden/:id_pagina/:id_componente', function(req, res)
{
    let id_pagina = req.params.id_pagina;
    let id_componente = req.params.id_componente;

    componente.obtiene_orden(id_pagina, id_componente).then((orden) => {return res.status(200).send({error:false, orden:orden})});
})

// Registra el texto de un componente de texto, si no existe lo crea
app.post('/guardar_texto', function(req,res)
{
    let texto_html = req.body.cTexto;
    let nid  = req.body.nid;

    if(esLogueado(req.session.nombre))
    {
        let login_sesion = req.session.nombre;
        gestion_usuarios.esAdministrador(login_sesion).then(
            function(bAdministrador)
            {
                if(bAdministrador)
                {
                    componente.actualizar_texto(texto_html, nid).then(
                        function(bRetorno)
                        {
                            console.log(bRetorno);
                            if(bRetorno)
                            {
                                return res.status(200).send({error: false, message:'Componente actualizado'});
                            }
                        }
                    )
                    .catch(
                        function(){
                            console.log('Error');
                            return res.status(400).send({error:true, message:'Error'});
                        }
                    )
                }
                else{
                    return res.status(400).send({error: true, message: 'Error'});
                }
              
            }
        );
    }
})


app.post('/registrar_componente', function(req, res)
{
    
    let id = req.body.id;
    let tipo_componente = req.body.tipo_componente;
    let tipo_asociacion = req.body.tipo_asociacion;

    console.log('Tipo componente ' + tipo_componente);
    console.log('Tipo asociacion ' + tipo_asociacion);

    if(esLogueado(req.session.nombre))
    {

        let usuario = req.session.nombre;
        gestion_usuarios.esAdministrador(usuario).then(
            function(bEsAdministrador)
            {
                if (bEsAdministrador)
                {
                   
                    if (tipo_componente == constantes.TIPO_COMPONENTE_TEXTO)
                    {
                        
                        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                        {
                            console.log('-- registrar_componente_texto --');
                            componente.registrar_componente_texto(id, tipo_asociacion).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                            )
                            .catch(
                                () => { return res.status(400).send({error: true, message: 'Error'});}
                            )
                        }
                        else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                        {
                            let nOrden = req.body.nOrden;
                            console.log('-- registrar_componente_texto_orden -- ' + nOrden);
                            componente.registrar_componente_texto_orden(id, tipo_asociacion, nOrden).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                            )
                            .catch(
                                () => { return res.status(400).send({error: true, message: 'Error'});}
                            )
                        }
                    }
                    else if(tipo_componente == constantes.TIPO_COMPONENTE_IMAGEN)
                    {
                        console.log('Registrar Imagen');

                        let titulo = req.body.titulo;

                        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                        {
			  
                            componente.registrar_componente_imagen(id, titulo, tipo_asociacion).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                                )
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        }
                        else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                        {
                            let nOrden = req.body.nOrden;
                            componente.registrar_componente_imagen_orden(id, titulo, tipo_asociacion, nOrden).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                                )
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        } 
                    }
                    else if(tipo_componente == constantes.TIPO_COMPONENTE_VIDEO)
                    {
                        console.log('Registrar Video');

                        let url = req.body.url;

                        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                        {
			  
                            componente.registrar_componente_video(id, url, tipo_asociacion).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                                )
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        }
                        else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                        {
                            let nOrden = req.body.nOrden;
                            componente.registrar_componente_video_orden(id, url, tipo_asociacion, nOrden).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                                )
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        } 
                    }
                    else if(tipo_componente == constantes.TIPO_COMPONENTE_GALERIA)
                    {
                        console.log('Registrar Galeria');

                        let titulo = req.body.titulo;
                        let descripcion = req.body.descripcion;

                        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                        {
			  
                            componente.registrar_componente_galeria(id, titulo, descripcion, tipo_asociacion).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                                )
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        }
                        else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                        {
                            let nOrden = req.body.nOrden;
                            componente.registrar_componente_galeria_orden(id, titulo, descripcion, tipo_asociacion, nOrden).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                                )
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        } 
                    }
                    else if(tipo_componente == constantes.TIPO_COMPONENTE_COMPONENTES)
                    {
                        console.log('Registrar Componente Componentes ' + tipo_asociacion);
                        let nColumnas = req.body.nColumnas;

                        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                        {
                            
                            componente_componentes.insertar_componente_componentes(id, nColumnas, tipo_asociacion).then(
                                () => {
                                    return res.status(200).send({error: false, message:'Componente creado'});
                                })
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        }
                        else
                        {
                            return res.status(400).send({error: true, message:'Operación no permitida'});
                        }
                        /*
                        else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                        {
                            let nOrden = req.body.nOrden;
                            componente_componentes.insertar_componente_componentes(id, nColumnas, tipo_asociacion, nOrden).then(
                                () => {
                                    return res.status(200).send({error: false, message:'Componente creado'});
                                })
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        }*/
                    }
                    else if(tipo_componente == constantes.TIPO_COMPONENTE_PAGINAS)
                    {
                        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                        {
                            let titulo = req.body.titulo;
                            console.log('Registrar componente páginas')
                            componente.registrar_componente_paginas(id, tipo_asociacion).then(
                                () => {return res.status(200).send({error: false, message:'Componente creado'});}
                                )
                                .catch(
                                    () => { return res.status(400).send({error: true, message: 'Error'});}
                            );
                        }
                        else
                        {
                            return res.status(400).send({error: true, message:'Operación no permitida'});
                        }
                    }
                    else if(tipo_componente == constantes.TIPO_COMPONENTE_CARUSEL)
                    {
                        console.log('Registrar componente Carrusel')
                        servlet_componente.registrar_componente_carusel(req, res);
                    }
                   
                }
               
            }
        );
    }

})

app.get('/obtener_componentes/:id_pagina', function(req, res)
{
    componente.obtiene_componentes(req.params.id_pagina).then(
        function(resultados)
        {
            return res.status(200).send({error: false, data: resultados, message: 'Lista de usuarios'});
        }
    ).catch(
        function()
        {
            return res.status(400).send({error: true, message: 'Error'});
        }
    );      
})

app.post('/incrementa_orden',
    function(req, res)
    {
        let id_pagina = req.body.id_pagina;
        let id_componente = req.body.id_componente;

        if(esLogueado(req.session.nombre))
        {
            let usuario = req.session.nombre;
            gestion_usuarios.esAdministrador(usuario).then(
                bEsAdministrador =>
                {
                    if (bEsAdministrador)
                    {
                        componente.incrementa_orden(id_pagina, id_componente).then(
                            () => {return res.status(200).send({error: false, message:'Componente modificado'});}
                        )
                        .catch(
                            () =>  {return res.status(400).send({error: true, message:'Error'});}
                        )
                    }
                }
            )
        }
    }
)

app.post('/decrementa_orden',
    function(req, res)
    {
        let id_pagina = req.body.id_pagina;
        let id_componente = req.body.id_componente;

        if(esLogueado(req.session.nombre))
        {
            let usuario = req.session.nombre;
            gestion_usuarios.esAdministrador(usuario).then(
                bEsAdministrador =>
                {
                    if (bEsAdministrador)
                    {
                        componente.decrementa_orden(id_pagina, id_componente).then(
                            () => {return res.status(200).send({error: false, message:'Componente modificado'});}
                        )
                        .catch(
                            () =>  {return res.status(400).send({error: true, message:'Error'});}
                        )
                    }
                }
            )
        }
    }
)


app.post('/eliminar_componente',
    function(req, res)
    {
        let id_componente = req.body.id_componente;
        let tipo_asociacion = req.body.tipo_asociacion;
        let id_pagina;

        if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
        {
            id_pagina = req.body.id_pagina;
        }
        if(esLogueado(req.session.nombre))
        {
            let usuario = req.session.nombre;
            gestion_usuarios.esAdministrador(usuario).then(
                bEsAdministrador =>
                {
                    if (bEsAdministrador)
                    {
                        // Obtiene el tipo de componente
                        componente.tipo_componente(id_componente).then(
                            async (tipo) =>
                            {
                               if(tipo == constantes.TIPO_COMPONENTE_TEXTO)
                               {
                                   console.log('Eliminar componente texto');
                                    componente.eliminar_componente_texto(id_pagina, id_componente, tipo_asociacion)
                                    .then(() => {console.log('Eliminado'); return res.status(200).send({error: false, message: 'Componente eliminado'});})
                                    .catch(() => {console.log('Error'); return res.status(400).send({error: true, message: 'Error'});})
                               }
                               if(tipo == constantes.TIPO_COMPONENTE_IMAGEN)
                               {
                                   console.log('Eliminar componente imagen');
                                    componente.eliminar_componente_imagen(id_pagina, id_componente, tipo_asociacion)
                                    .then(() => {console.log('Eliminado'); return res.status(200).send({error: false, message: 'Componente eliminado'});})
                                    .catch(() => {console.log('Error'); return res.status(400).send({error: true, message: 'Error'});})
                               }
                               if(tipo == constantes.TIPO_COMPONENTE_COMPONENTES)
                               {
                                   console.log('Eliminar componente componentes')
                                   {
                                       componente_componentes.eliminar_componente_componentes(id_pagina, id_componente)
                                       .then(
                                           () => {console.log('Eliminado'); return res.status(200).send({error: false, message: 'Componente eliminado'});}
                                       )
                                       .catch(
                                        () => {console.log('Error'); return res.status(400).send({error: true, message: 'Error'});}
                                       )
                                   }
                               }
                               if(tipo == constantes.TIPO_COMPONENTE_VIDEO)
                               {
                                   console.log('Eliminar componente VIDEO');
                                    componente.eliminar_componente_video(id_pagina, id_componente, tipo_asociacion)
                                    .then(() => {console.log('Eliminado'); return res.status(200).send({error: false, message: 'Componente eliminado'});})
                                    .catch(() => {console.log('Error'); return res.status(400).send({error: true, message: 'Error'});})
                               }
                               if(tipo == constantes.TIPO_COMPONENTE_GALERIA)
                               {
                                   console.log('Eliminar componente Galeria');
                                    componente.eliminar_componente_galeria(id_pagina, id_componente, tipo_asociacion)
                                    .then(() => {console.log('Eliminado'); return res.status(200).send({error: false, message: 'Componente eliminado'});})
                                    .catch(() => {console.log('Error'); return res.status(400).send({error: true, message: 'Error'});})
                               }
                               if(tipo == constantes.TIPO_COMPONENTE_PAGINAS)
                               {
                                    console.log('Eliminar compoonente Paginas');
                                    componente.eliminar_componente_paginas(id_pagina, id_componente, tipo_asociacion)
                                    .then(() => {console.log('Eliminado'); return res.status(200).send({error: false, message: 'Componente eliminado'});})
                                    .catch(() => {console.log('Error'); return res.status(400).send({error: true, message: 'Error'});})
                               }  
                               if(tipo == constantes.TIPO_COMPONENTE_CARUSEL)
                               {
                                 console.log('Eliminar componente Carusel')
                                 try
                                 {
                                    await componente.eliminar_componente_carusel(id_pagina, id_componente, tipo_asociacion)
                                 }
                                 catch(error)
                                 {
                                    console.log('Error eliminar componente carusel')
                                    return res.status(400).send({error: true, message: 'Error al eliminar el componente'})
                                 }
                               }
                            }
                        )
                    }
                 
                }
            );
        }

    }
)

// Obtiene el número de componetes hijos registrados que tiene un componente de componentes
app.get('/numero_componente_componentes/:id',
    (req, res) =>
    {
        let id_componente = req.params.id;

        componente_componentes.obtiene_num_componentes(id_componente).then(
            (num_componentes) => { return res.status(200).send({error: false, num_componentes:num_componentes});}
        ).catch(
            () =>
            {
                return res.status(400).send({error: true});
            }
        )
    }
)

app.get('/numero_componente_componentes_definidos/:id',
    (req, res) =>
    {
        let id_componente = req.params.id;

        componente_componentes.obtiene_num_componentes_definidos(id_componente).then(
            (num_componentes) => { return res.status(200).send({error: false, num_componentes:num_componentes});}
        ).catch(
            () =>
            {
                return res.status(400).send({error: true});
            }
        );
    }
)

app.get('/obtiene_componente_componentes/:id_componente/:nOrden',
    (req, res) =>
    {
        let id_componente = req.params.id_componente;
        let nOrden = req.params.nOrden;

        componente_componentes.existe_componente_componentes(id_componente, nOrden).then(
            (bExiste) =>
            {
                if(!bExiste)
                {
                    return res.status(200).send({error: false, existe: false});
                }
                else{

                    componente_componentes.obtiene_componente_componentes(id_componente, nOrden).then(
                        (resultado) =>
                        {
   
                            componente.tipo_componente(resultado.nid_componente_hijo).then(
                            (nTipo_componente) =>
                            {
                                return res.status(200).send({error: false, existe: true, data: resultado, tipo_componente: nTipo_componente});
                            })
                            .catch(
                                () => {return res.status(400).send({error: true});}
                            )
                           
                        }
                    ).catch(
                        () => {return res.status(400).send({error: true});}
                    )
                }
            }
        ).catch(
            () => {return res.status(400).send({error: true});}
        )
    }
)

/** IMAGENES **/
app.post('/actualizar_imagen',
    (req, res) =>
    {

        gestion_usuarios.esAdministrador(req.session.nombre).then(
            (bEsAdministrador) =>
            {
                if(bEsAdministrador)
                {
                    ficheros = req.files;
                    id_componente_imagen = req.body.id_componente_imagen;
          
                    imagen.actualizar_imagen(id_componente_imagen, ficheros).then(
                        () => { return res.status(200).send({error:false, message: 'Actualización correcta'});}
                    ).catch(
                        (error) => {return res.status(200).send({error:true, message: error});}
                    );
                }
            }
        )
    }
)

app.get('/ruta_imagen/:id',
    (req, res) =>
    {
        let id_componente_imagen = req.params.id;
        imagen.obtiene_id_imagen(id_componente_imagen).then(
            (id_imagen) =>
            {
                imagen.obtiene_ruta_imagen(id_imagen).then(
                    (ruta_imagen) => {return res.status(200).send({error: false, ruta: ruta_imagen})}
                )
            }
        )
    }
)

app.get('/imagen/:id',
    (req, res) => {

        let id_componente_imagen = req.params.id;
        imagen.obtiene_id_imagen(id_componente_imagen).then(
            (id_imagen) =>
            {
                imagen.obtiene_ruta_imagen(id_imagen).then(
                    (ruta_imagen) =>
                    {
                        fs.readFile(ruta_imagen,
                        (err, data) =>
                        {
                            res.writeHead(200);
                            res.write(data);
        
                            return res.end();
                        });
                    }
                )
            }
        )

      
    }
  );

  app.get('/imagen_url/:id',
  (req, res) => {

      let id_imagen = req.params.id;

    imagen.obtiene_ruta_imagen(id_imagen).then(
        (ruta_imagen) =>
        {
            fs.readFile(ruta_imagen,
            (err, data) =>
            {
                res.writeHead(200);
                res.write(data);
                return res.end();
            });
        }
    )


    
  }
);
/** Video **/
app.get('/obtiene_url_video/:id',
    (req, res) =>
    {
        let id_componente = req.params.id;
        componente.obtiene_url_video(id_componente).then(
            (url_video) =>
            {
                return res.status(200).send({error: false, url_video: url_video});
            }

        ).catch(
            () => { return res.status(400).send({error: true});}
        )
    }
)


  app.get('/obtiene_url/:id',
    (req, res) =>
    {
       let id_menu = req.params.id;
       menu.obtiene_url_menu(id_menu).then(
           (url_relativa) =>
           {
               return res.status(200).send({error: false, id_menu: id_menu, url: url_relativa});
           } 
       ).catch(
           () => { return res.status(200).send({error: true});}
       )
    }
  );

/** GALERIA **/
app.get('/obtiene_imagenes_galeria/:id',
    (req, res) =>
    {
        let id_componente_galeria = req.params.id;
        componente_galeria.obtiene_imagenes_galeria(id_componente_galeria).then(
            (data) =>
            {
                return res.status(200).send({error: false, imagenes: data});
            }
        ).catch(
          () =>
            {
                () => { return res.status(400).send({error: true});} 
            }
        )
    }
);

app.post('/add_imagen_galeria',
    (req, res) =>
    {
        
        gestion_usuarios.esAdministrador(req.session.nombre).then(
            (bEsAdministrador) =>
            {
                if(bEsAdministrador)
                {
                  id_componente = req.body.id_componente;
                  titulo = req.body.titulo;
                  fichero = req.files;
               
                  componente_galeria.add_imagen_galeria(id_componente, titulo, fichero).then(
                    () =>
                    {
                      return res.status(200).send({error:false, message: 'Imagen insertada'});
                    }
                  ).catch(
                        () => { return res.status(400).send({error: true});} 
                  )
                }
            }
        )
        .catch(
            () => { return res.status(400).send({error: true});} 
        )
        ;
    }
)

app.post('/eliminar_imagen_galeria', 
    (req, res) =>
    {
        gestion_usuarios.esAdministrador(req.session.nombre).then(
            (bEsAdministrador) =>
            {
                if(bEsAdministrador)
                {
                    id_componente = req.body.id_componente;
                    id_imagen = req.body.id_imagen;

                    componente_galeria.eliminar_imagen_galeria(id_componente, id_imagen).then(
                        () =>
                        {
                         return res.status(200).send({error:false, message: 'Imagen eliminada'});
                        }
                   ).catch(
                    () => { return res.status(400).send({error: true});} 
              )
                }
            }
        )
    }
)


/** Componente de páginas **/
app.get('/obtener_paginas_componente/:id',
    (req, res) =>
    {
        let id_componente_paginas = req.params.id;
        componente.obtener_paginas_componente(id_componente_paginas).then(
            (resultados) =>
            {
                return res.status(200).send({error: false, paginas: resultados, size: resultados.length});
            }   
        )
        .catch(
            () => {return res.status(400).send({error: true});}
        )
    }
)

app.post('/add_pagina_componente',
    (req, res) =>
    {
        gestion_usuarios.esAdministrador(req.session.nombre).then(
            (bEsAdministrador) =>
            {
                if(bEsAdministrador)
                {
                  id_componente = req.body.id_componente;
                  titulo = req.body.titulo;
                  descripcion = req.body.descripcion;
                  padre = req.body.padre;
                  console.log('ADD');
                  componente.add_pagina_componente(id_componente, padre, titulo, descripcion).then(
                    () =>
                    {
                      return res.status(200).send({error:false, message: 'Página insertada'});
                    }
                  ).catch(
                        () => { return res.status(400).send({error: true});} 
                  )
                }
            }
        )
        .catch(
            () => { return res.status(400).send({error: true});} 
        )
        ;
    }
)

app.post('/remove_pagina_componente', 
    (req, res) =>
    {
        gestion_usuarios.esAdministrador(req.session.nombre).then(
            (bEsAdministrador) =>
            {
                if(bEsAdministrador)
                {
                    id_componente = req.body.id_componente;
                    id_pagina = req.body.id_pagina;
                    console.log('id_pagina ' + id_pagina);
                    componente.remove_pagina_componente(id_componente, id_pagina).then(
                        () =>
                        {
                         return res.status(200).send({error:false, message: 'Página eliminada'});
                        }
                   ).catch(
                    () => { return res.status(400).send({error: true});} 
              )
                }
            }
        )
    }
)

/**
 * Componente Carrusel
 */
  app.get('/obtener_carusel/:id_componente', servlet_componente.obtener_componente_carusel)

  app.post('/add_imagen_carusel', servlet_componente.add_imagen_carusel)

  app.post('/eliminar_imagen_carusel', servlet_componente.eliminar_imagen_carusel)

  https.createServer({
    key: fs.readFileSync('apache.key'),
    cert: fs.readFileSync('apache-certificate.crt')
  }, app).listen(PORT, function(){
    console.log("My HTTPS server listening on port " + PORT + "...");
  });
  
