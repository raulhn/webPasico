const gestorProfesores = require("../logica/profesores.js");
const servletComun = require("./servlet_comun.js");

function registrarProfesor(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      let nid_asignatura = req.body.nid_asignatura;
      let esBaja = req.body.esBaja;
      let fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar Profesor: ",
        nid_persona,
        nid_asignatura,
        fecha_actualizacion
      );
      await gestorProfesores
        .registrarProfesor(
          nid_persona,
          nid_asignatura,
          esBaja,
          fecha_actualizacion
        )
        .then(() => {
          res.status(200).send({
            error: false,
            mensaje: "Profesor registrado correctamente",
          });
        })
        .catch((error) => {
          console.error("Error al registrar el profesor:" + error.message);
          res.status(400).send({
            error: true,
            mensaje: "Error al registrar el profesor",
          });
        });
    } catch (error) {
      console.error("Error al registrar el profesor:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al registrar el profesor",
      });
    }
  });
}

function eliminarProfesor(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      let nid_asignatura = req.body.nid_asignatura;

      console.log("Eliminar Profesor: ", nid_persona, nid_asignatura);
      gestorProfesores
        .eliminarProfesor(nid_persona, nid_asignatura)
        .then(() => {
          res.status(200).send({
            error: false,
            mensaje: "Profesor eliminado correctamente",
          });
        })
        .catch((error) => {
          console.error("Error al eliminar el profesor:" + error.message);
          res.status(400).send({
            error: true,
            mensaje: "Error al eliminar el profesor",
          });
        });
    } catch (error) {
      console.error("Error al eliminar el profesor:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al eliminar el profesor",
      });
    }
  });
}

module.exports.registrarProfesor = registrarProfesor;
module.exports.eliminarProfesor = eliminarProfesor;
