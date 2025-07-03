const servletComun = require("./servlet_comun");
const gestorMatriculaAsignatura = require("../logica/matricula_asignatura");
const constantes = require("../constantes");
const gestorPersonas = require("../logica/persona");

function registrarMatriculaAsignatura(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      const nid_matricula = req.body.nid_matricula;
      const nid_asignatura = req.body.nid_asignatura;
      const fecha_alta = req.body.fecha_alta;
      const fecha_baja = req.body.fecha_baja;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      await gestorMatriculaAsignatura.registrarMatriculaAsignatura(
        nid_matricula_asignatura,
        nid_matricula,
        nid_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );
      res.status(200).json({
        error: false,
        mensaje: "Matricula asignatura registrada correctamente",
      });
    } catch (error) {
      console.error("Error al registrar la matricula:", error);
      res.status(500).json({
        error: "Error al registrar la matricula",
        message: error.message,
      });
    }
  });
}

async function obtenerAlumnosCursoActivo(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos
    );
    if (!rolAdministrador) {
      return res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos del profesor",
      });
    } else {
      const alumnos =
        await gestorMatriculaAsignatura.obtenerAlumnosCursoActivo();
      res.status(200).send({ error: false, alumnos: alumnos });
    }
  } catch (error) {
    console.error("Error al obtener los alumnos del curso actual: ", error);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los alumnos del curso actual",
    });
  }
}

async function obtenerAlumnosCursoActivoAsignatura(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos
    );
    if (!rolAdministrador) {
      return res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos del curso actual",
      });
    } else {
      const nid_asignatura = req.params.nid_asignatura;
      const alumnos =
        await gestorMatriculaAsignatura.obtenerAlumnosCursoActivoAsignatura(
          nid_asignatura
        );
      res.status(200).send({ error: false, alumnos: alumnos });
    }
  } catch (error) {
    console.error(
      "servlet_matricula_asignatura.js -> obtenerAlumnosCursoActivo: Error al obtener los alumnos del curso actual: ",
      error
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los alumnos del curso actual",
    });
  }
}

async function obtenerMatriculasAsignaturaPersona(req, res) {
  try {
    const tonkenDecoded = await servletComun.obtenerTokenDecoded(req);

    const nid_usuario = tonkenDecoded.nid_usuario;
    const persona = await gestorPersonas.obtenerPersonaUsuario(nid_usuario);
    const nidMatricula = req.params.nid_matricula;

    const matriculasAsignatura =
      await gestorMatriculaAsignatura.obtenerMatriculasAsignatura(nidMatricula);

    let matriculas = matriculasAsignatura.filter(
      async (matricula) =>
        matricula.nid_persona === persona.nid_persona ||
        (await gestorPersonas.esHijo(
          persona.nid_persona,
          matricula.nid_persona
        ))
    );

    res.status(200).send({
      error: false,
      matriculas: matriculas,
    });
  } catch (error) {
    console.error(
      "servlet_matricula_asignatura.js -> obtenerMatriculasAsignaturaPersona: Error al obtener la persona del usuario:",
      error
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener la persona del usuario",
    });
  }
}

module.exports.registrarMatriculaAsignatura = registrarMatriculaAsignatura;
module.exports.obtenerAlumnosCursoActivo = obtenerAlumnosCursoActivo;
module.exports.obtenerAlumnosCursoActivoAsignatura =
  obtenerAlumnosCursoActivoAsignatura;
module.exports.obtenerMatriculasAsignaturaPersona =
  obtenerMatriculasAsignaturaPersona;
