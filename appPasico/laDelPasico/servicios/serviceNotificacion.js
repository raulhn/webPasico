import servletComun from "./serviceComun.js";
import Constantes from "../config/constantes.js";

function registrarNotificacion(personas, titulo, mensaje, data, cerrar_sesion) {
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

function registrarNotificacionGrupo(
  nid_grupo,
  grupos,
  titulo,
  mensaje,
  data,
  cerrar_sesion
) {
  const body = {
    nid_grupo: nid_grupo,
    grupos: grupos,
    titulo: titulo,
    mensaje: mensaje,
    data: data,
  };

  return new Promise((resolve, reject) => {
    servletComun
      .peticionSesion(
        "POST",
        Constantes.URL_SERVICIO_MOVIL + "registrar_notificacion_grupo",
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
        console.log("Response de registrarNotificacionGrupo:", error);
        console.log("Error en el servicio registrarNotificacionGrupo");
        reject(error);
      });
  });
}

function registrarNotificacionGeneral(titulo, mensaje, data, cerrar_sesion) {
  const body = {
    titulo: titulo,
    mensaje: mensaje,
    data: data,
  };

  return new Promise((resolve, reject) => {
    servletComun
      .peticionSesion(
        "POST",
        Constantes.URL_SERVICIO_MOVIL + "registrar_notificaciones_todos",
        body,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response);
        } else {
          reject("Se ha producido un error al realizar la notificación");
        }
      })
      .catch((error) => {
        console.log(
          "serviceNotificacion -> registrarNotificacionGeneral:",
          error
        );
        reject(error);
      });
  });
}

module.exports.registrarNotificacion = registrarNotificacion;
module.exports.registrarNotificacionGrupo = registrarNotificacionGrupo;
module.exports.registrarNotificacionGeneral = registrarNotificacionGeneral;
