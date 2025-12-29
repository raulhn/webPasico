var comun = require("../logica/comun.js");
var gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula.js");

function cambiarFechaBajaAlumnoDeProfesor(req, res) {
  comun.comprobaciones(req, res, async () => {
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
  comun.comprobaciones(req, res, async () => {
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

module.exports.cambiarFechaBajaAlumnoDeProfesor =
  cambiarFechaBajaAlumnoDeProfesor;
module.exports.cambiarFechaAltaAlumnoDeProfesor =
  cambiarFechaAltaAlumnoDeProfesor;
