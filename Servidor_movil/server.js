const app = require("express")();
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");

const config = require("./config/config.js");

const servletUsuario = require("./servlets/servlet_usuario.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("El servidor está funcionando correctamente.");
});

app.put("/registrar_usuario", servletUsuario.registrarUsuario);

https
  .createServer(
    {
      key: fs.readFileSync("ssl_cert_movil.key"),
      cert: fs.readFileSync("ssl-cert-movil.cert"),
    },
    app
  )
  .listen(config.puerto, () => {
    console.log("Escuchando en el puerto " + config.puerto);
  });
