const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos");

function formatDateToMySQL(date) {
  try {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    return null;
  }
}

async function insertarCurso(nid_curso, descripcion, ano, fecha_actualizacion) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".curso (nid_curso, descripcion, ano, fecha_actualizacion)" +
      "values(" +
      conexion.dbConn.escape(nid_curso) +
      "," +
      conexion.dbConn.escape(descripcion) +
      "," +
      conexion.dbConn.escape(ano) +
      "," +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
      ")";

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al insertar el curso: ", error);
    throw new Error("Error al insertar el curso");
  }
}

async function actualizarCurso(
  nid_curso,
  descripcion,
  ano,
  fecha_actualizacion,
) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".curso SET descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", ano = " +
      conexion.dbConn.escape(ano) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
      " WHERE nid_curso = " +
      conexion.dbConn.escape(nid_curso);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al actualizar el curso: ", error);
    throw new Error("Error al actualizar el curso");
  }
}

async function existeCurso(nid_curso) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".curso WHERE nid_curso = " +
      conexion.dbConn.escape(nid_curso);

    const result = await gestor_base_datos.consulta(sql);
    return result.length > 0;
  } catch (error) {
    console.error("Error al comprobar el curso: ", error);
    throw new Error("Error al comprobar el curso");
  }
}

async function registrarCurso(
  nid_curso,
  descripcion,
  ano,
  fecha_actualizacion,
) {
  try {
    const existeCurso = await existeCurso(nid_curso);
    if (existeCurso) {
      return actualizarCurso(nid_curso, descripcion, ano, fecha_actualizacion);
    } else {
      return insertarCurso(nid_curso, descripcion, ano, fecha_actualizacion);
    }
  } catch (error) {
    console.error("Error al registrar el curso: ", error);
    throw new Error("Error al registrar el curso");
  }
}

async function obtenerCursoActivo() {
  try {
    const sql =
      "SELECT * FROM " + constantes.ESQUEMA + ".curso WHERE activo = 'S'";

    const result = await gestor_base_datos.consulta(sql);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error al obtener el curso activo: ", error);
    throw new Error("Error al obtener el curso activo");
  }
}

async function obtenerCursos() {
  try {
    const sql =
      "SELECT * FROM " + constantes.ESQUEMA + ".curso order by nid_curso desc";

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener los cursos: ", error);
    throw new Error("Error al obtener los cursos");
  }
}

module.exports.registrarCurso = registrarCurso;
module.exports.obtenerCursoActivo = obtenerCursoActivo;
module.exports.obtenerCursos = obtenerCursos;
