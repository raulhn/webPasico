const gestor_trimestre = require("../logica/trimestre");
const servletComun = require("./servlet_comun");

async function registrarTrimestre(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_trimestre = req.body.nid_trimestre;
      const descripcion = req.body.descripcion;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      await gestor_trimestre.registrarTrimestre(
        nid_trimestre,
        descripcion,
        fecha_actualizacion
      );
      res.status(200).send({
        error: false,
        mensaje: "Trimestre registrado correctamente",
      });
    } catch (error) {
      console.error(
        "servlet_trimestre.js -> registrarTrimestre: Error al registrar el trimestre:",
        error
      );
      res.status(400).send({
        error: true,
        message: error.message,
      });
    }
  });
}

function obtenerTrimestresSucios(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const trimestres = await gestor_trimestre.obtenerTrimestresSucios();
      res.status(200).send({ error: false, trimestres: trimestres });
    } catch (error) {
      console.error(
        "servlet_trimestre.js -> obtenerTrimestresSucios: Error al obtener los trimestres sucios:",
        error
      );
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  });
}

async function obtenerTrimestres(req, res) {
  try {
    const trimestres = await gestor_trimestre.obtenerTrimestres();
    res.status(200).send({
      error: false,
      mensaje: "Trimestres obtenidos correctamente",
      trimestres: trimestres,
    });
  } catch (error) {
    console.error(
      "servlet_trimestre.js -> obtenerTrimestres: Error al obtener los trimestres: " +
        error.message
    );
    res.status(500).send({
      error: true,
      mensaje: "Error al obtener los trimestres",
    });
  }
}
module.exports.registrarTrimestre = registrarTrimestre;
module.exports.obtenerTrimestresSucios = obtenerTrimestresSucios;
module.exports.obtenerTrimestres = obtenerTrimestres;
