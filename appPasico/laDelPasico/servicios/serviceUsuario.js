let Constantes = require("../constantes.js");

function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correo,
  password,
  recaptchaToken
) {
  return new Promise((resolve, reject) => {
    console.log("Lanza el servicio registrarUsuario");
    console.log("Nombre: " + nombre);
    console.log("Primer apellido: " + primerApellido);
    console.log("Segundo apellido: " + segundoApellido);

    console.log("Correo: " + correo);
    console.log("Contraseña: " + password);
    console.log("Token de reCAPTCHA: " + recaptchaToken);
    fetch(Constantes.URL_SERVICIO_MOVIL + "registrar_usuario", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        primerApellido: primerApellido,
        segundoApellido: segundoApellido,
        correo: correo,
        password: password,
        recaptchaToken: recaptchaToken,
      }),
    }).then((response) => {
      response
        .json()
        .then((data) => {
          console.log("Datos del servicio registrarUsuario");
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio registrarUsuario");
          console.log(error);
          reject(error);
        });
    });
  });
}
module.exports.registrarUsuario = registrarUsuario;
