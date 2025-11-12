const envio_email = require("../config/envio_email.json");
const constantes_email = require("../config/email_constantes.js");

const s_transporter = require("../logica/transporter.js");
const gestorSolicitudesEliminacionUsuario = require("../logica/solicitudes_eliminacion_usuario.js");

async function validaCaptcha(token)
{
  try{
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
  try{
  let correo_electronico = req.body.correo_electronico;
  let token = req.body.token;

  let bCaptchaValido = await validaCaptcha(token);

  if (!bCaptchaValido) {
    return res.status(400).send({ error: true, message: "Captcha inválido." });
  }
  await gestorSolicitudesEliminacionUsuario.registrarSolicitudEliminacionUsuario(correo_electronico);
  
  let createTransport = s_transporter.obtener_transporter();

  const envio_email.html = `
    <h1>Solicitud de eliminación de usuario recibida</h1>
    <p>Recibida solicitud para eliminar la cuenta de usuario.</p>
    <br>
    <p>Revisa las últimas solicitudes recibidas en el panel de administración.</p>
    `;

  createTransport.sendMail(envio_email, function (error, info) {
      if (error) {
        console.log(error);
        console.log("Error al enviar email");
        reject();
      } else {
        console.log("Correo enviado correctamente");
        resolve();
      }
      createTransport.close();
    });

  return res.status(200).send({ error: false, message: "Solicitud de eliminación de usuario registrada correctamente." });
 } catch (error) {
    console.error("Error al registrar la solicitud de eliminación de usuario:", error);
    return res.status(500).send({ error: true, message: "Error al registrar la solicitud de eliminación de usuario." });
  }
}

  

