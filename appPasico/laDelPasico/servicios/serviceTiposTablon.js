const serviceComun = require("./serviceComun.js");
const Constantes = require("../constantes.js");

async function obtenerTiposTablon(cerrarSesion) {
  try {
    const data = await serviceComun.peticionSesion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_tipos_tablon",
      null,
      cerrarSesion
    );
    return data;
  } catch (error) {
    throw new Error("Error en el servicio obtenerTiposTablon");
  }
}

async function obtenerTipoTablon(nidTipoTablon, cerrarSesion) {
  try {
    const data = await serviceComun.peticionSesion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_tipo_tablon/" + nidTipoTablon,
      null,
      cerrarSesion
    );
    return data;
  } catch (error) {
    throw new Error("Error en el servicio obtenerTipoTablon");
  }
}

module.exports.obtenerTiposTablon = obtenerTiposTablon;
module.exports.obtenerTipoTablon = obtenerTipoTablon;
