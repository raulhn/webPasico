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

async function validarEmail(req, res) {
  const token = req.body.token;
  if (!token) {
    res.status(400).send("Token no proporcionado");
    return;
  }

  let resultado = await validacionEmail.validarEmail(token);

  if (resultado) {
    res.status(200).send({
      error: false,
      mensaje: "Correo verificado correctamente.",
    });
  } else {
    res.status(400).send({
      error: true,
      mensaje: "Error al verificar el correo.",
    });
  }
}

module.exports.registrarUsuario = registrarUsuario;
module.exports.validarEmail = validarEmail;
