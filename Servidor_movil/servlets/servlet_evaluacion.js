const gestor_evaluacion = require("../logica/evaluacion");
const servletComun = require("./servlet_comun");
const servletPersona = require("./servlet_persona");
const gestorMatricula = require("../logica/matricula");
const gestorPersonas = require("../logica/persona");
const gestorFicheros = require("../logica/ficheros");
const e = require("express");

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

async function obtenerEvaluacionTrimestre(req, res) {
  try {
    const nidPersona = await servletPersona.obtenerNidPersona(req, res);
    const nidMatricula = req.params.nid_matricula;
    const nidTrimestre = req.params.nid_trimestre;

    const matricula = await gestorMatricula.obtenerMatricula(nidMatricula);

    if (matricula.nid_persona !== nidPersona) {
      const bEsPadre = gestorPersonas.esPadre(
        nidPersona,
        matricula.nid_persona
      );
      if (!bEsPadre) {
        res.status(403).send({
          error: true,
          message: "No tienes permiso para acceder a esta evaluación",
        });

        return;
      }
    }

    const evaluacion = await gestor_evaluacion.obtenerEvaluacionTrimestre(
      nidMatricula,
      nidTrimestre
    );

    res.status(200).send({
      error: false,
      mensaje: "Evaluación obtenida correctamente",
      evaluacion: evaluacion,
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> obtenerEvaluacion: Error al obtener la evaluación:",
      error
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al obtener la evaluación",
    });
  }
}

async function obtenerEvaluaciones(req, res) {
  try {
    const persona = await servletPersona.obtenerNidPersona(req, res);
    const nidMatricula = req.params.nid_matricula;

    const matricula = await gestorMatricula.obtenerMatricula(nidMatricula);

    if (matricula.nid_persona !== persona.nid_persona) {
      const bEsPadre = await gestorPersonas.esHijo(
        persona.nid_persona,
        matricula.nid_persona
      );
      if (!bEsPadre) {
        res.status(403).send({
          error: true,
          message: "No tienes permiso para acceder a esta evaluación",
        });

        return;
      }
    }

    const evaluaciones =
      await gestor_evaluacion.obtenerEvaluaciones(nidMatricula);

    console.log("Evaluaciones ", evaluaciones);
    res.status(200).send({
      error: false,
      mensaje: "Evaluación obtenida correctamente",
      evaluaciones: evaluaciones,
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> obtenerEvaluaciones: Error al obtener la evaluación:",
      error
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al obtener la evaluación",
    });
  }
}

async function generar_boletin(req, res) {
  try {
    const persona = await servletPersona.obtenerNidPersona(req, res);
    const nidMatricula = req.params.nid_matricula;
    const nidTrimestre = req.params.nid_trimestre;

    const matricula = await gestorMatricula.obtenerMatricula(nidMatricula);

    if (matricula.nid_persona !== persona.nid_persona) {
      const bEsPadre = await gestorPersonas.esHijo(
        persona.nid_persona,
        matricula.nid_persona
      );
      if (!bEsPadre) {
        res.status(403).send({
          error: true,
          message: "No tienes permiso para acceder a esta evaluación",
        });

        return;
      }
    }
    const evaluacion = await gestor_evaluacion.generar_boletin(
      nidMatricula,
      nidTrimestre
    );

    res.status(200).send({ error: false, fichero: evaluacion });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> generar_evaluacion: Error al generar la evaluación:",
      error
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al generar la evaluación",
    });
  }
}

module.exports.registrarEvaluacion = registrarEvaluacion;
module.exports.obtenerEvaluacionesSucias = obtenerEvaluacionesSucias;
module.exports.obtenerEvaluacionTrimestre = obtenerEvaluacionTrimestre;
module.exports.obtenerEvaluaciones = obtenerEvaluaciones;
module.exports.generar_boletin = generar_boletin;
