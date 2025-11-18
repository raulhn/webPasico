import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

export function obtenerInfoPersona(nidPersona) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL + "obtener_info_persona/" + nidPersona,
      null,
    )
      .then((response) => {
        console.log("Respuesta", response);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
