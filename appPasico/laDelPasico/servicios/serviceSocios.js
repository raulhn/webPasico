const serviceComun = require("./serviceComun.js");
const Constantes = require("../config/constantes.js");

async function obtenerSocio(cerrarSesion) {
  try {
    const data = await serviceComun.peticionSesion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_socio",
      null,
      cerrarSesion
    );
    return data;
  } catch (error) {
    throw new Error("Error en el servicio obtenerSocio");
  }
}

module.exports.obtenerSocio = obtenerSocio;
