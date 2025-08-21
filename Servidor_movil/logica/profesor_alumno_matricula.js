const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");
const gestorCurso = require("./curso");

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

function obtenerAlumnosProfesor(nid_profesor, nid_curso) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.*, ma.nid_asignatura FROM " +
      constantes.ESQUEMA +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".persona p " +
      " WHERE pam.nid_matricula_asignatura = ma.nid_matricula_asignatura " +
      " AND ma.nid_matricula = m.nid_matricula " +
      " AND m.nid_persona = p.nid_persona " +
      " and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " pam.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " and (ma.fecha_baja IS NULL OR ma.fecha_baja > NOW()) " +
      " and (pam.fecha_baja IS NULL OR pam.fecha_baja > NOW())";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener los alumnos del profesor:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function obtenerAlumnosProfesorCursoActual(nid_profesor) {
  try {
    const cursoActivo = await gestorCurso.obtenerCursoActivo();
    const alumnos = await obtenerAlumnosProfesor(
      nid_profesor,
      cursoActivo.nid_curso
    );
    return alumnos;
  } catch (error) {
    console.error(
      "Error al obtener los alumnos del profesor en el curso actual:",
      error
    );
    throw new Error(
      "Error al obtener los alumnos del profesor en el curso actual"
    );
  }
}

function obtenerProfesorAlumnoMatricula(nid_matricula_asignatura) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT pam.nid_profesor_alumno_matricula, pam.nid_profesor, pam.nid_matricula_asignatura, " +
      "pam.fecha_alta, pam.fecha_baja, pam.fecha_actualizacion, p.nombre AS nombre_profesor, " +
      "p.primer_apellido AS primer_apellido_profesor, p.segundo_apellido AS segundo_apellido_profesor " +
      "FROM " +
      constantes.ESQUEMA +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA +
      ".persona p " +
      "WHERE pam.nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      " AND pam.nid_profesor = p.nid_persona";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener el profesor-alumno-matricula:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function esAlumnoProfesor(nid_alumno, nid_profesor, nid_curso)
{
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA +
      ".matricula m " +
      "WHERE pam.nid_matricula_asignatura = ma.nid_matricula_asignatura " +
      " and ma.nid_matricula = m.nid_matricula " +
      " and m.nid_persona = " + conexion.dbConn.escape(nid_alumno) +
      " and pam.nid_profesor = " + conexion.dbConn.escape(nid_profesor) +
      " and m.nid_curso = " + conexion.dbConn.escape(nid_curso);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al comprobar si el alumno es profesor:", err);
        reject(err);
      } else {
        resolve(result[0].existe > 0);
      }
    });
  });
}

module.exports.registrarProfesorAlumnoMatricula =
  registrarProfesorAlumnoMatricula;
module.exports.obtenerAlumnosProfesorCursoActual =
  obtenerAlumnosProfesorCursoActual;
module.exports.obtenerProfesorAlumnoMatricula = obtenerProfesorAlumnoMatricula;
module.exports.esAlumnoProfesor = esAlumnoProfesor;
  