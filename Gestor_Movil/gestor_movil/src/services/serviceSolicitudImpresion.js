import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

function comprobarRespuesta(response, mensajePorDefecto) {
  if (response?.error) {
    throw new Error(response.mensaje || mensajePorDefecto);
  }
  return response;
}

export async function obtenerConfiguracionImpresion() {
  const response = await peticionServicio(
    "GET",
    URL_SERVICIO_MOVIL + "obtener_configuracion_cuota_impresion",
    null,
  );
  return comprobarRespuesta(
    response,
    "No se ha podido obtener la configuración de impresión.",
  );
}

export async function actualizarConfiguracionImpresion(datosConfiguracion) {
  const response = await peticionServicio(
    "POST",
    URL_SERVICIO_MOVIL + "actualizar_configuracion_cuota_impresion",
    datosConfiguracion,
  );
  return comprobarRespuesta(
    response,
    "No se ha podido actualizar la configuración de impresión.",
  );
}
