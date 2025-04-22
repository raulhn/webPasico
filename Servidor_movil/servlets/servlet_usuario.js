const servletConexion = require("./servlet_conexiones.js");
const gestorUsuario = require("../logica/usuario.js");
const validacionEmail = require("../logica/validacionEmail.js");

async function registrarUsuario(req, res) {
  try {
    const {
      nombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      password,
      recaptchaToken,
    } = req.body;

    let bSuccess = await servletConexion.comprobarRecaptcha(recaptchaToken);
    if (!bSuccess) {
      res.status(400).send({ error: true, mensaje: "Error de Validación" });
    } else {
      await gestorUsuario
        .registrarUsuario(
          nombre,
          primerApellido,
          segundoApellido,
          correoElectronico,
          password
        )
        .then((resultado) => {
          res.status(200).send({
            error: false,
            mensaje: "Usuario registrado correctamente",
          });
        })
        .catch((error) => {
          console.error("Error al registrar el usuario:" + error.message);
          res.status(400).send({
            error: true,
            mensaje: error.message,
          });
        });
    }
  } catch (error) {
    console.error("Error en el registro del usuario:", error);
    res.status(400).send({
      error: true,
      mensaje: error.message,
    });
  }
}

async function verificarCorreo(req, res) {
  const token = req.params.token;
  if (!token) {
    res.status(400).send("Token no proporcionado");
    return;
  }

  let resultado = await validacionEmail.verificarEmail(token);
  const htmlCorrecto = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto; text-align: center;">
    <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 20px;">Correo verificado correctamente</h1>
    <p style="color: #333; font-size: 16px; line-height: 1.5;">
      Su correo ha sido verificado correctamente.
    </p>
  </div>
`;

  const htmlIncorrecto = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto; text-align: center;">
    <h1 style="color: #f44336; font-size: 24px; margin-bottom: 20px;">Error al verificar el correo</h1>
    <p style="color: #333; font-size: 16px; line-height: 1.5;">
      El token de verificación no es válido o ha expirado.
    </p>
  </div>`;

  if (resultado) {
    res.status(200).send(htmlCorrecto);
  } else {
    res.status(400).send(htmlIncorrecto);
  }
}

module.exports.registrarUsuario = registrarUsuario;
module.exports.verificarCorreo = verificarCorreo;
