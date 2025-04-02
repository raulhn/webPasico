const app = require("express")();
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");

const config = require("./config/config.js");

const servletUsuario = require("./servlets/servlet_usuario.js");
const servletConexion = require("./servlets/servlet_conexiones.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("El servidor está funcionando correctamente.");
});

app.put("/registrar_usuario", servletUsuario.registrarUsuario);

/**  Conexiones **/
app.put("/registrar_conexion", servletConexion.registrarConexion);

https
  .createServer(
    {
      key: fs.readFileSync("apache.key"),
      cert: fs.readFileSync("apache-certificate.crt"),
    },
    app
  )
  .listen(config.puerto, () => {
    console.log("Escuchando en el puerto " + config.puerto);
  });
