const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_base_datos = require("./base_datos.js");

async function insertarTipoMusico(descripcion) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".tipo_musico (descripcion) VALUES (" +
      conexion.dbConn.escape(descripcion) +
      ")";

    const result = await gestor_base_datos.actualiza(sql);
    return result.insertId;
  } catch (error) {
    console.error("Error al insertar el tipo de músico:", error);
    throw new Error("Error al insertar el tipo de músico");
  }
}

async function actualizarTipoMusico(nid_tipo_musico, descripcion) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".tipo_musico SET descripcion = " +
      conexion.dbConn.escape(descripcion) +
      " WHERE nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico);

    const result = await gestor_base_datos.actualiza(sql);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el tipo de músico:", error);
    throw new Error("Error al actualizar el tipo de músico");
  }
}

async function existeTipoMusico(nid_tipo_musico) {
  try {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".tipo_musico WHERE nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico);

    const result = await gestor_base_datos.consulta(sql);
    return result[0].count > 0;
  } catch (error) {
    console.error(
      "Error al verificar la existencia del tipo de músico:",
      error,
    );
    throw new Error("Error al verificar la existencia del tipo de músico");
  }
}

async function registrarTipoMusico(nid_tipo_musico, descripcion) {
  try {
    const existe = await existeTipoMusico(nid_tipo_musico);
    if (existe) {
      return await actualizarTipoMusico(nid_tipo_musico, descripcion);
    } else {
      return await insertarTipoMusico(descripcion);
    }
  } catch (error) {
    console.error("Error al registrar el tipo de músico:", error);
    throw error;
  }
}

async function obtenerTiposMusico() {
  try {
    const sql =
      "SELECT nid_tipo_musico, descripcion FROM " +
      constantes.ESQUEMA +
      ".tipo_musico";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los tipos de músico:", error);
    throw new Error("Error al obtener los tipos de músico");
  }
}

module.exports.registrarTipoMusico = registrarTipoMusico;
module.exports.obtenerTiposMusico = obtenerTiposMusico;
