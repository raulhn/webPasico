const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");
const serviceComun = require("./serviceComun.js");

function obtenerEvaluaciones(nidMatricula) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        Constantes.URL_SERVICIO_MOVIL + "obtener_evaluaciones/" + nidMatricula,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
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
