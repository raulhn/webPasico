const serviceComun = require("./serviceComun.js");
const Constantes = require("../config/constantes.js");

function obtenerTrimestres(cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_trimestres",
        null,
        cerrarSesion
      )
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.obtenerTrimestres = obtenerTrimestres;
