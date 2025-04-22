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
    fetch(Constantes.URL_SERVICIO_MOVIL + "registrar_usuario", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        primerApellido: primerApellido,
        segundoApellido: segundoApellido,
        correoElectronico: correo,
        password: password,
        recaptchaToken: recaptchaToken,
      }),
    }).then((response) => {
      response
        .json()
        .then((data) => {
          console.log("Datos del servicio registrarUsuario");
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio registrarUsuario");
          reject(error);
        });
    });
  });
}
module.exports.registrarUsuario = registrarUsuario;
