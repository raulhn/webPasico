const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");
const gestor_base_datos = require("./base_datos.js");

async function insertarTrimestre(
  nid_trimestre,
  descripcion,
  fecha_actualizacion,
) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".trimestre (nid_trimestre, descripcion, fecha_actualizacion, sucio) VALUES (" +
      conexion.dbConn.escape(nid_trimestre) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", 'N' " +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.error("Error al insertar el trimestre:", error);
    throw new Error("Error al insertar el trimestre");
  }
}

async function actualizarTrimestre(
  nid_trimestre,
  descripcion,
  fecha_actualizacion,
) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".trimestre SET descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", sucio = 'N'" +
      " WHERE nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el trimestre:", error);
    throw new Error("Error al actualizar el trimestre");
  }
}

async function existeTrimestre(nid_trimestre) {
  try {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".trimestre WHERE nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre);

    const results = await gestor_base_datos.consulta(sql);
    return results[0].count > 0;
  } catch (error) {
    console.error("Error al verificar la existencia del trimestre:", error);
    throw new Error("Error al verificar la existencia del trimestre");
  }
}

async function requiereActualizarTrimestre(nid_trimestre, fecha_actualizacion) {
  try {
    const sql =
      "SELECT COUNT(*) AS requiere FROM " +
      constantes.ESQUEMA +
      ".trimestre WHERE nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre) +
      " AND fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));

    const result = await gestor_base_datos.consulta(sql);
    return result[0].requiere > 0;
  } catch (error) {
    console.log("Error al verificar si requiere actualización:", error);
    throw new Error("Error al verificar si requiere actualización");
  }
}

async function registrarTrimestre(
  nid_trimestre,
  descripcion,
  fecha_actualizacion,
) {
  const existe = await existeTrimestre(nid_trimestre);

  if (existe) {
    const requiereActualizar = await requiereActualizarTrimestre(nid_trimestre);
    if (!requiereActualizar) {
      console.log("No se requiere actualización del trimestre.");
      return;
    }
    return actualizarTrimestre(nid_trimestre, descripcion, fecha_actualizacion);
  } else {
    return insertarTrimestre(nid_trimestre, descripcion, fecha_actualizacion);
  }
}

async function obtenerTrimestresSucios() {
  try {
    const sql =
      "SELECT * FROM " + constantes.ESQUEMA + ".trimestre WHERE sucio = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los trimestres sucios:", error);
    throw new Error("Error al obtener los trimestres sucios");
  }
}

async function obtenerTrimestres() {
  try {
    const sql = "SELECT * FROM " + constantes.ESQUEMA + ".trimestre";
    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      throw new Error("No hay trimestres registrados");
    }
    return results;
  } catch (error) {
    console.error("Error al obtener los trimestres: " + error.message);
    throw new Error("Error al obtener los trimestres");
  }
}

module.exports.registrarTrimestre = registrarTrimestre;
module.exports.obtenerTrimestresSucios = obtenerTrimestresSucios;
module.exports.obtenerTrimestres = obtenerTrimestres;
