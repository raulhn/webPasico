const constantes = require("../constantes.js");
const comun = require("./servlet_comun.js");
const socios = require("../logica/socio.js");

function registrar_socio(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_persona = req.body.nid_persona;
    let fecha_alta = req.body.fecha_alta;
    let num_socio = req.body.num_socio;

    await socios.registrar_socio(nid_persona, num_socio, fecha_alta);
    res
      .status(200)
      .send({ error: false, message: "Se ha dado de alta al socio" });
  });
}

function actualizar_socio(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      let fecha_alta = req.body.fecha_alta;
      let fecha_baja = req.body.fecha_baja;
      let num_socio = req.body.num_socio;

      await socios.actualizar_socio(
        nid_persona,
        num_socio,
        fecha_alta,
        fecha_baja
      );
      res
        .status(200)
        .send({ error: false, message: "Se ha actualizado el socio" });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .send({ error: true, message: "Error al actualizar el socio" });
    }
  });
}

function obtener_socios(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultado_socios = await socios.obtener_socios();
    res.status(200).send({ error: false, personas: resultado_socios });
  });
}

function obtener_socios_alta(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultado_socios = await socios.obtener_socios_alta();
    res.status(200).send({ error: false, personas: resultado_socios });
  });
}

function obtener_socios_baja(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultado_socios = await socios.obtener_socios_baja();
    res.status(200).send({ error: false, personas: resultado_socios });
  });
}

function obtener_socio(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_persona = req.params.nid_persona;
    let resultado_socio = await socios.obtener_socio(nid_persona);
    res.status(200).send({ error: false, socio: resultado_socio });
  });
}

module.exports.registrar_socio = registrar_socio;
module.exports.actualizar_socio = actualizar_socio;
module.exports.obtener_socios = obtener_socios;
module.exports.obtener_socios_alta = obtener_socios_alta;
module.exports.obtener_socios_baja = obtener_socios_baja;
module.exports.obtener_socio = obtener_socio;
