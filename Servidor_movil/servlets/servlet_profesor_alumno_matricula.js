const gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula");
const servletComun = require("./servlet_comun");
const constantes = require("../constantes");
const gestorPersona = require("../logica/persona.js");

function registrarProfesorAlumnoMatricula(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      const nid_profesor_alumno_matricula =
        req.body.nid_profesor_alumno_matricula;
      const nid_profesor = req.body.nid_profesor;
      const fecha_alta = req.body.fecha_alta;
      const fecha_baja = req.body.fecha_baja;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar provesor alumno matricula: ",
        nid_matricula_asignatura,
        nid_profesor_alumno_matricula,
        nid_profesor,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );

      await gestorProfesorAlumnoMatricula.registrarProfesorAlumnoMatricula(
        nid_profesor_alumno_matricula,
        nid_profesor,
        nid_matricula_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );

      res.status(200).json({
        error: false,
        mensaje: "Profesor alumno matricula registrada correctamente",
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

async function obtenerAlumnosProfesor(req, res) {
  try {
    const rolesPermitidos = [constantes.PROFESOR];
    let rolProfesor = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos
    );
    if (!rolProfesor) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos del profesor",
      });
      return;
    }

    const tokenDecoded = await servletComun.obtenerTokenDecoded(req);

    const nid_usuario = tokenDecoded.nid_usuario;
    const nid_profesor = await gestorPersona.obtenerPersonaUsuario(nid_usuario);
    let alumnos =
      await gestorProfesorAlumnoMatricula.obtenerAlumnosProfesorCursoActual(
        nid_profesor
      );

    res.status(200).send({ error: false, alumnos: alumnos });
  } catch (error) {
    console.error("Error al obtener los alumnos del profesor:", error);
    res.status(400).send({
      error: true,
      message: error.message,
    });
  }
}

module.exports.registrarProfesorAlumnoMatricula =
  registrarProfesorAlumnoMatricula;

module.exports.obtenerAlumnosProfesor = obtenerAlumnosProfesor;
