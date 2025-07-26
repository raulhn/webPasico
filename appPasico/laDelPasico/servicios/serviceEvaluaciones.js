const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

function obtenerEvaluaciones(nidMatricula, cerrarSesion) {
  return new Promise((resolve, reject) => {
    console.log("Obteniendo evaluaciones para nidMatricula:", nidMatricula);
    console.log(
      Constantes.URL_SERVICIO_MOVIL + "obtener_evaluaciones/" + nidMatricula
    );
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_evaluaciones/" + nidMatricula,
        null,
        cerrarSesion
      )
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.obtenerEvaluaciones = obtenerEvaluaciones;
