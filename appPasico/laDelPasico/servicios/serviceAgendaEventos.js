import Constantes from "../config/constantes.js";
import ServiceComun from "./serviceComun.js";

function registrarEvento(evento, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      nombre: evento.nombre,
      fecha: evento.fecha,
      descripcion: evento.descripcion,
      publicado: evento.publicado,
    };

    ServiceComun.peticionSesion(
      "POST",
      Constantes.URL_SERVICIO_MOVIL + "registrar_agenda_evento",
      data,
      cerrarSesion
    )
      .then((response) => {
        console.log("Respuesta al registrar evento:", response);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function actualizarEvento(evento, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      nid_evento: evento.nid_evento,
      nombre: evento.nombre,
      fecha: evento.fecha,
      descripcion: evento.descripcion,
      publicado: evento.publicado,
    };
    ServiceComun.peticionSesion(
      "POST",
      Constantes.URL_SERVICIO_MOVIL + "actualizar_agenda_evento",
      data,
      cerrarSesion
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function eliminarEvento(nid_evento, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      nid_evento: nid_evento,
    };
    ServiceComun.peticionSesion(
      "POST",
      Constantes.URL_SERVICIO_MOVIL + "eliminar_agenda_evento",
      data,
      cerrarSesion
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function obtenerEventosFecha(fecha_evento, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      fecha_evento: fecha_evento,
    };
    ServiceComun.peticionSesion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_eventos_fecha",
      data,
      cerrarSesion
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function obtenerEventosMes(mes, anio, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      mes: mes,
      anio: anio,
    };
    ServiceComun.peticionSesion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_eventos_mes",
      data,
      cerrarSesion
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.obtenerEventosFecha = obtenerEventosFecha;
module.exports.registrarEvento = registrarEvento;
module.exports.actualizarEvento = actualizarEvento;
module.exports.eliminarEvento = eliminarEvento;
module.exports.obtenerEventosMes = obtenerEventosMes;
