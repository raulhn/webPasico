import servletComun from "./serviceComun.js";
import Constantes from "../config/constantes.js";

export function obtenerInstrumentos(cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servletComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_instrumentos",
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response.instrumentos);
        } else {
          reject(response.error);
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerInstrumentos");
        reject(error);
      });
  });
}
