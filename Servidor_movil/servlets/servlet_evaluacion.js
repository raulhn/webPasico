const gestor_evaluacion = require("../logica/evaluacion");
const servletPersona = require("./servlet_persona");
const gestorMatricula = require("../logica/matricula");
const gestorProfesores = require("../logica/profesores");
const gestorPersonas = require("../logica/persona");
const gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula");
const servletComun = require("./servlet_comun");
const jwt = require("jsonwebtoken");
const constantes = require("../constantes.js");
const e = require("express");
const libreOffice = require("libreoffice-convert");
const fs = require("fs").promises;
libreOffice.convertAsync = require("util").promisify(libreOffice.convert);

async function registrarEvaluacionServicio(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_evaluacion = req.body.nid_evaluacion;
      const nid_profesor = req.body.nid_profesor;
      const nid_asignatura = req.body.nid_asignatura;
      const nid_trimestre = req.body.nid_trimestre;
      const fecha_actualizacion = req.body.fecha_actualizacion;
      const nid_curso = req.body.nid_curso;

      await gestor_evaluacion.registrarEvaluacion(
        nid_evaluacion,
        nid_trimestre,
        nid_asignatura,
        nid_profesor,
        fecha_actualizacion,
        nid_curso,
      );
      res.status(200).send({
        error: false,
        mensaje: "Evaluación registrada correctamente",
      });
    } catch (error) {
      console.error(
        "servlet_evaluacion.js -> registrarEvaluacion: Error al registrar la evaluación:",
        error,
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
        error,
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
        matricula.nid_persona,
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
      nidTrimestre,
    );

    res.status(200).send({
      error: false,
      mensaje: "Evaluación obtenida correctamente",
      evaluacion: evaluacion,
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> obtenerEvaluacion: Error al obtener la evaluación:",
      error,
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al obtener la evaluación",
    });
  }
}

async function obtenerEvaluaciones(req, res) {
  try {
    const nid_persona = await servletPersona.obtenerNidPersona(req);
    const nidMatricula = req.params.nid_matricula;

    const matricula = await gestorMatricula.obtenerMatricula(nidMatricula);

    if (matricula.nid_persona !== nid_persona) {
      const bEsPadre = await gestorPersonas.esHijo(
        nid_persona,
        matricula.nid_persona,
      );
      if (!bEsPadre) {
        const bEsProfesorAlumno =
          await gestorProfesorAlumnoMatricula.esAlumnoProfesor(
            matricula.nid_persona,
            nid_persona,
            matricula.nid_curso,
          );
        if (!bEsProfesorAlumno) {
          res.status(403).send({
            error: true,
            message: "No tienes permiso para acceder a esta evaluación",
          });
          return;
        }
      }
    }

    const evaluaciones =
      await gestor_evaluacion.obtenerEvaluaciones(nidMatricula);

    res.status(200).send({
      error: false,
      mensaje: "Evaluación obtenida correctamente",
      evaluaciones: evaluaciones,
      nombre_alumno:
        matricula.nombre +
        " " +
        matricula.primer_apellido +
        " " +
        matricula.segundo_apellido,
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> obtenerEvaluaciones: Error al obtener la evaluación:",
      error,
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al obtener la evaluación",
    });
  }
}

async function generarBoletinWeb(req, res) {
  try {
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);
    const nidMatricula = req.params.nid_matricula;
    const nidTrimestre = req.params.nid_trimestre;

    const matricula = await gestorMatricula.obtenerMatricula(nidMatricula);

    if (matricula.nid_persona !== nid_persona) {
      const bEsPadre = await gestorPersonas.esHijo(
        nid_persona,
        matricula.nid_persona,
      );
      if (!bEsPadre) {
        const bEsProfesorAlumno =
          await gestorProfesorAlumnoMatricula.esAlumnoProfesor(
            matricula.nid_persona,
            nid_persona,
            matricula.nid_curso,
          );
        if (!bEsProfesorAlumno) {
          res.status(403).send({
            error: true,
            message: "No tienes permiso para acceder a esta evaluación",
          });
          return;
        }
      }
    }

    const evaluacion = await gestor_evaluacion.generar_boletin(
      nidMatricula,
      nidTrimestre,
    );

    const extensionPdf = ".pdf";
    let pdfBuf = await libreOffice.convertAsync(
      evaluacion,
      extensionPdf,
      undefined,
    );

    res.writeHead(200);
    res.write(pdfBuf);

    return res.end();
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> generarBoletingWeb: Error al generar la evaluación:",
      error,
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al generar la evaluación",
    });
  }
}

