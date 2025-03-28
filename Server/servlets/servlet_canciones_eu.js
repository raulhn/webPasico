const canciones_eu = require("../logica/canciones_eu.js");
const servlet_comprobaciones = require("./servlet_comun.js");

function obtener_canciones(req, res) {
  servlet_comprobaciones.comprobaciones(req, res, async () => {
    let resultado = await canciones_eu.obtener_canciones();
    res.status(200).send({ error: false, canciones: resultado });
  });
}

function obtener_votaciones(req, res) {
  servlet_comprobaciones.comprobaciones(req, res, async () => {
    let resultado = await canciones_eu.obtener_votaciones();
    res.status(200).send({ error: false, votaciones: resultado });
  });
}

module.exports.obtener_canciones = obtener_canciones;
module.exports.obtener_votaciones = obtener_votaciones;
