const https = require("https");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

const session = require("express-session");
const fileUpload = require("express-fileupload");
var cors = require("cors");
require("dotenv").config();

const servlet_componente = require("./servlets/servlet_componente.js");
const servlet_componente_blog = require("./servlets/servlet_componente_blog.js");
const servlet_usuarios = require("./servlets/servlet_usuarios.js");
const servlet_preinscripcion = require("./servlets/servlet_preinscripcion.js");
const servlet_canciones_eu = require("./servlets/servlet_canciones_eu.js");
const servlet_pagina_componente = require("./servlets/servlet_pagina_componente.js");
const servlet_menu = require("./servlets/servlet_menu.js");
const servlet_parametros = require("./servlets/servlet_parametros.js");
const servlet_componente_texto = require("./servlets/servlet_componente_texto.js");
const servlet_componente_componentes = require("./servlets/servlet_componente_componentes.js");
const servlet_imagen = require("./servlets/servlet_imagen.js");
const servlet_video = require("./servlets/servlet_video.js");
const servlet_galeria = require("./servlets/servlet_galeria.js");

var sesion_config = require("./config/sesion.json");

//https://www.w3schools.com/nodejs/nodejs_filesystem.asp
var fs = require("fs");

/** Desarrollo **/
/*
var url_web = 'https://80.240.127.138:8081';
const PORT = 8444;*/

/** Pre-Producción */
/*
var url_web = 'https://ladelpasico.es:2096';
const PORT = 8444;*/

/** Producción **/
//var url_web = "https://ladelpasico.es";
var url_web_gestor = "https://pasico.ddns.net";
var url_web_gestor2 = "https://gestorpasico.com";

var url_web = "https://pasicopru.com";
const PORT = 8443;

app.use(
  cors({
    origin: [url_web, url_web_gestor, url_web_gestor2],
    credentials: true,
  })
); // Se configura el control de peticiones permitidas para poder recibir peticiones del front-end
// credentials: true permite la comunicación de la sesión

// Habilitar la subida de documentos
app.use(
  fileUpload({
    createParentPath: true,
  })
);

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
app.use(bodyParser.urlencoded({ extended: true }));

const nodemailer = require("nodemailer");

app.get("/", function (req, res) {
  return res.status(200).send({ error: true, message: "Hola mundo" });
});

/**************************
 **** Usuarios *****
 ***********************/
app.get("/usuarios", servlet_usuarios.usuarios);
app.get("/logueado", servlet_usuarios.logueado);
app.get("/logueado_administrador", servlet_usuarios.logueado_administrador);
app.post("/login", servlet_usuarios.login);
app.get("/logout", function (req, res) {
  req.session.destroy();
  res.status(200).send({ error: false, message: "Logout relizado" });
});
app.post("/actualizar_password", servlet_usuarios.actualizar_password);
app.post("/registrar", servlet_usuarios.registrar);

/******************
 ****  Menu *****
 *****************/
app.get("/menu/:id", servlet_menu.obtener_menu);
app.get("/obtener_titulo_menu/:id", servlet_menu.obtener_titulo_menu);
app.post("/addMenu", servlet_menu.add_menu);
app.post("/eliminar_menu", servlet_menu.eliminar_menu);
app.post("/actualizar_titulo_menu", servlet_menu.actualizar_titulo_menu);

/**************************
 **** Componentes *****
 ***********************/
app.get("/tipo_componente/:id", servlet_componente.tipo_componente);

app.get("/componente_texto/:id", servlet_componente_texto.componente_texto);

app.get("/parametro/:identificador", servlet_parametros.obtener_parametro);

app.get("/numero_componentes/:id_pagina", servlet_componente.num_componentes);

app.get(
  "/obtiene_orden/:id_pagina/:id_componente",
  servlet_componente.obtiene_orden
);

// Registra el texto de un componente de texto, si no existe lo crea
app.post("/guardar_texto", servlet_componente_texto.guardar_texto);

app.post("/registrar_componente", servlet_componente.registrar_componente);

app.get(
  "/obtener_componentes/:id_pagina",
  servlet_componente.obtener_componentes
);