async function solicitar_generar_boletin(req, res) {
  try {
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);
    const nidMatricula = req.params.nid_matricula;
    const nidTrimestre = req.params.nid_trimestre;

    const matricula = await gestorMatricula.obtenerMatricula(nidMatricula);

    if (matricula.nid_persona !== nid_persona) {
      const bEsPadre = await gestorPersonas.esHijo(
        nid_persona,
        matricula.nid_persona,
      );
      if (!bEsPadre) {
        const bEsProfesorAlumno =
          await gestorProfesorAlumnoMatricula.esAlumnoProfesor(
            matricula.nid_persona,
            nid_persona,
            matricula.nid_curso,
          );
        if (!bEsProfesorAlumno) {
          res.status(403).send({
            error: true,
            message: "No tienes permiso para acceder a esta evaluación",
          });
          return;
        }
      }
    }

    const tokenGeneracion = jwt.sign(
      {
        nid_persona: nid_persona,
        nid_matricula: nidMatricula,
        nid_trimestre: nidTrimestre,
      },
      process.env.SESSION_SECRET,
      {
        expiresIn: constantes.TIEMPO_GENERA_BOLETIN,
      },
    );

    res.status(200).send({
      error: false,
      mensaje: "Solicitud de generación de boletín realizada correctamente",
      tokenGeneracion: tokenGeneracion,
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> solicitar_generar_boletin: Error al solicitar la generación del boletín:",
      error,
    );
    res.status(400).send({
      error: true,
      message:
        "Se ha producido un error al solicitar la generación del boletín",
    });
  }
}

function decodificarToken(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject({ error: true, mensaje: "No autenticado", codigo: 1 });
      return;
    }

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("El token ha expirado:", err);
          reject({ error: true, mensaje: "Token expirado", codigo: 1 });
          return;
        }
        console.error("Error al verificar el token:", err);
        reject({ error: true, mensaje: "No autenticado", codigo: 2 });
        return;
      }
      resolve(decoded);
    });
  });
}

async function generar_boletin(req, res) {
  try {
    const token = req.params.token;

    const tokenDecoded = await decodificarToken(token);
    const matricula = await gestorMatricula.obtenerMatricula(
      tokenDecoded.nid_matricula,
    );

    if (matricula.nid_persona !== tokenDecoded.nid_persona) {
      const bEsPadre = await gestorPersonas.esHijo(
        tokenDecoded.nid_persona,
        matricula.nid_persona,
      );
      if (!bEsPadre) {
        const bEsProfesorAlumno =
          await gestorProfesorAlumnoMatricula.esAlumnoProfesor(
            matricula.nid_persona,
            tokenDecoded.nid_persona,
            matricula.nid_curso,
          );
        if (!bEsProfesorAlumno) {
          res.status(403).send({
            error: true,
            message: "No tienes permiso para acceder a esta evaluación",
          });
          return;
        }
      }
    }

    const evaluacion = await gestor_evaluacion.generar_boletin(
      tokenDecoded.nid_matricula,
      tokenDecoded.nid_trimestre,
    );

    const extensionPdf = ".pdf";
    let pdfBuf = await libreOffice.convertAsync(
      evaluacion,
      extensionPdf,
      undefined,
    );

    res.writeHead(200);
    res.write(pdfBuf);

    return res.end();
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> generar_evaluacion: Error al generar la evaluación:",
      error,
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al generar la evaluación",
    });
  }
}

async function obtenerEvaluacionesAsignaturas(req, res) {
  try {
    const nidAsignatura = req.params.nid_asignatura;
    const nidCurso = req.params.nid_curso;
    const nidTrimestre = req.params.nid_trimestre;

    const rolesPermitidos = ["PROFESOR"];
    let rolPermitido = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );

    if (!rolPermitido) {
      res.status(403).send({
        error: true,
        message:
          "No tienes permisos para obtener las evaluaciones de asignaturas",
      });
      return;
    }

    const nidProfesor = await servletPersona.obtenerNidPersona(req);

    const evaluaciones = await gestor_evaluacion.obtenerEvaluacionesAsignaturas(
      nidAsignatura,
      nidCurso,
      nidTrimestre,
      nidProfesor,
    );

    res.status(200).send({
      error: false,
      mensaje: "Evaluaciones obtenidas correctamente",
      evaluaciones: evaluaciones,
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> obtenerEvaluacionesAsignaturas: Error al obtener las evaluaciones de asignaturas:",
      error,
    );
    res.status(400).send({
      error: true,
      message:
        "Se ha producido un error al obtener las evaluaciones de asignaturas",
    });
  }
}

