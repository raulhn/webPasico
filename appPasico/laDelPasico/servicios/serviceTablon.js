const serviceComun = require("./serviceComun.js");
const Constantes = require("../config/constantes.js");

async function obtenerAnuncios() {
  return new Promise((resolve, reject) => {
    try {
      fetch(Constantes.URL_SERVICIO_MOVIL + "obtener_tablon_anuncios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (error) {
      throw new Error("Error en el servicio obtenerAnuncios");
    }
  });
}

async function obtenerAnuncio(nidAnuncio) {
  return new Promise((resolve, reject) => {
    try {
      fetch(Constantes.URL_SERVICIO_MOVIL + "obtener_anuncio/" + nidAnuncio, {
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
    } catch (error) {
      throw new Error("Error en el servicio obtenerAnuncio");
    }
  });
}

async function registrarTablonAnuncio(anuncio, cerrarSesion) {
  try {
    const data = await serviceComun.peticionSesion(
      "POST",
      Constantes.URL_SERVICIO_MOVIL + "registrar_tablon_anuncio",
      anuncio,
      cerrarSesion
    );

    return data;
  } catch (error) {
    throw new Error("Error en el servicio registrarTablonAnuncio");
  }
}

module.exports.obtenerAnuncios = obtenerAnuncios;
module.exports.obtenerAnuncio = obtenerAnuncio;
module.exports.registrarTablonAnuncio = registrarTablonAnuncio;
