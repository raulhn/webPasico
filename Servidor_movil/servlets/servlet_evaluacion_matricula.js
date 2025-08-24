const gestor_evaluacion_matricula = require("../logica/evaluacion_matricula");
const gestor_evaluacion = require("../logica/evaluacion");
const servletComun = require("./servlet_comun");

function registrarEvaluacionMatriculaServicio(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      const fecha_actualizacion = req.body.fecha_actualizacion;
      const nota = req.body.nota;
      const nid_tipo_progreso = req.body.nid_tipo_progreso;
      const comentario = req.body.comentario;

      const nid_profesor = req.body.nid_profesor;
      const nid_asignatura = req.body.nid_asignatura;
      const nid_curso = req.body.nid_curso;
      const nid_trimestre = req.body.nid_trimestre;


      const evaluacion = await gestor_evaluacion.obtenerEvaluacion(nid_curso, nid_asignatura, nid_trimestre, nid_profesor);

      if(!evaluacion) {
        console.log("No se ha encontrado evaluacion")
        return;
      }

      await gestor_evaluacion_matricula.registrarEvaluacionMatricula(
        evaluacion.nid_evaluacion,
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
      const evaluacionesMatricula =
        await gestor_evaluacion_matricula.obtenerEvaluacionMatriculaSucias();

      
      res.status(200).send({ error: false, evaluaciones: evaluacionesMatricula });
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

async function actualizarEvaluacionMatriculaSucia(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nidEvaluacionMatricula = req.body.nid_evaluacion_matricula;
      await gestor_evaluacion_matricula.actualizarEvaluacionMatriculaSucia(
        nidEvaluacionMatricula
      );
      res.status(200).send({
        error: false,
        mensaje: "Evaluación matrícula sucia actualizada correctamente",
      });
    } catch (error) {
      console.error(
        "servlet_evaluacion_matricula.js -> actualizarEvaluacionMatriculaSucia: Error al actualizar la evaluación matrícula sucia:",
        error
      );
      res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  });
}

module.exports.registrarEvaluacionMatriculaServicio = registrarEvaluacionMatriculaServicio;
module.exports.obtenerEvaluacionesMatriculaSucias =
  obtenerEvaluacionesMatriculaSucias;
module.exports.actualizarEvaluacionMatriculaSucia =
  actualizarEvaluacionMatriculaSucia;
