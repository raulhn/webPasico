const gestorConexion = require("../logica/gestorConexiones.js");
const config = require("../config/config.js");

async function comprobarRecaptcha(recaptchaToken) {
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const params = new URLSearchParams();
  params.append("secret", config.apikeyCloudflare);
  params.append("response", recaptchaToken);

  let respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  let respuesta_json = await respuesta.json();
  let bSuccess = respuesta_json.success;
  return bSuccess;
}

async function registrarConexion(req, res) {
  const token = req.body.token;
  const recaptchaToken = req.body.recaptchaToken;

  if (!token) {
    res.status(400).send("Token no proporcionado");
    return;
  }

  if (await comprobarRecaptcha(recaptchaToken)) {
    try {
      console.log("Registrando conexión: " + token);
      gestorConexion.registrarConexion(token);
      res
        .status(200)
        .send({ error: false, mensaje: "Conexión registrada correctamente." });
    } catch (error) {
      console.error("Error al registrar la conexión:" + error);
      res
        .status(500)
        .send({ error: true, mensaje: "Error al registrar la conexión." });
    }
  } else {
    console.log("Error de reCAPTCHA ");
    res.status(400).send("Error de Validación");
  }
}

module.exports.registrarConexion = registrarConexion;
module.exports.comprobarRecaptcha = comprobarRecaptcha;
