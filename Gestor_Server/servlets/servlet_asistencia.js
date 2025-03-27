const comun = require("./servlet_comun.js");
const asistencia = require("../logica/asistencia.js");

function registrar_evento(req, res) {
  comun.comprobaciones(req, res, async () => {
    let descripcion = req.descripcion;
    await asistencia.registrar_evento_asistencia(descripcion);

    res.status(200).send({ error: false, message: "Evento registrado" });
  });
}

function registrar_asistencias(req, res) {
  comun.comprobaciones(req, res, async () => {});
}

module.exports.registrar_evento = registrar_evento;
