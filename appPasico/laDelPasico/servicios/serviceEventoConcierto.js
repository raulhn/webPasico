const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

function obtenerEventosConciertos() {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO_MOVIL + "obtener_eventos_concierto", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function registrarEventoConcierto(eventoConcierto, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      nombre: eventoConcierto.nombre,
      fecha_evento: eventoConcierto.fecha_evento,
      descripcion: eventoConcierto.descripcion,
      tipo_evento: eventoConcierto.tipo_evento,
      publicado: eventoConcierto.publicado,
    };
    serviceComun
      .peticionSesion(
        "POST",
        Constantes.URL_SERVICIO_MOVIL + "registrar_evento_concierto",
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

function obtenerEventoConcierto(nidEventoConcierto, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL +
          "obtener_evento_concierto/" +
          nidEventoConcierto,
        null,
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

function registrarPartituraEvento(
  nidPartitura,
  nidEventoConcierto,
  cerrarSesion
) {
  return new Promise((resolve, reject) => {
    const data = {
      nid_partitura: nidPartitura,
      nid_evento_concierto: nidEventoConcierto,
    };
    serviceComun
      .peticionSesion(
        "POST",
        Constantes.URL_SERVICIO_MOVIL + "registrar_partitura_evento",
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

module.exports.obtenerEventosConciertos = obtenerEventosConciertos;
module.exports.registrarEventoConcierto = registrarEventoConcierto;
module.exports.obtenerEventoConcierto = obtenerEventoConcierto;
module.exports.registrarPartituraEvento = registrarPartituraEvento;
