const constantes = require("../constantes.js");
const comun = require("./servlet_comun.js");
const socios = require("../logica/socio.js");
const gestorCurso = require("../logica/curso.js");

function registrar_socio(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      let fecha_alta = req.body.fecha_alta;
      let num_socio = req.body.num_socio;

      await socios.registrar_socio(nid_persona, num_socio, fecha_alta);
      res
        .status(200)
        .send({ error: false, message: "Se ha dado de alta al socio" });
    } catch (error) {
      console.log("servlet_socios -> registrar_socio", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Se ha producido un error" });
    }
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
        fecha_baja,
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
    try {
      let resultado_socios = await socios.obtener_socios();
      res.status(200).send({ error: false, personas: resultado_socios });
    } catch (error) {
      console.log("servlet_socios -> obtener_socios", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Se ha producido un error" });
    }
  });
}

function obtener_socios_alta(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let resultado_socios = await socios.obtener_socios_alta();
      res.status(200).send({ error: false, personas: resultado_socios });
    } catch (error) {
      console.log("servlet_socios.js -> obtener_socios_alta", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Se ha producido un error" });
    }
  });
}

function obtener_socios_baja(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let resultado_socios = await socios.obtener_socios_baja();
      res.status(200).send({ error: false, personas: resultado_socios });
    } catch (error) {
      console.log("servlet_socios -> obtener_socios_baja", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Se ha producido un error" });
    }
  });
}

function obtener_socio(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_persona = req.params.nid_persona;
      let resultado_socio = await socios.obtener_socio(nid_persona);
      res.status(200).send({ error: false, socio: resultado_socio });
    } catch (error) {
      console.log("servlet_socios.js -> obtener_socio", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Se ha producido un error" });
    }
  });
}

function obtener_alumnos_sin_socio(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      const ultimo_curso = await gestorCurso.obtener_ultimo_curso();
      const alumnos_sin_socio =
        await socios.obtener_alumnos_sin_socio(ultimo_curso);
      res
        .status(200)
        .send({ error: false, alumnos_sin_socio: alumnos_sin_socio });
    } catch (error) {
      console.log("servlet_socios.js -> obtener_alumnos_sin_socio", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Se ha producido un error" });
    }
  });
}

function obtener_socios_sin_forma_pago(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      const socios_sin_forma_pago =
        await socios.obtener_socios_sin_forma_pago();
      res
        .status(200)
        .send({ error: false, socios_sin_forma_pago: socios_sin_forma_pago });
    } catch (error) {
      console.log("servlet_socios.js -> obtener_socios_sin_forma_pago", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Se ha producido un error" });
    }
  });
}

module.exports.registrar_socio = registrar_socio;
module.exports.actualizar_socio = actualizar_socio;
module.exports.obtener_socios = obtener_socios;
module.exports.obtener_socios_alta = obtener_socios_alta;
module.exports.obtener_socios_baja = obtener_socios_baja;
module.exports.obtener_socio = obtener_socio;
module.exports.obtener_alumnos_sin_socio = obtener_alumnos_sin_socio;
module.exports.obtener_socios_sin_forma_pago = obtener_socios_sin_forma_pago;
