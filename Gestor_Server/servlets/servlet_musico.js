const musico = require("../logica/musico.js");
const comun = require("./servlet_comun.js");
const serviceMusicos = require("../services/serviceMusicos.js");

async function obtener_instrumentos(req, res) {
  comun.comprobaciones(req, res, async () => {
    resultado = await musico.obtener_instrumentos();
    res.status(200).send({ error: false, instrumentos: resultado });
  });
}

async function registrar_instrumento(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let descripcion = req.body.descripcion;

      await musico.registrar_instrumento(descripcion);
      res.status(200).send({
        error: false,
        message: "Instrumento registrado correctamente",
      });
    } catch (error) {
      console.error("Error al registrar instrumento:", error);
      res
        .status(400)
        .send({ error: true, message: "Error al registrar instrumento" });
    }
  });
}

async function actualizar_instrumento(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_instrumento = req.body.nid_instrumento;
      let descripcion = req.body.descripcion;

      await musico.actualizar_instrumento(nid_instrumento, descripcion);
      res.status(200).send({
        error: false,
        message: "Instrumento actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar instrumento:", error);
      res
        .status(400)
        .send({ error: true, message: "Error al actualizar instrumento" });
    }
  });
}

async function obtener_instrumentos_filtro(req, res) {
  comun.comprobaciones(req, res, async () => {
    resultado = await musico.obtener_instrumentos_filtro();
    res.status(200).send({ error: false, instrumentos: resultado });
  });
}

async function obtener_musicos(req, res) {
  comun.comprobaciones(req, res, async () => {
    resultado = await musico.obtener_musicos();
    res.status(200).send({ error: false, personas: resultado });
  });
}

async function registrar_musico(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_persona = req.body.nid_persona;
    let nid_instrumento = req.body.nid_instrumento;
    let nid_tipo_musico = req.body.nid_tipo_musico;

    await musico.registrar_instrumento_persona(
      nid_persona,
      nid_instrumento,
      nid_tipo_musico
    );
    res
      .status(200)
      .send({ error: false, message: "Se ha registrado correctamente" });
  });
}

async function eliminar_instrumento_persona(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_persona = req.body.nid_persona;
    let nid_instrumento = req.body.nid_instrumento;
    await musico.eliminar_instrumento_persona(nid_persona, nid_instrumento);
    res
      .status(200)
      .send({ error: false, message: "Se ha eliminado correctamente" });
  });
}

async function obtener_personas_instrumento(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_instrumento = req.params.nid_instrumento;
    resultado = await musico.obtener_personas_instrumento(nid_instrumento);
    res.status(200).send({ error: false, personas: resultado });
  });
}

async function obtener_tipo_musicos(req, res) {
  comun.comprobaciones(req, res, async () => {
    resultado = await musico.obtener_tipo_musicos();
    res.status(200).send({ error: false, tipo_musicos: resultado });
  });
}

function baja_musico(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      let nid_instrumento = req.body.nid_instrumento;
      let nid_tipo_musico = req.body.nid_tipo_musico;
      let fecha_baja = req.body.fecha_baja;

      await musico.baja_musico(
        nid_persona,
        nid_instrumento,
        nid_tipo_musico,
        fecha_baja
      );

      await musico.actualizar_sucio(nid_persona, "S");
      res
        .status(200)
        .send({ error: false, message: "Se ha dado de baja correctamente" });
    } catch (error) {
      console.error("Error en la función baja_musico:", error);
      res.status(400).send({ error: true, message: "Error al dar de baja" });
    }
  });
}

async function registrar_tipo_musico(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let descripcion = req.body.descripcion;

      await musico.registrar_tipo_musico(descripcion);
      res.status(200).send({
        error: false,
        message: "Tipo de músico registrado correctamente",
      });
    } catch (error) {
      console.error("Error al registrar tipo de músico:", error);
      res
        .status(400)
        .send({ error: true, message: "Error al registrar tipo de músico" });
    }
  });
}

async function actualizar_tipo_musico(req, res) {
  comun.comprobaciones(req, res, async () => {
    try {
      let nid_tipo_musico = req.body.nid_tipo_musico;
      let descripcion = req.body.descripcion;

      await musico.actualizar_tipo_musico(nid_tipo_musico, descripcion);
      res.status(200).send({
        error: false,
        message: "Tipo de músico actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar tipo de músico:", error);
      res
        .status(400)
        .send({ error: true, message: "Error al actualizar tipo de músico" });
    }
  });
}

module.exports.obtener_instrumentos = obtener_instrumentos;
module.exports.obtener_instrumentos_filtro = obtener_instrumentos_filtro;

module.exports.registrar_instrumento = registrar_instrumento;
module.exports.actualizar_instrumento = actualizar_instrumento;

module.exports.obtener_musicos = obtener_musicos;
module.exports.registrar_musico = registrar_musico;
module.exports.eliminar_instrumento_musico = eliminar_instrumento_persona;
module.exports.obtener_personas_instrumento = obtener_personas_instrumento;

module.exports.obtener_tipo_musicos = obtener_tipo_musicos;
module.exports.baja_musico = baja_musico;

module.exports.registrar_tipo_musico = registrar_tipo_musico;
module.exports.actualizar_tipo_musico = actualizar_tipo_musico;
