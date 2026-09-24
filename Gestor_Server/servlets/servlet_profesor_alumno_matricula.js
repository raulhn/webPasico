var gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula.js");
const servlet_comun = require("./servlet_comun.js");

function cambiarFechaBajaAlumnoDeProfesor(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      let nid_profesor_alumno_matricula =
        req.body.nid_profesor_alumno_matricula;
      let fecha_baja = req.body.fecha_baja;

      await gestorProfesorAlumnoMatricula.cambiar_fecha_baja_profesor_alumno_matricula(
        nid_profesor_alumno_matricula,
        fecha_baja,
      );
      res
        .status(200)
        .send({ error: false, message: "Se ha dado de baja al alumno" });
    } catch (error) {
      console.log(
        "servlet_profesor_alumno_matricula.js - darDeBajaAlumnoDeProfesor - Error: " +
          error,
      );
      res.status(500).send({ error: true, message: "Error del servidor" });
    }
  });
}

function cambiarFechaAltaAlumnoDeProfesor(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      let nid_profesor_alumno_matricula =
        req.body.nid_profesor_alumno_matricula;
      let fecha_alta = req.body.fecha_alta;

      await gestorProfesorAlumnoMatricula.cambiar_fecha_alta_profesor_alumno_matricula(
        nid_profesor_alumno_matricula,
        fecha_alta,
      );
      res
        .status(200)
        .send({ error: false, message: "Se ha dado de alta al alumno" });
    } catch (error) {
      console.log(
        "servlet_profesor_alumno_matricula.js - darDeAltaAlumnoDeProfesor - Error: " +
          error,
      );
      res.status(500).send({ error: true, message: "Error del servidor" });
    }
  });
}

function quitarProfesor(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      const nid_profesor = req.body.nid_profesor;
      console.log(
        "Quitr profesor: " +
          nid_profesor +
          " de la matricula: " +
          nid_matricula_asignatura,
      );
      const nid_profesor_alumno_matricula =
        await gestorProfesorAlumnoMatricula.obtener_nid_profesor_alumno_matricula(
          nid_profesor,
          nid_matricula_asignatura,
        );
      console.log(
        "NID Profesor Alumno Matricula: ",
        nid_profesor_alumno_matricula,
      );
      await gestorProfesorAlumnoMatricula.quitar_profesor(
        nid_profesor_alumno_matricula,
      );
      res
        .status(200)
        .send({ error: false, message: "Se ha quitado al profesor" });
    } catch (error) {
      console.log(
        "servlet_profesor_alumno_matricula.js - quitarProfesor - Error: " +
          error,
      );
      res.status(500).send({ error: true, message: "Error del servidor" });
    }
  });
}

function obtener_profesores_alumnos_matricula(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
      const profesores_alumnos_matricula =
        await gestorProfesorAlumnoMatricula.obtener_profesores_alumnos_matricula(
          nid_matricula_asignatura,
        );
      res
        .status(200)
        .send({
          error: false,
          profesores_alumnos_matricula: profesores_alumnos_matricula,
        });
    } catch (error) {
      console.log(
        "servlet_profesor_alumno_matricula.js - obtener_profesores_alumnos_matricula - Error: " +
          error,
      );
      res.status(500).send({ error: true, message: "Error del servidor" });
    }
  });
}

module.exports.cambiarFechaBajaAlumnoDeProfesor =
  cambiarFechaBajaAlumnoDeProfesor;
module.exports.cambiarFechaAltaAlumnoDeProfesor =
  cambiarFechaAltaAlumnoDeProfesor;
module.exports.quitarProfesor = quitarProfesor;
module.exports.obtener_profesores_alumnos_matricula =
  obtener_profesores_alumnos_matricula;
