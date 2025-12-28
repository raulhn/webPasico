import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";
import * as Constantes from "../config/Constantes.js";

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

export async function obtenerListadoPersonas(tipo, activo) {
  try {
    const respuesta = await peticionServicio(
      "GET",
      Constantes.URL_SERVICIO_MOVIL +
        "obtener_personas_listado/" +
        tipo +
        "/" +
        activo,
      null,
    );
    return respuesta.personas;
  } catch (error) {
    console.log("Error en el servicio obtenerListadoPersonas");
    throw new Error(
      "Error al obtener el listado de personas: " + error.message,
    );
  }
}
