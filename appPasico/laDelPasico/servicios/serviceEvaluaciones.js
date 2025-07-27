const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

function obtenerEvaluaciones(nidMatricula, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_evaluaciones/" + nidMatricula,
        null,
        cerrarSesion
      )
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
}

function generarBoletin(nidMatricula, nidTrimestre, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL +
          "generar_boletin/" +
          nidMatricula +
          "/" +
          nidTrimestre,
        null,
        cerrarSesion
      )
      .then((response) => resolve(response))
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.obtenerEvaluaciones = obtenerEvaluaciones;
module.exports.generarBoletin = generarBoletin;
