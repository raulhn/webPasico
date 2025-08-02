const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

async function obtenerAnuncios() {
  try {
    const data = await serviceComun.peticion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_anuncios",
      null
    );
    return data;
  } catch (error) {
    throw new Error("Error en el servicio obtenerAnuncios");
  }
}

async function obtenerAnuncio(nidAnuncio) {
  try {
    const data = await serviceComun.peticion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_anuncio/" + nidAnuncio,
      null
    );
    return data;
  } catch (error) {
    throw new Error("Error en el servicio obtenerAnuncio");
  }
}

async function registrarTablonAnuncio(anuncio, cerrarSesion) {
  try {
    const data = await serviceComun.peticion(
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
