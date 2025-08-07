const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function formatDateToMySQL(date) {
  try {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    return null;
  }
}

function insertarCurso(nid_curso, descripcion, ano, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al insertar el curso: " + error.message);
          conexion.dbConn.rollback();
          reject(new Error("Error al insertar el curso"));
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function actualizarCurso(nid_curso, descripcion, ano, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al actualizar el curso: " + error.message);
          conexion.dbConn.rollback();
          reject(new Error("Error al actualizar el curso"));
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function existeCurso(nid_curso) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".curso WHERE nid_curso = " +
      conexion.dbConn.escape(nid_curso);

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.error("Error al comprobar el curso: " + error.message);
        reject(new Error("Error al comprobar el curso"));
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

async function registrarCurso(
  nid_curso,
  descripcion,
  ano,
  fecha_actualizacion
) {
  try {
    const existeCurso = await existeCurso(nid_curso);
    if (existeCurso) {
      return actualizarCurso(nid_curso, descripcion, ano, fecha_actualizacion);
    } else {
      return insertarCurso(nid_curso, descripcion, ano, fecha_actualizacion);
    }
  } catch (error) {
    console.error("Error al registrar el curso: " + error.message);
    throw new Error("Error al registrar el curso");
  }
}

function obtenerCursoActivo() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " + constantes.ESQUEMA + ".curso WHERE activo = 'S'";

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.error("Error al obtener el curso activo: " + error.message);
        reject(new Error("Error al obtener el curso activo"));
      } else {
        if (result.length === 0) {
          reject(new Error("No hay curso activo registrado"));
        }
        resolve(result[0]);
      }
    });
  });
}

module.exports.registrarCurso = registrarCurso;
module.exports.obtenerCursoActivo = obtenerCursoActivo;
