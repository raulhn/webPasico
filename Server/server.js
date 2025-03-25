const https = require('https')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const session = require('express-session')
const fileUpload = require('express-fileupload')
const cors = require('cors')

require('dotenv').config()

const servletComponente = require('./servlets/servlet_componente.js')
const servletComponenteTexto = require('./servlets/servletComponenteTexto.js')
const servletComponenteComponentes = require('./servlets/servlet_componente_componentes.js')
const servletImagenes = require('./servlets/servlet_imagenes.js')
const servletVideos = require('./servlets/servlet_video.js')
const servletPaginas = require('./servlets/servlet_pagina.js')
const servletGaleria = require('./servlets/servlet_galeria.js')
const servletComponenteBlog = require('./servlets/servlet_componente_blog.js')
const servletUsuarios = require('./servlets/servlet_usuarios.js')
const servletPreinscripcion = require('./servlets/servlet_preinscripcion.js')
const servletCancionesEu = require('./servlets/servlet_canciones_eu.js')
const servletMenu = require('./servlets/servletMenu.js')

const sesionConfig = require('./config/sesion.json')

// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
const fs = require('fs')

/** Desarrollo **/
/*
var urlWeb = 'https://80.240.127.138:8081';
const PORT = 8444; */

/** Pre-Producción **/
/*
var urlWeb = 'https://ladelpasico.es:2096';
const PORT = 8444; */

/** Producción **/
const urlWeb = 'https://ladelpasico.es'
const urlWebGestor = 'https://pasico.ddns.net'
const PORT = 8443

app.use(cors({ origin: [urlWeb, urlWebGestor], credentials: true })) // Se configura el control de peticiones permitidas para poder recibir peticiones del front-end
// credentials: true permite la comunicación de la sesión

// Habilitar la subida de documentos
app.use(fileUpload({
  createParentPath: true
}))

app.use(session(sesionConfig))

/*
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, x-Requested-With, Content-Type, Accept,
     Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}); */

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  return res.status(200).send({ error: true, message: 'Hola mundo' })
})

/**  USUARIOS **/
app.get('/usuarios', servletUsuarios.obtenerUsuarios)
app.get('/logueado', servletUsuarios.esLogueado)
app.get('/logueado_administrador', servletUsuarios.esLogueadoAdministrador)
app.post('/login', servletUsuarios.login)
app.get('/logout', servletUsuarios.logout)
app.post('/registrar', servletUsuarios.registrar)

// ------------          MENU         --------------- //
app.get('/menu/:id', servletMenu.obtenerMenu)
app.get('/obtener_titulo_menu/:id', servletMenu.obtenerTitulo)
app.post('/addMenu', servletMenu.addMenu)
app.post('/eliminar_menu', servletMenu.eliminarMenu)
app.post('/actualizar_titulo_menu', servletMenu.actualizarTituloMenu)

// -----------   Componentes   ------------------ //

app.get('/tipo_componente/:id', servletComponente.tipo_componente)
app.get('/componente_texto/:id', servletComponente.obtener_componente_texto)
app.get('/parametro/:identificador', servletComponente.obtenerParametro)
app.get('/numero_componentes/:id_pagina', servletComponente.obtenerNumeroComponente)
app.get('/obtiene_orden/:id_pagina/:id_componente', servletComponente.obtiene_orden)

// Registra el texto de un componente de texto, si no existe lo crea
app.post('/guardar_texto', servletComponenteTexto.actualizarTexto)
app.post('/registrar_componente', servletComponente.registrarComponente)
app.get('/obtener_componentes/:id_pagina', servletComponente.obtenerComponentes)
app.post('/incrementa_orden', servletComponente.incrementarOrden)
app.post('/decrementa_orden', servletComponente.decrementarOrden)
app.post('/eliminar_componente', servletComponente.eliminarComponente)

// Obtiene el número de componetes hijos registrados que tiene un componente de componentes
app.get('/numero_componente_componentes/:id', servletComponenteComponentes.obtieneNumComponentes)
app.get('/numero_componente_componentes_definidos/:id', servletComponenteComponentes.obtieneNumComponentesDefinidos)

app.get('/obtiene_componente_componentes/:id_componente/:nOrden', servletComponenteComponentes.obtenerComponenteComponentes)

/** IMAGENES **/
app.post('/actualizar_imagen', servletImagenes.actualizarImagen)
app.get('/ruta_imagen/:id', servletImagenes.obtenerIdImagen)
app.get('/imagen/:id', servletImagenes.obtenerImagen)
app.get('/imagen_url/:id', servletImagenes.obtenerUrlImagen)

/** Video **/
app.get('/obtiene_url_video/:id', servletVideos.obtenerUrlVideo)

app.get('/obtiene_url/:id', servletPaginas.obtenerUrlMenu)

/** GALERIA **/
app.get('/obtiene_imagenes_galeria/:id', servletGaleria.obtieneImagenesGaleria)
app.post('/add_imagen_galeria', servletGaleria.addImagenGaleria)
app.post('/eliminar_imagen_galeria', servletGaleria.eliminarImagenGaleria)

/** Componente de páginas **/
app.get('/obtener_paginas_componente/:id', servletPaginas.obtenerPaginasComponente)
app.post('/add_pagina_componente', servletPaginas.addPaginaComponente)
app.post('/remove_pagina_componente', servletPaginas.eliminarPaginaComponente)

/**
 * Usuario
 */
app.post('/actualizar_password', servletUsuarios.actualizar_password)

/**
 * Componente Carrusel
 */
app.get('/obtener_carusel/:id_componente', servletComponente.obtenerComponenteCarrusel)
app.post('/add_imagen_carusel', servletComponente.addImagenCarrusel)
app.post('/eliminar_imagen_carusel', servletComponente.eliminarImagenCarrusel)
app.post('/actualizar_elementos_simultaneos', servletComponente.actualizarElementosSimultaneos)

/**
 * Componente Blog
 */
app.get('/obtener_componente_blog/:id_componente', servletComponenteBlog.obtenerComponenteBlog)
app.post('/add_componente_blog', servletComponenteBlog.addElementoBlog)
app.post('/eliminar_elemento_blog', servletComponenteBlog.eliminarElementoBlog)

/**
   * Preinscripcion
   */
app.post('/registrar_preinscripcion', servletPreinscripcion.registrarPreinscripcion)
app.get('/obtener_preinscripciones', servletPreinscripcion.obtenerPreinscripcionesApi)
app.get('/obtener_preinscripciones_detalle/:nid_preinscripcion', servletPreinscripcion.obtenerPreinscripcionesDetalle)

/**
   * Canciones EU
   */
app.get('/obtener_canciones', servletCancionesEu.obtenerCanciones)
app.get('/obtener_votaciones', servletCancionesEu.obtenerVotaciones)

https.createServer({
  key: fs.readFileSync('apache.key'),
  cert: fs.readFileSync('apache-certificate.crt')
}, app).listen(PORT, function () {
  console.log('My HTTPS server listening on port ' + PORT + '...')
})
