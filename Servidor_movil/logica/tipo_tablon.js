const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("./base_datos.js");

async function insertarTipoTablon(descripcion) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".tipo_tablon(descripcion) values(" +
      conexion.dbConn.escape(descripcion) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("tipo_tablon.js -> insertarTipoTablon: " + error);
    throw new Error("Se ha producido un error al insertar el tipo de tablon");
  }
}

async function actualizarTipoTablon(nidTipoTablon, descripcion) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".tipo_tablon set descripcion = " +
      conexion.dbConn.escape(descripcion) +
      " where nid_tipo_tablon = " +
      conexion.dbConn.escape(nidTipoTablon);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("tipo_tablon.js -> actualizarTipoTablon: " + error);
    throw new Error("Se ha producido un error al actualizar el tipo de tablón");
  }
}

async function obtenerTipoTablon(nidTipoTablon) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".tipo_tablon where nid_tipo_tablon " +
      conexion.dbConn.escape(nidTipoTablon);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length == 0) {
      console.log("No se ha encontrado el tipo de tablón");
      throw new Error("No se ha encontrado el tipo de tablón");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("tipo_tablon.js -> obtenerTipoTablon: ", error);
    throw new Error("Se ha producido un error al recuperar el tipo de tablón");
  }
}

async function obtenerTiposTablon() {
  try {
    const sql = "select * from " + constantes.ESQUEMA + ".tipo_tablon";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("tipo_tablon.js -> obtenerTiposTablon: ", error);
    throw new Error(
      "Se ha producido un error al recuperar los tipos de tablon",
    );
  }
}

module.exports.insertarTipoTablon = insertarTipoTablon;
module.exports.actualizarTipoTablon = actualizarTipoTablon;
module.exports.obtenerTipoTablon = obtenerTipoTablon;
module.exports.obtenerTiposTablon = obtenerTiposTablon;