async function obtenerEvaluacionesAsignaturasProfesor(req, res) {
  try {
    let nidProfesor = req.params.nid_profesor;
    const nidAsignatura = req.params.nid_asignatura;
    const nidCurso = req.params.nid_curso;
    const nidTrimestre = req.params.nid_trimestre;

    const rolesPermitidos = ["ADMINISTRADOR", "COMISION_EDUCATIVA"];
    let rolPermitido = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolPermitido) {
      console.log(
        "servlet_evaluacion.js -> obtenerEvaluacionesAsignaturasProfesor: No es administrador o comisión educativa",
      );
      res.status(403).send({
        error: true,
        message:
          "No tienes permisos para obtener las evaluaciones de asignaturas del profesor",
      });
      return;
    }

    const evaluaciones = await gestor_evaluacion.obtenerEvaluacionesAsignaturas(
      nidAsignatura,
      nidCurso,
      nidTrimestre,
      nidProfesor,
    );

    res.status(200).send({
      error: false,
      mensaje: "Evaluaciones obtenidas correctamente",
      evaluaciones: evaluaciones,
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> obtenerEvaluacionesAsignaturasProfesor: Error al obtener las evaluaciones de asignaturas del profesor:",
      error,
    );
    res.status(400).send({
      error: true,
      message:
        "Se ha producido un error al obtener las evaluaciones de asignaturas del profesor",
    });
  }
}

async function registrarEvaluaciones(req, res) {
  try {
    const evaluaciones = req.body.evaluaciones;
    const nid_asignatura = req.body.nid_asignatura;
    const nid_curso = req.body.nid_curso;
    const nid_trimestre = req.body.nid_trimestre;

    const nidPersona = await servletPersona.obtenerNidPersona(req);
    const esProfesor = await gestorProfesores.esProfesor(
      nidPersona,
      nid_asignatura,
    );

    if (!esProfesor) {
      res.status(403).send({
        error: true,
        message: "No tienes permisos para registrar evaluaciones",
      });
      return;
    }

    let evaluacionRecuperada = await gestor_evaluacion.obtenerEvaluacion(
      nid_curso,
      nid_asignatura,
      nid_trimestre,
      nidPersona,
    );

    if (!evaluacionRecuperada) {
      await gestor_evaluacion.insertarEvaluacion(
        nid_trimestre,
        nid_asignatura,
        nidPersona,
        nid_curso,
        "S",
      );
      evaluacionRecuperada = await gestor_evaluacion.obtenerEvaluacion(
        nid_curso,
        nid_asignatura,
        nid_trimestre,
        nidPersona,
      );
    }

    for (const evaluacion of evaluaciones) {
      if (evaluacion.progreso.valor != 0) {
        const evaluacionMatricula =
          await gestor_evaluacion.obtenerEvaluacionMatricula(
            evaluacionRecuperada.nid_evaluacion,
            evaluacion.nid_matricula_asignatura,
          );
        if (!evaluacionMatricula) {
          await gestor_evaluacion.insertarEvaluacionMatricula(
            evaluacionRecuperada.nid_evaluacion,
            evaluacion.nota,
            evaluacion.progreso.valor,
            evaluacion.nid_matricula_asignatura,
            evaluacion.comentario,
          );
        } else {
          await gestor_evaluacion.actualizarEvaluacionMatricula(
            evaluacionMatricula.nid_evaluacion_matricula,
            evaluacionRecuperada.nid_evaluacion,
            evaluacion.nota,
            evaluacion.progreso.valor,
            evaluacion.nid_matricula_asignatura,
            evaluacion.comentario,
          );
        }
      }
    }

    res.status(200).send({
      error: false,
      mensaje: "Evaluaciones registradas correctamente",
    });
  } catch (error) {
    console.error(
      "servlet_evaluacion.js -> registrarEvaluaciones: Error al registrar las evaluaciones:",
      error,
    );
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al registrar las evaluaciones",
    });
  }
}

async function actualizarEvaluacionSucia(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nidEvaluacion = req.body.nid_evaluacion;

      await gestor_evaluacion.actualizarEvaluacionSucia(nidEvaluacion);

      res.status(200).send({
        error: false,
        mensaje: "Estado de la evaluación actualizado correctamente",
      });
    } catch (error) {
      console.error(
        "servlet_evaluacion.js -> actualizarEvaluacionSucio: Error al actualizar el estado de la evaluación:",
        error,
      );
      res.status(400).send({
        error: true,
        message:
          "Se ha producido un error al actualizar el estado de la evaluación",
      });
    }
  });
}

module.exports.registrarEvaluacionServicio = registrarEvaluacionServicio;
module.exports.obtenerEvaluacionesSucias = obtenerEvaluacionesSucias;
module.exports.obtenerEvaluacionTrimestre = obtenerEvaluacionTrimestre;
module.exports.obtenerEvaluaciones = obtenerEvaluaciones;
module.exports.generarBoletinWeb = generarBoletinWeb;
module.exports.generar_boletin = generar_boletin;
module.exports.solicitar_generar_boletin = solicitar_generar_boletin;
module.exports.obtenerEvaluacionesAsignaturas = obtenerEvaluacionesAsignaturas;
module.exports.obtenerEvaluacionesAsignaturasProfesor =
  obtenerEvaluacionesAsignaturasProfesor;
module.exports.registrarEvaluaciones = registrarEvaluaciones;
module.exports.actualizarEvaluacionSucia = actualizarEvaluacionSucia;
