const servletComun = require("./servlet_comun");
const servletPersona = require("./servlet_persona");
const gestorMatriculaAsignatura = require("../logica/matricula_asignatura");
const gestorMatricula = require("../logica/matricula");
const constantes = require("../constantes");
const gestorPersonas = require("../logica/persona");
const gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula");
const gestorCurso = require("../logica/curso");
const gestorProfesores = require("../logica/profesores");

function registrarMatriculaAsignatura(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      const nid_matricula = req.body.nid_matricula;
      const nid_asignatura = req.body.nid_asignatura;
      const fecha_alta = req.body.fecha_alta;
      const fecha_baja = req.body.fecha_baja;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar matricula asignatura: ",
        nid_matricula_asignatura,
        nid_matricula,
        fecha_baja,
      );
      await gestorMatriculaAsignatura.registrarMatriculaAsignatura(
        nid_matricula_asignatura,
        nid_matricula,
        nid_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion,
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
      rolesPermitidos,
    );
    if (!rolAdministrador) {
      res.status(403).send({
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

async function obtenerAlumnosCurso(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolAdministrador) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos del curso actual",
      });
      return;
    }
    const nid_curso = req.params.nid_curso;
    const alumnos = await gestorMatriculaAsignatura.obtenerAlumnos(nid_curso);
    res.status(200).send({ error: false, alumnos: alumnos });
  } catch (error) {
    console.error(
      "servlet_matricula_asignatura.js -> obtenerAlumnosCurso: Error al obtener los alumnos del curso: ",
      error,
    );
    res
      .status(400)
      .send({ error: true, mensaje: "Error al obtener los alumnos del curso" });
  }
}

async function obtenerAlumnosCursoActivoAsignatura(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolAdministrador) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos del curso actual",
      });
    } else {
      const nid_asignatura = req.params.nid_asignatura;
      const alumnos =
        await gestorMatriculaAsignatura.obtenerAlumnosCursoActivoAsignatura(
          nid_asignatura,
        );
      res.status(200).send({ error: false, alumnos: alumnos });
    }
  } catch (error) {
    console.error(
      "servlet_matricula_asignatura.js -> obtenerAlumnosCursoActivo: Error al obtener los alumnos del curso actual: ",
      error,
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

    const elementoMatricula =
      await gestorMatricula.obtenerMatricula(nidMatricula);

    let matriculas = matriculasAsignatura.filter(async (matricula) => {
      try {
        matricula.nid_persona === persona.nid_persona ||
          (await gestorPersonas.esHijo(
            persona.nid_persona,
            matricula.nid_persona,
          ));
      } catch (error) {
        console.error(
          "servlet_matricula_asignatura.js -> obtenerMatriculasAsignaturaPersona: Error al filtrar las matriculas por persona: ",
          error,
        );
        return false;
      }
    });

    let matriculasProfesor = [];

    for (let i = 0; i < matriculas.length; i++) {
      let matricula = matriculas[i];
      const profesores =
        await gestorProfesorAlumnoMatricula.obtenerProfesorAlumnoMatricula(
          matricula.nid_matricula_asignatura,
        );
      matricula.profesores = profesores;
      matriculasProfesor.push(matricula);
    }

    res.status(200).send({
      error: false,
      matriculas: matriculasProfesor,
      matricula: elementoMatricula,
    });
  } catch (error) {
    console.error(
      "servlet_matricula_asignatura.js -> obtenerMatriculasAsignaturaPersona: Error al obtener la persona del usuario:",
      error,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener la persona del usuario",
    });
  }
}

async function obtenerAlumnosAsignatura(req, res) {
  try {
    const nid_asignatura = req.params.nid_asignatura;
    const rolePermitidoAdministrador = [constantes.ADMINISTRADOR];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );

    if (!rolAdministrador) {
      const rolPermitidoProfesor = [constantes.PROFESOR];

      const rolProfesor = await servletComun.comprobarRol(
        req,
        res,
        rolPermitidoProfesor,
      );

      const nid_profesor = await servletPersona.obtenerNidPersona(req);
      const esProfesor = await gestorProfesores.esProfesor(
        nid_profesor,
        nid_asignatura,
      );

      if (!rolProfesor && !esProfesor) {
        res.status(403).send({
          error: true,
          mensaje:
            "No tienes permisos para obtener los alumnos de la asignatura",
        });
        return;
      }
    }

    if (!rolAdministrador && !rolProfesor) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos de la asignatura",
      });
      return;
    }

    const curso = gestorCurso.obtenerCursoActivo();

    const alumnos = await gestorMatriculaAsignatura.obtenerAlumnosAsignatura(
      nid_asignatura,
      curso.nid_curso,
    );
    res.status(200).send({ error: false, alumnos: alumnos });
  } catch (error) {
    console.error(
      "servlet_matricula_asignatura.js -> obtenerAlumnosAsignatura: Error al obtener los alumnos de la asignatura:",
      error,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los alumnos de la asignatura",
    });
  }
}

async function obtenerAlumnosAsignaturaProfesor(req, res) {
  try {
    const nid_asignatura = req.params.nid_asignatura;
    const nid_curso = req.params.nid_curso;
    const nid_profesor = await servletPersona.obtenerNidPersona(req);

    const alumnos =
      await gestorMatriculaAsignatura.obtenerAlumnosAsignaturaProfesor(
        nid_asignatura,
        nid_curso,
        nid_profesor,
      );
    res.status(200).send({ error: false, alumnos: alumnos });
  } catch (error) {
    console.error(
      "servlet_matricula_asignatura.js -> obtenerAlumnosAsignaturaProfesor: Error al obtener los alumnos de la asignatura:",
      error,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los alumnos de la asignatura",
    });
  }
}

module.exports.registrarMatriculaAsignatura = registrarMatriculaAsignatura;
module.exports.obtenerAlumnosCursoActivo = obtenerAlumnosCursoActivo;
module.exports.obtenerAlumnosCurso = obtenerAlumnosCurso;
module.exports.obtenerAlumnosCursoActivoAsignatura =
  obtenerAlumnosCursoActivoAsignatura;
module.exports.obtenerMatriculasAsignaturaPersona =
  obtenerMatriculasAsignaturaPersona;
module.exports.obtenerAlumnosAsignatura = obtenerAlumnosAsignatura;
module.exports.obtenerAlumnosAsignaturaProfesor =
  obtenerAlumnosAsignaturaProfesor;

