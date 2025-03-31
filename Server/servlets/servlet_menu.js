const menu = require("../logica/menu.js");
const servlet_usuario = require("../servlets/servlet_usuarios.js");
const gestion_usuarios = require("../logica/usuario.js");

function obtener_menu(req, res) {
  let id_menu = req.params.id;
  menu
    .obtiene_menu(id_menu)
    .then(function (resultado) {
      return res.status(200).send({
        error: false,
        padre: id_menu,
        data: resultado,
        message: "Lista de menu",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send({ message: "Error" });
    });
}

function obtener_titulo_menu(req, res) {
  let id_menu = req.params.id;
  menu
    .obtiene_titulo(id_menu)
    .then((vTitulo) => {
      return res
        .status(200)
        .send({ error: false, titulo: vTitulo, id: id_menu });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).send({ message: "Error" });
    });
}

function add_menu(req, res) {
  let titulo = req.body.titulo;
  let padre = req.body.padre;

  let tipo_pagina = req.body.tipo_pagina;
  let enlace = req.body.enlace;

  if (servlet_usuario.esLogueado(req.session.nombre)) {
    let login_sesion = req.session.nombre;

    gestion_usuarios
      .esAdministrador(login_sesion)
      .then(function (bAdministrador) {
        if (bAdministrador) {
          menu
            .registrar_menu(titulo, padre, tipo_pagina, enlace)
            .then(function (bResultado) {
              if (bResultado) {
                return res
                  .status(200)
                  .send({ error: false, message: "Menu creado" });
              }
              return res.status(400).send({ error: true, message: "Error" });
            });
        }
      });
  }
}

function eliminar_menu(req, res) {
  let id_menu = req.body.id_menu;
  gestion_usuarios
    .esAdministrador(req.session.nombre)
    .then((bEsAdministrador) => {
      if (bEsAdministrador) {
        menu
          .eliminar_menu(id_menu)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Página eliminada" });
          })
          .catch(() => {
            return res
              .status(200)
              .send({ error: true, message: "Ha ocurrido algún error" });
          });
      }
    });
}

function actualizar_titulo_menu(req, res) {
  let id_menu = req.body.id_menu;
  let titulo = req.body.titulo;
  gestion_usuarios
    .esAdministrador(req.session.nombre)
    .then((bEsAdministrador) => {
      if (bEsAdministrador) {
        menu.actualizar_titulo_menu(id_menu, titulo).then(() => {
          return res
            .status(200)
            .send({ error: false, message: "Titulo actualizado" });
        });
      }
    });
}

function obtener_url(req, res) {
  let id_menu = req.params.id;
  menu
    .obtiene_url_menu(id_menu)
    .then((url_relativa) => {
      return res
        .status(200)
        .send({ error: false, id_menu: id_menu, url: url_relativa });
    })
    .catch(() => {
      return res.status(200).send({ error: true });
    });
}

module.exports.obtener_menu = obtener_menu;
module.exports.obtener_titulo_menu = obtener_titulo_menu;
module.exports.add_menu = add_menu;
module.exports.eliminar_menu = eliminar_menu;
module.exports.actualizar_titulo_menu = actualizar_titulo_menu;
module.exports.obtener_url = obtener_url;
