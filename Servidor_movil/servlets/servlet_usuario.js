import servletConexion from "./servlet_conexiones.js";
import gestorUsuario from ("../logica/usuario.js");

async function registrarUsuario(req, res) {
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
    console.log("Error de reCAPTCHA: ", error);
    throw new Error("Error de Validación");
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
        res.status(200).send("Usuario registrado correctamente.");
      })
      .catch((error) => {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error al registrar el usuario.");
      });
  }
}

module.exports.registrarUsuario = registrarUsuario;
