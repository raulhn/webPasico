import * as serviceComun from "./ServiceComun";
import * as Constantes from "../config/Constantes.js";

export function obtenerTrimestres() {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionServicio(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_trimestres",
        null
      )
      .then((response) => resolve(response.trimestres))
      .catch((error) => {
        reject(error);
      });
  });
}