const constantes = require("../constantes");
const conexion = require("../conexion");
const gestorCurso = require("./curso");

function formatDateToMySQL(date) {
  try {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    return null;
  }
}

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
      conexion.dbConn.escape(formatDateToMySQL(fecha_alta)) +
      ", " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_baja)) +
      ", " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
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
      conexion.dbConn.escape(formatDateToMySQL(fecha_alta)) +
      ", fecha_baja = " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_baja)) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
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

function obtenerAlumnosActivos(nid_curso) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.*, ma.nid_asignatura FROM " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA +
      "WHERE p.nid_persona = m.nid_persona " +
      "AND m.nid_matricula = ma.nid_matricula " +
      "AND m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      "AND (ma.fecha_baja IS NULL OR ma.fecha_baja > NOW()) ";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener los alumnos activos:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function obtenerAlumnosCursoActivo() {
  try {
    const cursoActivo = await gestorCurso.obtenerCursoActivo();
    const alumnos = await obtenerAlumnosActivos(cursoActivo[0].nid_curso);
    return alumnos;
  } catch (error) {
    console.error("Error al obtener los alumnos del curso activo:", error);
    throw new Error("Error al obtener los alumnos del curso activo");
  }
}

async function obtenerAlumnosCursoActivoAsignatura(nid_asignatura) {
  try {
    const cursoActivo = await gestorCurso.obtenerCursoActivo();
    const alumnos = await obtenerAlumnosActivos(cursoActivo[0].nid_curso);
    return alumnos.filter((alumno) => alumno.nid_asignatura === nid_asignatura);
  } catch (error) {
    console.error(
      "Error al obtener los alumnos del curso activo por asignatura:",
      error
    );
    throw new Error(
      "Error al obtener los alumnos del curso activo por asignatura"
    );
  }
}

module.exports.registrarMatriculaAsignatura = registrarMatriculaAsignatura;
module.exports.obtenerAlumnosCursoActivo = obtenerAlumnosCursoActivo;
module.exports.obtenerAlumnosCursoActivoAsignatura =
  obtenerAlumnosCursoActivoAsignatura;
