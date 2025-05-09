const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

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
    console.log("Error en el servicio obtenerSocio");
    throw new Error("Error en el servicio obtenerSocio");
  }
}

module.exports.obtenerSocio = obtenerSocio;
