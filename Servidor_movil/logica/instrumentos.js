const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_base_datos = require("./base_datos.js");

async function existeInstumento(nid_instrumento) {
  try {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".instrumentos WHERE nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento);

    const result = await gestor_base_datos.consulta(sql);
    return result[0].existe > 0;
  } catch (error) {
    console.error("Error al verificar la existencia del instrumento:", error);
    throw new Error("Error al verificar la existencia del instrumento");
  }
}

async function insertarInstrumento(nid_instrumento, descripcion) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".instrumentos (nid_instrumento, descripcion) VALUES (" +
      conexion.dbConn.escape(nid_instrumento) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.error("Error al insertar el instrumento:", error);
    throw new Error("Error al insertar el instrumento");
  }
}

async function actualizarInstrumento(nid_instrumento, descripcion) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".instrumentos SET descripcion = " +
      conexion.dbConn.escape(descripcion) +
      " WHERE nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el instrumento:", error);
    throw new Error("Error al actualizar el instrumento");
  }
}

async function registrarInstrumento(nid_instrumento, descripcion) {
  try {
    const existe = await existeInstumento(nid_instrumento);
    if (existe) {
      return await actualizarInstrumento(nid_instrumento, descripcion);
    } else {
      return await insertarInstrumento(nid_instrumento, descripcion);
    }
  } catch (error) {
    console.error("Error al registrar el instrumento:", error);
    throw error;
  }
}

async function obtenerInstrumentos() {
  try {
    const sql =
      "select i.nid_instrumento, i.descripcion from " +
      constantes.ESQUEMA +
      ".instrumentos i group by i.nid_instrumento, i.descripcion";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los instrumentos:", error);
    throw new Error("Error al obtener los instrumentos");
  }
}

module.exports.registrarInstrumento = registrarInstrumento;

module.exports.obtenerInstrumentos = obtenerInstrumentos;
