const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");

function insertarTrimestre(nid_trimestre, descripcion, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al insertar el trimestre:", err);
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

function actualizarTrimestre(nid_trimestre, descripcion, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al actualizar el trimestre:", err);
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

function existeTrimestre(nid_trimestre) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".trimestre WHERE nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al verificar la existencia del trimestre:", err);
        reject(err);
      } else {
        resolve(result[0].count > 0);
      }
    });
  });
}

function requiereActualizarTrimestre(nid_trimestre, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS requiere FROM " +
      constantes.ESQUEMA +
      ".trimestre WHERE nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre) +
      " AND fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al verificar si requiere actualización:", err);
        reject(err);
      } else {
        resolve(result[0].requiere > 0);
      }
    });
  });
}

async function registrarTrimestre(
  nid_trimestre,
  descripcion,
  fecha_actualizacion
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

function obtenerTrimestresSucios() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " + constantes.ESQUEMA + ".trimestre WHERE sucio = 'S'";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener los trimestres sucios:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function obtenerTrimestres() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM " + constantes.ESQUEMA + ".trimestre";

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.error("Error al obtener los trimestres: " + error.message);
        reject(new Error("Error al obtener los trimestres"));
      } else {
        if (result.length === 0) {
          reject(new Error("No hay trimestres registrados"));
        } else {
          resolve(result);
        }
      }
    });
  });
}

module.exports.registrarTrimestre = registrarTrimestre;
module.exports.obtenerTrimestresSucios = obtenerTrimestresSucios;
module.exports.obtenerTrimestres = obtenerTrimestres;
