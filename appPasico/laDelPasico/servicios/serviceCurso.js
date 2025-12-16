import ServiceComun from "./serviceComun.js";
import Constantes from "../config/constantes.js";

function obtenerCursos(cerrar_sesion) {
  return new Promise((resolve, reject) => {
    ServiceComun.peticionServicio(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_cursos",
      null,
      cerrar_sesion
    )
      .then((data) => {
        if (data) {
          resolve(data.cursos);
        } else {
          reject(new Error("No se obtuvieron cursos"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.obtenerCursos = obtenerCursos;

