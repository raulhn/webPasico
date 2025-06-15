const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");

function insertarProfesor(
  nid_persona,
  nid_asignatura,
  esBaja,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".profesor (nid_persona, nid_asignatura, fecha_actualizacion, esBaja)" +
      "values(" +
      conexion.dbConn.escape(nid_persona) +
      "," +
      conexion.dbConn.escape(nid_asignatura) +
      "," +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      "," +
      conexion.dbConn.escape(esBaja) +
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
function actualizarProfesor(
  nid_persona,
  nid_asignatura,
  esBaja,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".profesor SET  fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", esBaja = " +
      conexion.dbConn.escape(esBaja) +
      " WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

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
  esBaja,
  fecha_actualizacion
) {
  try {
    const existe = await existeProfesor(nid_persona, nid_asignatura);
    if (existe) {
      return await actualizarProfesor(
        nid_persona,
        nid_asignatura,
        esBaja,
        fecha_actualizacion
      );
    } else {
      return await insertarProfesor(
        nid_persona,
        nid_asignatura,
        esBaja,
        fecha_actualizacion
      );
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

function obtenerProfesor(nid_persona) {
  {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM " +
        constantes.ESQUEMA +
        ".profesor WHERE nid_persona = " +
        conexion.dbConn.escape(nid_persona);

      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al obtener el profesor: " + error.message);
          reject(new Error("Error al obtener el profesor"));
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports.registrarProfesor = registrarProfesor;
module.exports.eliminarProfesor = eliminarProfesor;
module.exports.obtenerProfesor = obtenerProfesor;
