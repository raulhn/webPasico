const gestorMusicos = require("../logica/musicos.js");
const servletComun = require("./servlet_comun.js");

function registrarMusico(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      let fecha_alta = req.body.fecha_alta;
      let fecha_baja = req.body.fecha_baja;
      let nid_tipo_musico = req.body.nid_tipo_musico;
      let nid_instrumento = req.body.nid_instrumento;
      let fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar Músico: ",
        nid_persona,
        fecha_alta,
        fecha_baja,
        nid_tipo_musico,
        nid_instrumento,
        fecha_actualizacion
      );

      await gestorMusicos.registrarMusico(
        nid_persona,
        fecha_alta,
        fecha_baja,
        nid_tipo_musico,
        nid_instrumento,
        fecha_actualizacion
      );

      res.status(200).send({
        error: false,
        mensaje: "Músico registrado correctamente",
      });
    } catch (error) {
      console.error("Error al registrar el músico:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al registrar el músico",
      });
    }
  });
}

module.exports.registrarMusico = registrarMusico;
