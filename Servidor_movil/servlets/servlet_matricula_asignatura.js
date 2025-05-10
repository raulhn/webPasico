const servletComun = require("./servlet_comun");
const gestorMatriculaAsignatura = require("../logica/matricula_asignatura");
const constantes = require("../constantes");

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
        nid_asignatura,
        fecha_alta,
        fecha_baja,
        fecha_actualizacion
      );
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

module.exports.registrarMatriculaAsignatura = registrarMatriculaAsignatura;
