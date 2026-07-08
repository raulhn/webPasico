const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");
const gestorCurso = require("./curso");
const gestor_base_datos = require("./base_datos");

async function existeProfesorAlumnoMatricula(nid_profesor_alumno_matricula) {
  try {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".profesor_alumno_matricula WHERE nid_profesor_alumno_matricula =" +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    const results = await gestor_base_datos.consulta(sql);
    return results[0].existe > 0;
  } catch (error) {
    console.error(
      "Error al verificar la existencia del profesor-alumno-matricula:",
      error,
    );
    throw new Error(
      "Error al verificar la existencia del profesor-alumno-matricula",
    );
  }
}

async function insertarProfesorAlumnoMatricula(
  nid_profesor_alumno_matricula,
  nid_profesor,
  nid_matricula_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion,
) {
  try {
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

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al insertar el profesor-alumno-matricula:", error);
    throw new Error("Error al insertar el profesor-alumno-matricula");
  }
}

async function actualizarProfesorAlumnoMatricula(
  nid_profesor_alumno_matricula,
  nid_profesor,
  nid_matricula_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion,
) {
  try {
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

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al actualizar el profesor-alumno-matricula:", error);
    throw new Error("Error al actualizar el profesor-alumno-matricula");
  }
}

async function registrarProfesorAlumnoMatricula(
  nid_profesor_alumno_matricula,
  nid_profesor,
  nid_matricula_asignatura,
  fecha_alta,
  fecha_baja,
  fecha_actualizacion,
) {
  try {
    const existe = await existeProfesorAlumnoMatricula(
      nid_profesor_alumno_matricula,
    );
    if (existe) {
      await actualizarProfesorAlumnoMatricula(
        nid_profesor_alumno_matricula,
        nid_profesor,
        nid_matricula_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion,
      );
    } else {
      await insertarProfesorAlumnoMatricula(
        nid_profesor_alumno_matricula,
        nid_profesor,
        nid_matricula_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al registrar el profesor-alumno-matricula:", error);
    throw error;
  }
}

async function obtenerAlumnosProfesor(nid_profesor, nid_curso) {
  try {
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

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener los alumnos del profesor:", error);
    throw new Error("Error al obtener los alumnos del profesor");
  }
}

async function obtenerAlumnosProfesorCursoActual(nid_profesor) {
  try {
    const cursoActivo = await gestorCurso.obtenerCursoActivo();
    const alumnos = await obtenerAlumnosProfesor(
      nid_profesor,
      cursoActivo.nid_curso,
    );
    return alumnos;
  } catch (error) {
    console.error(
      "Error al obtener los alumnos del profesor en el curso actual:",
      error,
    );
    throw new Error(
      "Error al obtener los alumnos del profesor en el curso actual",
    );
  }
}

async function obtenerProfesorAlumnoMatricula(nid_matricula_asignatura) {
  try {
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

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener el profesor-alumno-matricula:", error);
    throw new Error("Error al obtener el profesor-alumno-matricula");
  }
}

async function esAlumnoProfesor(nid_alumno, nid_profesor, nid_curso) {
  try {
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
      " and m.nid_persona = " +
      conexion.dbConn.escape(nid_alumno) +
      " and pam.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso);

    const result = await gestor_base_datos.consulta(sql);
    return result[0].existe > 0;
  } catch (error) {
    console.error("Error al comprobar si el alumno es profesor:", error);
    throw new Error("Error al comprobar si el alumno es profesor");
  }
}

module.exports.registrarProfesorAlumnoMatricula =
  registrarProfesorAlumnoMatricula;
module.exports.obtenerAlumnosProfesorCursoActual =
  obtenerAlumnosProfesorCursoActual;
module.exports.obtenerProfesorAlumnoMatricula = obtenerProfesorAlumnoMatricula;
module.exports.esAlumnoProfesor = esAlumnoProfesor;

