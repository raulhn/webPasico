import servletComun from "./serviceComun.js";
import Constantes from "../config/constantes.js";

function obtenerMatriculasAsignaturaPersona(nid_matricula, cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servletComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL +
          "obtener_matriculas_asignatura_persona/" +
          nid_matricula,
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response);
        } else {
          reject(response.error);
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerMatriculasAsignatura");
        reject(error);
      });
  });
}

module.exports.obtenerMatriculasAsignaturaPersona =
  obtenerMatriculasAsignaturaPersona;
