const constantes_email = require("../config/email_constantes.js");
const gestorSolicitudesEliminacionUsuario = require("../logica/solicitudes_eliminacion_usuario.js");
async function validaCaptcha(token) {
  try {
    const url =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      constantes_email.CLAVE +
      "&response=" +
      token +
      "";

    let respuesta = await fetch(url, { method: "post" });
    let respuesta_json = await respuesta.json();

    let bSuccess = respuesta_json.success;

    return bSuccess;
  } catch (error) {
    console.error("Error al validar el captcha:", error);
    throw new Error("Error al validar el captcha");
  }
}

async function registrarSolicitudEliminacionUsuario(req, res) {
  try {
    let correo_electronico = req.body.correo_electronico;
    let token = req.body.token;

    let bCaptchaValido = await validaCaptcha(token);

    if (!bCaptchaValido) {
      return res
        .status(400)
        .send({ error: true, message: "Captcha inválido." });
    }

    await gestorSolicitudesEliminacionUsuario.registrarSolicitudEliminacionUsuario(
      correo_electronico,
    );
    return res.status(200).send({
      error: false,
      message: "Solicitud de eliminación de usuario registrada correctamente.",
    });
  } catch (error) {
    console.error(
      "Error al registrar la solicitud de eliminación de usuario:",
      error,
    );
    return res.status(500).send({
      error: true,
      message: "Error al registrar la solicitud de eliminación de usuario.",
    });
  }
}

module.exports.registrarSolicitudEliminacionUsuario =
  registrarSolicitudEliminacionUsuario;
