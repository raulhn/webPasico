const servletConexion = require("./servlet_conexiones.js");
const gestorUsuario = require("../logica/usuario.js");

async function registrarUsuario(req, res) {
  const {
    nombre,
    primerApellido,
    segundoApellido,
    correoElectronico,
    password,
    recaptchaToken,
  } = req.body;

  console.log("Recibiendo datos de registro de usuario: ", recaptchaToken);

  let bSuccess = await servletConexion.comprobarRecaptcha(recaptchaToken);
  if (!bSuccess) {
    console.log("Error de reCAPTCHA");
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
        res
          .status(200)
          .send({ error: false, mensaje: "Usuario registrado correctamente" });
      })
      .catch((error) => {
        console.error("Error al registrar el usuario:" + error);
        res
          .status(500)
          .send({ error: true, mensaje: "Error al registrar el usuario." });
      });
  }
}

module.exports.registrarUsuario = registrarUsuario;
