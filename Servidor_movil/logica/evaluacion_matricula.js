const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");
const gestor_base_datos = require("./base_datos");

async function insertarEvaluacionMatricula(
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  nid_matricula_asignatura,
  comentario,
  fecha_actualizacion,
) {
  try {
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

    const result = await gestor_base_datos.actualiza(sql);
    return result.insertId;
  } catch (error) {
    console.error("Error al insertar la evaluación de matrícula:", error);
    throw new Error("Error al insertar la evaluación de matrícula");
  }
}

async function actualizarEvaluacionMatricula(
  nid_evaluacion_matricula,
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  nid_matricula_asignatura,
  comentario,
  fecha_actualizacion,
) {
  try {
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
      conexion.dbConn.escape(nid_evaluacion_matricula);

    const result = await gestor_base_datos.actualiza(sql);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al actualizar la evaluación de matrícula:", error);
    throw new Error("Error al actualizar la evaluación de matrícula");
  }
}

async function existeEvaluacionMatricula(nid_evaluacion_matricula) {
  try {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion_matricula = " +
      conexion.dbConn.escape(nid_evaluacion_matricula);

    const result = await gestor_base_datos.consulta(sql);
    return result[0].count > 0;
  } catch (error) {
    console.error(
      "Error al verificar la existencia de la evaluación de matrícula:",
      error,
    );
    throw new Error(
      "Error al verificar la existencia de la evaluación de matrícula",
    );
  }
}

async function requiereActualizarEvaluacionMatricula(
  nid_evaluacion_matricula,
  fecha_actualizacion,
) {
  try {
    const sql =
      "SELECT count(*) num FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion_matricula = " +
      conexion.dbConn.escape(nid_evaluacion_matricula) +
      " AND fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));

    const result = await gestor_base_datos.consulta(sql);
    return result[0].num > 0;
  } catch (error) {
    console.error(
      "Error al verificar si requiere actualización de la evaluación de matrícula:",
      error,
    );
    throw new Error(
      "Error al verificar si requiere actualización de la evaluación de matrícula",
    );
  }
}

async function obtenerEvaluacionMatricula(
  nid_evaluacion,
  nid_matricula_asignatura,
) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion) +
      " AND nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const result = await gestor_base_datos.consulta(sql);
    return result[0];
  } catch (error) {
    console.error("Error al obtener la evaluación de matrícula:", error);
    throw new Error("Error al obtener la evaluación de matrícula");
  }
}

async function registrarEvaluacionMatricula(
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  nid_matricula_asignatura,
  comentario,
  fecha_actualizacion,
) {
  try {
    const evaluacionMatricula = await obtenerEvaluacionMatricula(
      nid_evaluacion,
      nid_matricula_asignatura,
    );
    if (evaluacionMatricula) {
      const requiereActualizar = await requiereActualizarEvaluacionMatricula(
        evaluacionMatricula.nid_evaluacion_matricula,
        fecha_actualizacion,
      );

      if (requiereActualizar) {
        return await actualizarEvaluacionMatricula(
          evaluacionMatricula.nid_evaluacion_matricula,
          nid_evaluacion,
          nota,
          nid_tipo_progreso,
          nid_matricula_asignatura,
          comentario,
          fecha_actualizacion,
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
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al registrar la evaluación de matrícula:", error);
    throw error;
  }
}

async function obtenerEvaluacionMatriculaSucias() {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula em, " +
      constantes.ESQUEMA +
      ".evaluacion e WHERE em.sucio = 'S' AND em.nid_evaluacion = e.nid_evaluacion";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error(
      "Error al obtener las evaluaciones de matrícula sucias:",
      error,
    );
    throw new Error("Error al obtener las evaluaciones de matrícula sucias");
  }
}

async function actualizarEvaluacionMatriculaSucia(nid_evaluacion_matricula) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evaluacion_matricula SET sucio = 'N' WHERE nid_evaluacion_matricula = " +
      conexion.dbConn.escape(nid_evaluacion_matricula);

    const result = await gestor_base_datos.actualiza(sql);
    return result.affectedRows;
  } catch (error) {
    console.error(
      "Error al actualizar la evaluación de matrícula sucia:",
      error,
    );
    throw new Error("Error al actualizar la evaluación de matrícula sucia");
  }
}

module.exports.registrarEvaluacionMatricula = registrarEvaluacionMatricula;
module.exports.obtenerEvaluacionMatriculaSucias =
  obtenerEvaluacionMatriculaSucias;
module.exports.actualizarEvaluacionMatriculaSucia =
  actualizarEvaluacionMatriculaSucia;
module.exports.existeEvaluacionMatricula = existeEvaluacionMatricula;
