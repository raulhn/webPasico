const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

async function obtenerTiposMusico(cerrarSesion) {
  try {
    const data = await serviceComun.peticionSesion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_tipos_musico",
      null,
      cerrarSesion
    );
    return data;
  } catch (error) {
    throw new Error("Error en el servicio obtenerSocio");
  }
}

module.exports.obtenerTiposMusico = obtenerTiposMusico;
