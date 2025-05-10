const gestorMaticulas = require("../logica/matricula");
const servletComun = require("./servlet_comun");
const constantes = require("../constantes");

function registrarMatricula(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_matricula = req.body.nid_matricula;
      const nid_persona = req.body.nid_persona;
      const nid_curso = req.body.nid_curso;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar matricula: ",
        nid_matricula,
        nid_persona,
        nid_curso,
        fecha_actualizacion
      );
      await gestorMaticulas.registrarMatricula(
        nid_matricula,
        nid_persona,
        nid_curso,
        fecha_actualizacion
      );

      res.status(200).json({
        error: false,
        mensaje: "Matricula registrada correctamente",
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

module.exports.registrarMatricula = registrarMatricula;
