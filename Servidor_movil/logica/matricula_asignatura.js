const constantes = require("../constantes");
const conexion = require("../conexion");

function existeMatriculaAsignatura(nid_matricula_asignatura) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".matricula_asignatura WHERE nid_matricula_asignatura =" +
      conexion.dbConn.escape(nid_matricula_asignatura);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al verificar la existencia de la matricula:", err);
        reject(err);
      } else {
        resolve(result[0].existe > 0);
      }
    });
  });
}

function insertarMatriculaAsignatura(
  nid_matricula_asignatura,
  nid_matricula,
  nid_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".matricula_asignatura (nid_matricula_asignatura, nid_matricula, nid_asignatura, " +
      "fecha_alta, fecha_baja, fecha_actualizacion) VALUES (" +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", " +
      conexion.dbConn.escape(nid_matricula) +
      ", " +
      conexion.dbConn.escape(nid_asignatura) +
      ", " +
      conexion.dbConn.escape(fecha_alta) +
      ", " +
      conexion.dbConn.escape(fecha_baja) +
      ", " +
      conexion.dbConn.escape(fecha_actualizacion) +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al insertar la matricula:", err);
          conexion.dbConn.rollback();
          reject("Error al insertar la matricula");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function actualizarMatriculaAsignatura(
  nid_matricula_asignatura,
  nid_matricula,
  nid_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".matricula_asignatura SET nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      ", nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      ", fecha_alta = " +
      conexion.dbConn.escape(fecha_alta) +
      ", fecha_baja = " +
      conexion.dbConn.escape(fecha_baja) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(fecha_actualizacion) +
      " WHERE nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura);
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al actualizar la matricula:", err);
          conexion.dbConn.rollback();
          reject("Error al actualizar la matricula");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

async function registrarMatriculaAsignatura(
  nid_matricula_asignatura,
  nid_matricula,
  nid_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion
) {
  try {
    const existe = await existeMatriculaAsignatura(nid_matricula_asignatura);
    if (existe) {
      return await actualizarMatriculaAsignatura(
        nid_matricula_asignatura,
        nid_matricula,
        nid_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );
    } else {
      return await insertarMatriculaAsignatura(
        nid_matricula_asignatura,
        nid_matricula,
        nid_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar la matricula:", error);
    throw error;
  }
}

module.exports.registrarMatriculaAsignatura = registrarMatriculaAsignatura;
