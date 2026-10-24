import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

export function obtenerConfiguracionImpresion() {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL + "obtener_configuracion_cuota_impresion",
      null,
    )
      .then((response) => {
        console.log("Respuesta", response);
        resolve(response);
      })
      .catch((error) => {
        console.log(
          "Error en el servicio al obtener la configuración de impresión",
        );
        reject(
          "Error al obtener la configuración de impresión: " + error.message,
        );
      });
  });
}

export function actualizarConfiguracionImpresion(datosConfiguracion) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "POST",
      URL_SERVICIO_MOVIL + "actualizar_configuracion_cuota_impresion",
      datosConfiguracion,
    )
      .then((response) => {
        console.log("Respuesta", response);
        resolve(response);
      })
      .catch((error) => {
        console.log(
          "Error en el servicio al actualizar la configuración de impresión",
        );
        reject(
          "Error al actualizar la configuración de impresión: " + error.message,
        );
      });
  });
}
