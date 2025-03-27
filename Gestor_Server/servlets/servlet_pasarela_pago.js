const pasarela_pago = require("../logica/pasarela_pagos.js");
const servlet_comun = require("./servlet_comun.js");

function crear_usuario(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    let nid_persona = req.body.nid_persona;
    await pasarela_pago.crear_usuario(nid_persona);

    res.status(200).send({ error: false, message: "Usuario pasarela creado" });
  });
}

function crear_metodo_pago_cuenta_bancaria(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    let nid_forma_pago = req.body.nid_forma_pago;
    await pasarela_pago.crear_metodo_pago_cuenta_bancaria(nid_forma_pago);

    res.status(200).send({ error: false, message: "Método de pago creado" });
  });
}

function cobrar_pago(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    let nid_forma_pago = req.params.nid_forma_pago;
    let cantidad_pago = req.params.cantidad;

    let user_agent = req.headers["user-agent"];
    let ip_address = req.socket.remoteAddress;

    await pasarela_pago.cobrar_pago(
      nid_forma_pago,
      cantidad_pago,
      ip_address,
      user_agent
    );

    res.status(200).send({ error: false, message: "Cobro realizado" });
  });
}

function cobrar_remesa(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    let nid_remesa = req.body.nid_remesa;

    let user_agent = req.headers["user-agent"];
    let ip_address = req.socket.remoteAddress;

    await pasarela_pago.cobrar_remesa(nid_remesa, ip_address, user_agent);

    res.status(200).send({ error: false, message: "Cobro realizado" });
  });
}

function cobrar_lote(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    let nid_lote = req.body.nid_lote;

    let user_agent = req.headers["user-agent"];
    let ip_address = req.socket.remoteAddress;

    await pasarela_pago.cobrar_lote(nid_lote, ip_address, user_agent);

    res.status(200).send({ error: false, message: "Cobro de lote realizado" });
  });
}

module.exports.crear_usuario = crear_usuario;
module.exports.crear_metodo_pago_cuenta_bancaria =
  crear_metodo_pago_cuenta_bancaria;
module.exports.cobrar_pago = cobrar_pago;
module.exports.cobrar_remesa = cobrar_remesa;
module.exports.cobrar_lote = cobrar_lote;
