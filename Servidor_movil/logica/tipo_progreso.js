const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");

function requiereActualizarTipoProgreso(
  nid_tipo_progreso,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".tipo_progreso WHERE nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso) +
      " AND (fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " or fecha_actualizacion is null)";

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "Error al verificar si se requiere actualizar la persona:",
          error
        );
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
}

function insertarTipoProgreso(
  nid_tipo_progreso,
  descripcion,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al insertar el tipo de progreso:", err);
          conexion.dbConn.rollback();
          reject(err);
        } else {
          conexion.dbConn.commit();
          resolve(result.insertId);
        }
      });
    });
  });
}

function actualizarTipoProgreso(
  nid_tipo_progreso,
  descripcion,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al actualizar el tipo de progreso:", err);
          conexion.dbConn.rollback();
          reject(err);
        } else {
          conexion.dbConn.commit();
          resolve(result.affectedRows);
        }
      });
    });
  });
}

function existeTipoProgreso(nid_tipo_progreso) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".tipo_progreso WHERE nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error(
          "Error al verificar la existencia del tipo de progreso:",
          err
        );
        reject(err);
      } else {
        resolve(result[0].count > 0);
      }
    });
  });
}

async function registrarTipoProgreso(
  nid_tipo_progreso,
  descripcion,
  fecha_actualizacion
) {
  try {
    const existe = await existeTipoProgreso(nid_tipo_progreso);
    if (existe) {
      const requiereActualizar = await requiereActualizarTipoProgreso(
        nid_tipo_progreso,
        fecha_actualizacion
      );
      if (!requiereActualizar) {
        console.log("No se requiere actualizar el tipo de progreso.");
        return null;
      }
      return await actualizarTipoProgreso(
        nid_tipo_progreso,
        descripcion,
        fecha_actualizacion
      );
    } else {
      return await insertarTipoProgreso(
        nid_tipo_progreso,
        descripcion,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar el tipo de progreso: ", error);
    throw error;
  }
}

function obtenerTipoProgresoSucios() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".tipo_progreso WHERE sucio = 'S'";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener los tipos de progreso sucios:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports.registrarTipoProgreso = registrarTipoProgreso;
module.exports.obtenerTipoProgresoSucios = obtenerTipoProgresoSucios;
