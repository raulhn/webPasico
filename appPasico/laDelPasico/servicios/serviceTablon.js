const serviceComun = require("./serviceComun.js");
const Constantes = require("../config/constantes.js");

async function obtenerAnuncios(cerrarSesion, usuario) {
  try {
    if (usuario) {
      console.log("Usuario autenticado, obteniendo anuncios...", usuario);
      const data = await serviceComun.peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_tablon_anuncios",
        null,
        cerrarSesion
      );
      return data;
    } else {
      const data = await serviceComun.peticionServicio(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_tablon_anuncios",
        null
      );

      return data;
    }
  } catch (error) {
    throw new Error("Error en el servicio obtenerAnuncios");
  }
}

async function obtenerAnuncio(nidAnuncio, cerrarSesion) {
  try {
    const data = serviceComun.peticionSesion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_anuncio/" + nidAnuncio,
      cerrarSesion
    );
  } catch (error) {
    throw new Error("Error en el servicio obtenerAnuncio");
  }
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

async function actualizarTablonAnuncio(anuncio, cerrarSesion) {
  try {
    const data = await serviceComun.peticionSesion(
      "POST",
      Constantes.URL_SERVICIO_MOVIL + "actualizar_tablon_anuncio",
      anuncio,
      cerrarSesion
    );

    return data;
  } catch (error) {
    throw new Error("Error en el servicio actualizarTablonAnuncio");
  }
}

module.exports.obtenerAnuncios = obtenerAnuncios;
module.exports.obtenerAnuncio = obtenerAnuncio;
module.exports.registrarTablonAnuncio = registrarTablonAnuncio;
module.exports.actualizarTablonAnuncio = actualizarTablonAnuncio;
