const eslintPluginPrettier = require("eslint-plugin-prettier");
const gestorConexion = require("../logica/gestorConexiones.js");
const config = import("../config/config.js");

async function comprobarRecaptcha(recaptchaToken) {
  const url =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    config.apikeyGoogle +
    "&response=" +
    recaptchaToken +
    "";

  let respuesta = await fetch(url, { method: "post" });
  let respuesta_json = await respuesta.json();

  let bSuccess = respuesta_json.success;
  return bSuccess;
}

function registrarConexion(req, res) {
  const token = req.body.token;
  const recaptchaToken = req.body.recaptchaToken;

  if (!token) {
    res.status(400).send("Token no proporcionado");
    return;
  }

  if (comprobarRecaptcha(recaptchaToken)) {
    console.log("Validación de reCAPTCHA exitosa.");
    try {
      gestorConexion.registrarConexion(token);
      res
        .status(200)
        .send({ error: false, mensaje: "Conexión registrada correctamente." });
    } catch (error) {
      console.error("Error al registrar la conexión:", error);
      res
        .status(500)
        .send({ error: true, mensaje: "Error al registrar la conexión." });
    }
  } else {
    console.log("Error de reCAPTCHA: ", error);
    res.status(400).send("Error de Validación");
  }
}

module.exports.registrarConexion = registrarConexion;
