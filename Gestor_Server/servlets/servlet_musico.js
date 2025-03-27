const musico = require("../logica/musico.js");
const comun = require("./servlet_comun.js");

async function obtener_instrumentos(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultado = await musico.obtener_instrumentos();
    res.status(200).send({ error: false, instrumentos: resultado });
  });
}

async function obtener_instrumentos_filtro(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultado = await musico.obtener_instrumentos_filtro();
    res.status(200).send({ error: false, instrumentos: resultado });
  });
}

async function obtener_musicos(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultado = await musico.obtener_musicos();
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
    let resultado = await musico.obtener_personas_instrumento(nid_instrumento);
    res.status(200).send({ error: false, personas: resultado });
  });
}

async function obtener_tipo_musicos(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultado = await musico.obtener_tipo_musicos();
    res.status(200).send({ error: false, tipo_musicos: resultado });
  });
}

module.exports.obtener_instrumentos = obtener_instrumentos;
module.exports.obtener_instrumentos_filtro = obtener_instrumentos_filtro;

module.exports.obtener_musicos = obtener_musicos;
module.exports.registrar_musico = registrar_musico;
module.exports.eliminar_instrumento_musico = eliminar_instrumento_persona;
module.exports.obtener_personas_instrumento = obtener_personas_instrumento;

module.exports.obtener_tipo_musicos = obtener_tipo_musicos;
