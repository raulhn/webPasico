const gestorAsignatura = require("../logica/asignatura.js");
const servletComun = require("./servlet_comun.js");

function registrarAsignatura(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_asignatura = req.body.nid_asignatura;
      let descripcion = req.body.descripcion;
      let instrumento_banda = req.body.instrumento_banda;
      let tipo_asignatura = req.body.tipo_asignatura;
      let fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar Asignatura: ",
        nid_asignatura,
        descripcion,
        instrumento_banda,
        tipo_asignatura,
        fecha_actualizacion
      );

      gestorAsignatura
        .registrarAsignatura(
          nid_asignatura,
          descripcion,
          instrumento_banda,
          tipo_asignatura,
          fecha_actualizacion
        )
        .then(() => {
          res.status(200).send({
            error: false,
            mensaje: "Asignatura registrada correctamente",
          });
        })
        .catch((error) => {
          console.error("Error al registrar la asignatura:" + error.message);
          res.status(400).send({
            error: true,
            mensaje: "Error al registrar la asignatura",
          });
        });
    } catch (error) {
      console.error("Error al registrar la asignatura:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al registrar la asignatura",
      });
    }
  });
}

async function obtenerAsignaturas(req, res) {
  try {
    const asignaturas = await gestorAsignatura.obtenerAsignaturas();
    res.status(200).send({
      error: false,
      asignaturas: asignaturas,
    });
  } catch (error) {
    console.error("Error al obtener las asignaturas:", error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener las asignaturas",
    });
  }
}

module.exports.registrarAsignatura = registrarAsignatura;
module.exports.obtenerAsignaturas = obtenerAsignaturas;
