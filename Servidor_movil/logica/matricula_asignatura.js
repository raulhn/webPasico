const constantes = require("../constantes");
const conexion = require("../conexion");
const gestorCurso = require("./curso");

function formatDateToMySQL(date) {
  try {
    if (date === null || date === undefined) {
      return null;
    }
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
  console.log(
    "Actualizar matricula asignatura: ",
    fecha_baja,
    formatDateToMySQL(fecha_baja)
  );
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
      ".matricula_asignatura ma " +
      "WHERE p.nid_persona = m.nid_persona " +
      "AND m.nid_matricula = ma.nid_matricula " +
      "AND m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " AND (ma.fecha_baja IS NULL OR ma.fecha_baja > NOW()) ";

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
    const alumnos = await obtenerAlumnosActivos(cursoActivo.nid_curso);
    return alumnos;
  } catch (error) {
    console.error("Error al obtener los alumnos del curso activo:", error);
    throw new Error("Error al obtener los alumnos del curso activo");
  }
}

async function obtenerAlumnosCursoActivoAsignatura(nid_asignatura) {
  try {
    const cursoActivo = await gestorCurso.obtenerCursoActivo();
    const alumnos = await obtenerAlumnosActivos(cursoActivo.nid_curso);
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

function obtenerMatriculasAsignatura(nid_matricula) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT ma.nid_matricula_asignatura, ma.nid_matricula, ma.nid_asignatura, " +
      "ma.fecha_alta, ma.fecha_baja, ma.fecha_actualizacion, a.descripcion AS asignatura, " +
      " p.nombre AS nombre_profesor, " +
      " p.primer_apellido AS primer_apellido_profesor, " +
      " p.segundo_apellido AS segundo_apellido_profesor " +
      "FROM " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA +
      ".asignaturas a, " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".matricula m " +
      "WHERE ma.nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      " AND ma.nid_asignatura = a.nid_asignatura " +
      " AND ma.nid_matricula = m.nid_matricula " +
      " AND m.nid_persona = p.nid_persona ";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener las matriculas de asignaturas:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function esAlumnoAsignatura(nid_persona, nid_asignatura, nid_curso) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma " +
      "WHERE m.nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " AND m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " AND m.nid_matricula = ma.nid_matricula " +
      " AND (ma.fecha_baja IS NULL OR ma.fecha_baja > NOW())";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al verificar si es alumno de la asignatura:", err);
        reject(err);
      } else {
        resolve(result[0].existe > 0);
      }
    });
  });
}

function obtenerAlumnosAsignatura(nid_asignatura, nid_curso) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT a.nid_persona, a.nombre, a.primer_apellido, a.segundo_apellido " +
      "FROM " +
      constantes.ESQUEMA +
      ".asignaturas a, " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma " +
      "WHERE ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " AND ma.nid_matricula = m.nid_matricula " +
      " AND m.nid_persona = a.nid_persona " +
      " AND m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " AND (m.fecha_baja IS NULL OR m.fecha_baja > NOW())";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener los alumnos de la asignatura:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports.registrarMatriculaAsignatura = registrarMatriculaAsignatura;
module.exports.obtenerAlumnosCursoActivo = obtenerAlumnosCursoActivo;
module.exports.obtenerAlumnosCursoActivoAsignatura =
  obtenerAlumnosCursoActivoAsignatura;
module.exports.esAlumnoAsignatura = esAlumnoAsignatura;
module.exports.obtenerMatriculasAsignatura = obtenerMatriculasAsignatura;
module.exports.obtenerAlumnosAsignatura = obtenerAlumnosAsignatura;
