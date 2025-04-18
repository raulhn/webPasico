const app = require("express")();
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const config = require("./config/config.js");

const servletUsuario = require("./servlets/servlet_usuario.js");
const servletConexion = require("./servlets/servlet_conexiones.js");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 300, // LÃ­mite de 300 solicitudes por IP
  message:
    "Demasiadas solicitudes desde esta IP, por favor intente mÃ¡s tarde.",
  standardHeaders: true, // Devuelve información de límite en los encabezados `RateLimit-*`
  legacyHeaders: false, // Desactiva los encabezados `X-RateLimit-*`
  validate: { trustProxy: false },
});

app.set("trust proxy", true);
app.use(limiter);

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
