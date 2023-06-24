var express = require('express');
const session = require('express-session');
var cors = require('cors');
var app = express();
const https = require('https');
const PORT = 8080;

var bodyParser = require('body-parser');
var constantes = require('./constantes.js');

var servlet_usuario = require('./servlets/servlet_usuario');
var servlet_persona = require('./servlets/servlet_persona.js');

var fs = require('fs');

var conexion = require('./conexion.js');
var sesion_config = require('./config/sesion.json');

app.use(cors({origin: "http://localhost:4200", credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(sesion_config));

app.get('/', 
(req, res) =>
{
    return res.status(200).send({error: true, message: 'Hola mundo'})
}
);


/** Usuarios **/
app.post('/login', servlet_usuario.login);
app.get('/logueado', servlet_usuario.logueado);
app.get('/logout', servlet_usuario.logout);
app.post('/registrar', servlet_usuario.registrar_usuario);
app.get('/obtener_usuarios', servlet_usuario.obtener_usuarios);
app.post('/actualiza_password', servlet_usuario.actualizar_password_usu);

/** Personas **/
app.get('/obtener_personas', servlet_persona.obtener_personas);
app.post('/actualizar_persona', servlet_persona.actualizar_persona);
app.get('/obtener_persona/:nid', servlet_persona.obtener_persona);

/** Musicos **/
app.get('/obtener_musicos', servlet_persona.obtener_musicos);
app.post('/registrar_musico', servlet_persona.registrar_musico);

https.createServer({
    key: fs.readFileSync('apache.key'),
    cert: fs.readFileSync('apache-certificate.crt')
  }, app).listen(PORT, function(){
    console.log("My HTTPS server listening on port " + PORT + "...");
  });


