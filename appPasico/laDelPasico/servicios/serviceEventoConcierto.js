const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

function obtenerEventosConciertos() {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO + "obtener_componente_blog/208", {
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
      fecha_evento: eventoConcierto.fecha,
      descripcion: eventoConcierto.descripcion,
      tipo_evento: eventoConcierto.tipo_evento,
      publicado: eventoConcierto.publicado,
    };
    serviceComun
      .peticionSesion(
        "POST",
        Constantes.URL_SERVICIO + "registrar_evento_concierto",
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
