import { peticionServicio } from "./ServiceComun";
import * as Constantes from "../config/Constantes.js";

export function obtenerEventosRangoFechas(fecha_inicio, fecha_fin) {
  return new Promise((resolve, reject) => {
    const data = {
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
    };
    peticionServicio(
      "GET",
      Constantes.URL_SERVICIO_MOVIL +
        "obtener_agenda_eventos_rango_fecha" +
        "/" +
        fecha_inicio +
        "/" +
        fecha_fin,
      data,
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
