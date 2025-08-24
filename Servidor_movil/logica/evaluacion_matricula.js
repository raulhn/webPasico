const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");

function insertarEvaluacionMatricula(
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  nid_matricula_asignatura,
  comentario,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".evaluacion_matricula (nid_evaluacion, nota, nid_tipo_progreso, " +
      "nid_matricula_asignatura, comentario, fecha_actualizacion, sucio) " +
      " VALUES (" +
      conexion.dbConn.escape(nid_evaluacion) +
      ", " +
      conexion.dbConn.escape(nota) +
      ", " +
      conexion.dbConn.escape(nid_tipo_progreso) +
      ", " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", " +
      conexion.dbConn.escape(comentario) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", 'N' " +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error(
            "evaluacion_matricula.js -> insertarEvaluacionMatricula: Error al insertar la evaluación de matrícula:",
            err
          );
          conexion.dbConn.rollback();
          reject(err);
        } else {
          conexion.dbConn.commit();
          resolve(result.insertId);
        }
      });
    });
  });
}

function actualizarEvaluacionMatricula(
  nid_evaluacion_matricula,
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  nid_matricula_asignatura,
  comentario,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evaluacion_matricula SET nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion) +
      ", nota = " +
      conexion.dbConn.escape(nota) +
      ", nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso) +
      ", nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", comentario = " +
      conexion.dbConn.escape(comentario) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", sucio = 'N'" +
      " WHERE nid_evaluacion_matricula = " +
      conexion.dbConn.escape(nid_evaluacion_matricula)

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error(
            "evaluacion_matricula.js -> actualizarEvaluacionMatricula: Error al actualizar la evaluación de matrícula:",
            err
          );
          conexion.dbConn.rollback();
          reject(err);
        } else {
          conexion.dbConn.commit();
          resolve(result.affectedRows);
        }
      });
    });
  });
}

function existeEvaluacionMatricula(nid_evaluacion_matricula) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion_matricula = " +
      conexion.dbConn.escape(nid_evaluacion_matricula);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "evaluacion_matricula.js -> existeEvaluacionMatricula: Error al verificar la existencia de la evaluación de matrícula:",
          error
        );
        reject(error);
      }
      resolve(results[0].count > 0);
    });
  });
}

function requiereActualizarEvaluacionMatricula(
  nid_evaluacion_matricula,
  fecha_actualizacion
) {

  return new Promise((resolve, reject) => {
    const sql =
      "SELECT count(*) num FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion_matricula = " +
      conexion.dbConn.escape(nid_evaluacion_matricula) +
      " AND fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "evaluacion_matricula.js -> requiereActualizarEvaluacionMatricula: Error al verificar si requiere actualización:",
          error
        );
        reject(error);
      }
      resolve(results[0].num > 0);
    });
  });
}

function obtenerEvaluacionMatricula(nid_evaluacion, nid_matricula_asignatura)
{
  return new Promise((resolve, reject) => {
    const  sql=
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion) +
      " AND nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "evaluacion_matricula.js -> obtenerEvaluacionMatricula: Error al obtener la evaluación de matrícula:",
          error
        );
        reject(error);
      }
      resolve(results[0]);
    });
  });
}

async function registrarEvaluacionMatricula(
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  nid_matricula_asignatura,
  comentario,
  fecha_actualizacion
) {
  try {
    const evaluacionMatricula = await obtenerEvaluacionMatricula(nid_evaluacion, nid_matricula_asignatura)
    if (evaluacionMatricula) {
      const requiereActualizar = await requiereActualizarEvaluacionMatricula(
        evaluacionMatricula.nid_evaluacion_matricula,
        fecha_actualizacion
      );

      if (requiereActualizar) {
        return await actualizarEvaluacionMatricula(
          evaluacionMatricula.nid_evaluacion_matricula,
          nid_evaluacion,
          nota,
          nid_tipo_progreso,
          nid_matricula_asignatura,
          comentario,
          fecha_actualizacion
        );
      } else {
        return "No se requiere actualización";
      }
    } else {
      return await insertarEvaluacionMatricula(
        nid_evaluacion,
        nota,
        nid_tipo_progreso,
        nid_matricula_asignatura,
        comentario,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar la evaluación de matrícula:", error);
    throw error;
  }
}

function obtenerEvaluacionMatriculaSucias() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula em, " + constantes.ESQUEMA + ".evaluacion e WHERE em.sucio = 'S' AND em.nid_evaluacion = e.nid_evaluacion";
    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.error(
          "evaluacion_matricula.js -> obtenerEvaluacionMatriculaSucias: Error al obtener las evaluaciones de matrícula sucias:",
          err
        );
        reject(err);
      }
      resolve(results);
    });
  });
}

function actualizarEvaluacionMatriculaSucia(nid_evaluacion_matricula) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evaluacion_matricula SET sucio = 'N' WHERE nid_evaluacion_matricula = " +
      conexion.dbConn.escape(nid_evaluacion_matricula);

    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.error(
          "evaluacion_matricula.js -> actualizarEvaluacionMatriculaSucia: Error al actualizar la evaluación de matrícula sucia:",
          err
        );
        reject(err);
      }
      resolve(results.affectedRows);
    });
  });
}

module.exports.registrarEvaluacionMatricula = registrarEvaluacionMatricula;
module.exports.obtenerEvaluacionMatriculaSucias =
  obtenerEvaluacionMatriculaSucias;
module.exports.actualizarEvaluacionMatriculaSucia =
  actualizarEvaluacionMatriculaSucia;
