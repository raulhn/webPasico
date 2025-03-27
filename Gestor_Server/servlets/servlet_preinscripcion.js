const constantes = require("../constantes.js");
const preinscripcion = require("../logica/preinscripcion.js");
const comun = require("./servlet_comun.js");

function obtener_preinscripciones(req, res) {
  comun.comprobaciones(req, res, async () => {
    let resultados = await preinscripcion.obtener_preinscripciones();

    res.status(200).send({ error: false, preinscripciones: resultados });
  });
}

function obtener_preinscripciones_detalle(req, res) {
  comun.comprobaciones(req, res, async () => {
    let nid_preinscripcion = req.params.nid_preinscripcion;
    let resultados = await preinscripcion.obtener_preinscripciones_detalle(
      nid_preinscripcion
    );

    res.status(200).send({ error: false, preinscripciones: resultados });
  });
}

module.exports.obtener_preinscripciones = obtener_preinscripciones;
module.exports.obtener_preinscripciones_detalle =
  obtener_preinscripciones_detalle;
