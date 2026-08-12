const serviceComun = require("./serviceComun");
import constantes from "../config/constantes";

export function obtenerAsistenciasAsignatura(
  nid_asignatura,
  nid_curso,
  cerrar_sesion
) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        constantes.URL_SERVICIO_MOVIL +
          "obtener_asistencias_asignatura/" +
          nid_asignatura +
          "/" +
          nid_curso,
        null,
        cerrar_sesion
      )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log("Error en obtenerAsistenciasAsignatura:", error);
        reject(error);
      });
  });
}
