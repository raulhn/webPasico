const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");

function insertarEvaluacion(
  nid_evaluacion,
  nid_trimestre,
  nid_asignatura,
  nid_profesor,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".evaluacion (nid_evaluacion, nid_trimestre, nid_asignatura, nid_profesor, fecha_actualizacion, sucio) VALUES (" +
      conexion.dbConn.escape(nid_evaluacion) +
      ", " +
      conexion.dbConn.escape(nid_trimestre) +
      ", " +
      conexion.dbConn.escape(nid_asignatura) +
      ", " +
      conexion.dbConn.escape(nid_profesor) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", 'N' " +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al insertar la evaluación:", err);
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

function actualizarEvaluacion(
  nid_evaluacion,
  nid_trimestre,
  nid_asignatura,
  nid_profesor,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evaluacion SET nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre) +
      ", nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      ", nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", sucio = 'N'" +
      " WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al actualizar la evaluación:", err);
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

function existeEvaluacion(nid_evaluacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".evaluacion WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "Error al verificar la existencia de la evaluación:",
          error
        );
        return reject(error);
      }
      resolve(results[0].count > 0);
    });
  });
}

function requiereActualizarEvaluacion(nid_evaluacion, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS requiere FROM " +
      constantes.ESQUEMA +
      ".evaluacion WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion) +
      " AND fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al verificar si requiere actualización:", error);
        return reject(error);
      }
      resolve(results[0].requiere > 0);
    });
  });
}

async function registrarEvaluacion(
  nid_evaluacion,
  nid_trimestre,
  nid_asignatura,
  nid_profesor,
  fecha_actualizacion
) {
  try {
    const existe = await existeEvaluacion(nid_evaluacion);
    if (existe) {
      const requiereActualizar = await requiereActualizarEvaluacion(
        nid_evaluacion,
        fecha_actualizacion
      );
      if (requiereActualizar) {
        return await actualizarEvaluacion(
          nid_evaluacion,
          nid_trimestre,
          nid_asignatura,
          nid_profesor,
          fecha_actualizacion
        );
      } else {
        return "No se requiere actualización";
      }
    } else {
      return await insertarEvaluacion(
        nid_evaluacion,
        nid_trimestre,
        nid_asignatura,
        nid_profesor,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar la evaluación:", error);
    throw error;
  }
}

function obtenerEvaluacionesSucias() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " + constantes.ESQUEMA + ".evaluacion WHERE sucio = 'S'";

    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.error("Error al obtener las evaluaciones sucias:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports.registrarEvaluacion = registrarEvaluacion;
module.exports.obtenerEvaluacionesSucias = obtenerEvaluacionesSucias;
