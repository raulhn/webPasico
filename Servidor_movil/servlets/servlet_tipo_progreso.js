const gestor_tipo_progreso = require("../logica/tipo_progreso");
const servletComun = require("./servlet_comun");

async function registrarTipoProgreso(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_tipo_progreso = req.body.nid_tipo_progreso;
      const descripcion = req.body.descripcion;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      await gestor_tipo_progreso.registrarTipoProgreso(
        nid_tipo_progreso,
        descripcion,
        fecha_actualizacion
      );
      res.status(200).send({
        error: false,
        mensaje: "Tipo de progreso registrado correctamente",
      });
    } catch (error) {
      console.error(
        "servlet_tipo_progreso.js -> registrarTipoProgreso: Error al registrar el tipo de progreso:",
        error
      );
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  });
}

async function obtenerTipoProgresoSucios(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const tiposProgreso =
        await gestor_tipo_progreso.obtenerTipoProgresoSucios();
      res.status(200).send({ error: false, tiposProgreso: tiposProgreso });
    } catch (error) {
      console.error(
        "servlet_tipo_progreso.js -> obtenerTipoProgresoSucios: Error al obtener los tipos de progreso sucios:",
        error
      );
      res.status(500).send({
        error: true,
        message: error.message,
      });
    }
  });
}

module.exports.registrarTipoProgreso = registrarTipoProgreso;
module.exports.obtenerTipoProgresoSucios = obtenerTipoProgresoSucios;
