const servletComun = require("../servlets/servlet_comun.js");
const menu = require("../logica/menu.js");

function addMenu(req, res) {
  servletComun.comprobacionesLogin(req, res, async () => {
    const titulo = req.body.titulo;
    const padre = req.body.padre;
    const tipoPagina = req.body.tipo_pagina;
    const enlace = req.body.enlace;

    await menu.registrarMenu(titulo, padre, tipoPagina, enlace);
    res.status(200).send({ error: false, message: "Menu creado" });
  });
}

async function obtenerMenu(req, res) {
  try {
    const idMenu = req.params.id;
    const resultado = await menu.obtenerMenu(idMenu);
    return res
      .status(200)
      .send({
        error: false,
        padre: idMenu,
        data: resultado,
        message: "Lista de menu",
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: true, message: "Error al obtener el menu" });
  }
}

async function obtenerTitulo(req, res) {
  try {
    const idMenu = req.params.id;

    await menu.obtenerTitulo(idMenu);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: true, message: "Error al obtener el titulo del menu" });
  }
}

async function eliminarMenu(req, res) {
  servletComun.comprobacionesLogin(req, res, async () => {
    const idMenu = req.body.id_menu;
    await menu.eliminarMenu(idMenu);
    res.status(200).send({ error: false, message: "Menu eliminado" });
  });
}

async function actualizarTituloMenu(req, res) {
  servletComun.comprobacionesLogin(req, res, async () => {
    const idMenu = req.body.id_menu;
    const titulo = req.body.titulo;
    await menu.actualizarTituloMenu(idMenu, titulo);
    res.status(200).send({ error: false, message: "Menu actualizado" });
  });
}

module.exports.addMenu = addMenu;
module.exports.obtenerMenu = obtenerMenu;
module.exports.obtenerTitulo = obtenerTitulo;
module.exports.eliminarMenu = eliminarMenu;
module.exports.actualizarTituloMenu = actualizarTituloMenu;
