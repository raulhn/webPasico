const gestor_evaluacion = require("../logica/evaluacion");
const servletComun = require("./servlet_comun");

async function registrarEvaluacion(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_evaluacion = req.body.nid_evaluacion;
      const nid_profesor = req.body.nid_profesor;
      const nid_asignatura = req.body.nid_asignatura;
      const nid_trimestre = req.body.nid_trimestre;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      await gestor_evaluacion.registrarEvaluacion(
        nid_evaluacion,
        nid_trimestre,
        nid_asignatura,
        nid_profesor,
        fecha_actualizacion
      );
      res.status(200).send({
        error: false,
        mensaje: "Evaluación registrada correctamente",
      });
    } catch (error) {
      console.error(
        "servlet_evaluacion.js -> registrarEvaluacion: Error al registrar la evaluación:",
        error
      );
      res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  });
}

async function obtenerEvaluacionesSucias(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const evaluaciones = await gestor_evaluacion.obtenerEvaluacionesSucias();
      res.status(200).send({ error: false, evaluaciones: evaluaciones });
    } catch (error) {
      console.error(
        "servlet_evaluacion.js -> obtenerEvaluacionesSucias: Error al obtener las evaluaciones sucias:",
        error
      );
      res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  });
}

module.exports.registrarEvaluacion = registrarEvaluacion;
module.exports.obtenerEvaluacionesSucias = obtenerEvaluacionesSucias;
