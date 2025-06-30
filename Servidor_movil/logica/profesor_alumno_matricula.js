const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");

function existeProfesorAlumnoMatricula(nid_profesor_alumno_matricula) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".profesor_alumno_matricula WHERE nid_profesor_alumno_matricula =" +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error(
          "Error al verificar la existencia del profesor-alumno-matricula:",
          err
        );
        reject(err);
      } else {
        resolve(result[0].existe > 0);
      }
    });
  });
}

function insertarProfesorAlumnoMatricula(
  nid_profesor_alumno_matricula,
  nid_profesor,
  nid_matricula_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".profesor_alumno_matricula (nid_profesor_alumno_matricula, nid_profesor,  " +
      "nid_matricula_asignatura, fecha_alta, fecha_baja, fecha_actualizacion) VALUES (" +
      conexion.dbConn.escape(nid_profesor_alumno_matricula) +
      ", " +
      conexion.dbConn.escape(nid_profesor) +
      ", " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_alta)) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_baja)) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al insertar el profesor-alumno-matricula:", err);
          conexion.dbConn.rollback();
          reject("Error al insertar el profesor-alumno-matricula");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function actualizarProfesorAlumnoMatricula(
  nid_profesor_alumno_matricula,
  nid_profesor,
  nid_matricula_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".profesor_alumno_matricula SET nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      ", nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", fecha_alta = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_alta)) +
      ", fecha_baja = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_baja)) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " WHERE nid_profesor_alumno_matricula = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error(
            "Error al actualizar el profesor-alumno-matricula:",
            err
          );
          conexion.dbConn.rollback();
          reject("Error al actualizar el profesor-alumno-matricula");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

async function registrarProfesorAlumnoMatricula(
  nid_profesor_alumno_matricula,
  nid_profesor,
  nid_matricula_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion
) {
  try {
    const existe = await existeProfesorAlumnoMatricula(
      nid_profesor_alumno_matricula
    );
    if (existe) {
      await actualizarProfesorAlumnoMatricula(
        nid_profesor_alumno_matricula,
        nid_profesor,
        nid_matricula_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );
    } else {
      await insertarProfesorAlumnoMatricula(
        nid_profesor_alumno_matricula,
        nid_profesor,
        nid_matricula_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar el profesor-alumno-matricula:", error);
    throw error;
  }
}

function obtenerAlumnosProfesor() {}

module.exports.registrarProfesorAlumnoMatricula =
  registrarProfesorAlumnoMatricula;