app.post("/incrementa_orden", servlet_componente.incrementa_orden);

app.post("/decrementa_orden", servlet_componente.decrementa_orden);

app.post("/eliminar_componente", servlet_componente.eliminar_componente);

// Obtiene el número de componetes hijos registrados que tiene un componente de componentes
app.get(
  "/numero_componente_componentes/:id",
  servlet_componente_componentes.obtener_num_componente_componentes
);

app.get(
  "/numero_componente_componentes_definidos/:id",
  servlet_componente_componentes.num_componente_componentes_definidos
);

app.get(
  "/obtiene_componente_componentes/:id_componente/:nOrden",
  servlet_componente_componentes.obtiene_componente_componentes
);

/**************************
 **** Imágenes  *****
 ***********************/
app.post("/actualizar_imagen", servlet_imagen.actualizar_imagen);

app.get("/ruta_imagen/:id", servlet_imagen.ruta_imagen);

app.get("/imagen/:id", servlet_imagen.obtener_imagen);

app.get("/imagen_url/:id", servlet_imagen.obtener_url_imagen);

/** Video **/
app.get("/obtiene_url_video/:id", servlet_video.obtener_url_video);

app.get("/obtiene_url/:id", servlet_menu.obtener_url);

/*****************************
 **** Componente Galeria *****
 ****************************/
app.get(
  "/obtiene_imagenes_galeria/:id",
  servlet_galeria.obtener_imagenes_galeria
);
app.post("/add_imagen_galeria", servlet_galeria.add_imagen_galeria);
app.post("/eliminar_imagen_galeria", servlet_galeria.eliminar_galeria);

/**************************
 **** Componente Paginas *****
 ***********************/
app.get(
  "/obtener_paginas_componente/:id",
  servlet_pagina_componente.obtener_paginas_componente
);
app.post(
  "/add_pagina_componente",
  servlet_pagina_componente.add_pagina_componente
);
app.post(
  "/remove_pagina_componente",
  servlet_pagina_componente.remove_pagina_componente
);

/**************************
 **** Componente Carrusel *****
 ***********************/
app.get(
  "/obtener_carusel/:id_componente",
  servlet_componente.obtener_componente_carusel
);

app.post("/add_imagen_carusel", servlet_componente.add_imagen_carusel);

app.post(
  "/eliminar_imagen_carusel",
  servlet_componente.eliminar_imagen_carusel
);

app.post(
  "/actualizar_elementos_simultaneos",
  servlet_componente.actualizar_elementos_simultaneos
);

/**************************
 **** Componente Blog *****
 ***********************/
app.get(
  "/obtener_componente_blog/:id_componente",
  servlet_componente_blog.obtener_componente_blog
);

app.post("/add_componente_blog", servlet_componente_blog.add_elemento_blog);

app.post(
  "/eliminar_elemento_blog",
  servlet_componente_blog.eliminar_elemento_blog
);

/**************************
 **** Preinscripcion *****
 ***********************/
app.post(
  "/registrar_preinscripcion",
  servlet_preinscripcion.registrar_preinscripcion
);
app.get(
  "/obtener_preinscripciones",
  servlet_preinscripcion.obtener_preinscripciones_api
);
app.get(
  "/obtener_preinscripciones_detalle/:nid_preinscripcion",
  servlet_preinscripcion.obtener_preinscripciones_detalle
);

app.get(
  "/obtener_preinscripciones_login",
  servlet_preinscripcion.obtener_preinscripciones
);

app.get(
  "/obtener_preinscripciones_detalle_login/:nid_preinscripcion",
  servlet_preinscripcion.obtener_preinscripciones_detalle_login
);

/**
 * Canciones EU
 */
app.get("/obtener_canciones", servlet_canciones_eu.obtener_canciones);
app.get("/obtener_votaciones", servlet_canciones_eu.obtener_votaciones);

https
  .createServer(
    {
      key: fs.readFileSync("apache.key"),
      cert: fs.readFileSync("apache-certificate.crt"),
    },
    app
  )
  .listen(PORT, function () {
    console.log("My HTTPS server listening on port " + PORT + "...");
  });
