import Constantes from "../constantes.js";
import servicioComun from "./serviceComun.js";

function obtenerPersonas(cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servicioComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_personas",
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response.personas);
        } else {
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerPersonas");
        reject(error);
      });
  });
}

module.exports.obtenerPersonas = obtenerPersonas;
