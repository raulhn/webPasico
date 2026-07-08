const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");
const gestor_base_datos = require("./base_datos.js");

async function requiereActualizarTipoProgreso(
  nid_tipo_progreso,
  fecha_actualizacion,
) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".tipo_progreso WHERE nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso) +
      " AND (fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " or fecha_actualizacion is null)";

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error(
      "Error al verificar si se requiere actualizar el tipo de progreso:",
      error,
    );
    throw new Error(
      "Error al verificar si se requiere actualizar el tipo de progreso",
    );
  }
}

async function insertarTipoProgreso(
  nid_tipo_progreso,
  descripcion,
  fecha_actualizacion,
) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".tipo_progreso (nid_tipo_progreso, descripcion, fecha_actualizacion, sucio) VALUES (" +
      conexion.dbConn.escape(nid_tipo_progreso) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", 'N' " +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.error("Error al insertar el tipo de progreso:", error);
    throw new Error("Error al insertar el tipo de progreso");
  }
}

async function actualizarTipoProgreso(
  nid_tipo_progreso,
  descripcion,
  fecha_actualizacion,
) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".tipo_progreso SET descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", sucio = 'N'" +
      " WHERE nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el tipo de progreso:", error);
    throw new Error("Error al actualizar el tipo de progreso");
  }
}

async function existeTipoProgreso(nid_tipo_progreso) {
  try {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".tipo_progreso WHERE nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso);

    const results = await gestor_base_datos.consulta(sql);
    return results[0].count > 0;
  } catch (error) {
    console.error(
      "Error al verificar la existencia del tipo de progreso:",
      error,
    );
    throw new Error("Error al verificar la existencia del tipo de progreso");
  }
}

async function registrarTipoProgreso(
  nid_tipo_progreso,
  descripcion,
  fecha_actualizacion,
) {
  try {
    const existe = await existeTipoProgreso(nid_tipo_progreso);
    if (existe) {
      const requiereActualizar = await requiereActualizarTipoProgreso(
        nid_tipo_progreso,
        fecha_actualizacion,
      );
      if (!requiereActualizar) {
        console.log("No se requiere actualizar el tipo de progreso.");
        return null;
      }
      await actualizarTipoProgreso(
        nid_tipo_progreso,
        descripcion,
        fecha_actualizacion,
      );
    } else {
      await insertarTipoProgreso(
        nid_tipo_progreso,
        descripcion,
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al registrar el tipo de progreso: ", error);
    throw error;
  }
}

async function obtenerTipoProgresoSucios() {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".tipo_progreso WHERE sucio = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los tipos de progreso sucios: ", error);
    throw new Error("Error al obtener los tipos de progreso sucios");
  }
}

module.exports.registrarTipoProgreso = registrarTipoProgreso;
module.exports.obtenerTipoProgresoSucios = obtenerTipoProgresoSucios;
