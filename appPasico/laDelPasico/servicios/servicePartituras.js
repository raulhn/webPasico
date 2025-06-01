const serviceComun = require("./serviceComun");
const constantes = require("../constantes");

function registrarPartitura(partitura, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      titulo: partitura.titulo,
      autor: partitura.autor,
      nid_categoria: partitura.categoria,
      url_partitura: partitura.url_partitura,
    };
    serviceComun
      .peticionSesion(
        "POST",
        constantes.URL_SERVICIO_MOVIL + "registrar_partitura",
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

function actualizarPartitura(partitura, cerrarSesion) {
  return new Promise((resolve, reject) => {
    const data = {
      nid_partitura: partitura.nid_partitura,
      titulo: partitura.titulo,
      autor: partitura.autor,
      nid_categoria: partitura.categoria,
      url_partitura: partitura.url_partitura,
    };
    console.log("Datos a enviar:", data);
    serviceComun
      .peticionSesion(
        "POST",
        constantes.URL_SERVICIO_MOVIL + "actualizar_partitura",
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

function obtenerPartituras(cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        constantes.URL_SERVICIO_MOVIL + "obtener_partituras",
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

function obtenerPartitura(nidPartitura, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        constantes.URL_SERVICIO_MOVIL + "obtener_partitura/" + nidPartitura,
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

module.exports.registrarPartitura = registrarPartitura;
module.exports.actualizarPartitura = actualizarPartitura;
module.exports.obtenerPartituras = obtenerPartituras;
module.exports.obtenerPartitura = obtenerPartitura;
