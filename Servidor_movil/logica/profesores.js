const conexion = require("../conexion");
const constantes = require("../constantes");

function insertarProfesor(nid_persona, nid_asignatura, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".profesor (nid_persona, nid_asignatura, fecha_actualizacion)" +
      "values(" +
      conexion.dbConn.escape(nid_persona) +
      "," +
      conexion.dbConn.escape(nid_asignatura) +
      "," +
      conexion.dbConn.escape(fecha_actualizacion) +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al insertar el profesor: " + error.message);
          conexion.dbConn.rollback();
          reject(new Error("Error al insertar el profesor"));
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}
function actualizarProfesor(nid_persona, nid_asignatura, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".profesor SET nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(fecha_actualizacion) +
      " WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al actualizar el profesor: " + error.message);
          conexion.dbConn.rollback();
          reject(new Error("Error al actualizar el profesor"));
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function existeProfesor(nid_persona, nid_asignatura) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".profesor WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.error("Error al verificar el profesor: " + error.message);
        reject(new Error("Error al verificar el profesor"));
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

async function registrarProfesor(
  nid_persona,
  nid_asignatura,
  fecha_actualizacion
) {
  try {
    const existe = await existeProfesor(nid_persona, nid_asignatura);
    if (existe) {
      return actualizarProfesor(
        nid_persona,
        nid_asignatura,
        fecha_actualizacion
      );
    } else {
      return insertarProfesor(nid_persona, nid_asignatura, fecha_actualizacion);
    }
  } catch (error) {
    console.error("Error al registrar el profesor: " + error.message);
    throw new Error("Error al registrar el profesor");
  }
}

function eliminarProfesor(nid_persona, nid_asignatura) {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM " +
      constantes.ESQUEMA +
      ".profesor WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al eliminar el profesor: " + error.message);
          conexion.dbConn.rollback();
          reject(new Error("Error al eliminar el profesor"));
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

module.exports.registrarProfesor = registrarProfesor;
module.exports.eliminarProfesor = eliminarProfesor;
