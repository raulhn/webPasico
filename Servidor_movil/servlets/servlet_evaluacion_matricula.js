const gestor_evaluacion_matricula = require("../logica/evaluacion_matricula");
const servletComun = require("./servlet_comun");

function registrarEvaluacionMatricula(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_evaluacion_matricula = req.body.nid_evaluacion_matricula;
      const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      const nid_evaluacion = req.body.nid_evaluacion;
      const fecha_actualizacion = req.body.fecha_actualizacion;
      const nota = req.body.nota;
      const nid_tipo_progreso = req.body.nid_tipo_progreso;
      const comentario = req.body.comentario;

      await gestor_evaluacion_matricula.registrarEvaluacionMatricula(
        nid_evaluacion_matricula,
        nid_evaluacion,
        nota,
        nid_tipo_progreso,
        nid_matricula_asignatura,
        comentario,
        fecha_actualizacion
      );
      res.status(200).send({
        error: false,
        mensaje: "Evaluación matrícula registrada correctamente",
      });
    } catch (error) {
      console.error(
        "servlet_evaluacion_matricula.js -> registrarEvaluacionMatricula: Error al registrar la evaluación matrícula:",
        error
      );
      res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  });
}

function obtenerEvaluacionesMatriculaSucias(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const evaluaciones =
        await gestor_evaluacion_matricula.obtenerEvaluacionMatriculaSucias();
      res.status(200).send({ error: false, evaluaciones: evaluaciones });
    } catch (error) {
      console.error(
        "servlet_evaluacion_matricula.js -> obtenerEvaluacionesMatriculaSucicas: Error al obtener las evaluaciones matrícula sucias:",
        error
      );
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  });
}

module.exports.registrarEvaluacionMatricula = registrarEvaluacionMatricula;
module.exports.obtenerEvaluacionesMatriculaSucias =
  obtenerEvaluacionesMatriculaSucias;
