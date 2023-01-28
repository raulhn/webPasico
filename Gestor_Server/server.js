var express = require('express');
const session = require('express-session');
var cors = require('cors');
var app = express();
const https = require('https');
const PORT = 8080;

var bodyParser = require('body-parser');
var constantes = require('./constantes.js');

var servlet_usuario = require('./servlets/servlet_usuario');

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


https.createServer({
    key: fs.readFileSync('apache.key'),
    cert: fs.readFileSync('apache-certificate.crt')
  }, app).listen(PORT, function(){
    console.log("My HTTPS server listening on port " + PORT + "...");
  });


