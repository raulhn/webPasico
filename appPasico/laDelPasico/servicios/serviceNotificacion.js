import servletComun from "./serviceComun.js";
import Constantes from "../constantes.js";

function registrarNotificacion(personas, titulo, mensaje, data, cerrar_sesion) {
  console.log("registrarNotificacion", personas, titulo, mensaje, data);
  const body = {
    personas: personas,
    titulo: titulo,
    mensaje: mensaje,
    data: data,
  };
  return new Promise((resolve, reject) => {
    servletComun
      .peticionSesion(
        "POST",
        Constantes.URL_SERVICIO_MOVIL + "registrar_notificacion",
        body,
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
        console.log("Error en el servicio registrarNotificacion");
        reject(error);
      });
  });
}

module.exports.registrarNotificacion = registrarNotificacion;
