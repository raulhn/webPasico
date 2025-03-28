const gestion_usuarios = require("../logica/usuario.js");
const comun = require("../servlets/servlet_comun.js");

function actualizar_password(req, res) {
  comun.comprobaciones_login(req, res, async () => {
    let usuario = req.session.nombre;
    if (await gestion_usuarios.existe_login(usuario)) {
      let password = req.body.password;
      await gestion_usuarios.actualizar_password(usuario, password);
      res
        .status(200)
        .send({ error: false, message: "Actualización realizada" });
    } else {
      res.status(400).send({ error: true, message: "No existe el usuario" });
    }
  });
}

function esLogueado(usuario) {
  if (!usuario) {
    return false;
  } else {
    return true;
  }
}

function usuarios(req, res) {
  if (esLogueado(req.session.nombre)) {
    gestion_usuarios
      .esAdministrador(req.session.nombre)
      .then(function (bAdministrador) {
        if (bAdministrador) {
          gestion_usuarios
            .obtener_usuarios()
            .then(function (resultados) {
              return res.status(200).send({
                error: false,
                data: resultados,
                message: "Lista de usuarios",
              });
            })
            .catch(function () {
              return res.status(400).send({
                error: true,
                message: "Error al obtener la lista de usuarios",
              });
            });
        }
        return res.status(400).send({
          error: true,
          message: "Error al obtener la lista de usuarios",
        });
      })
      .catch(function () {
        return res.status(400).send({
          error: true,
          message: "Error al obtener la lista de usuarios",
        });
      });
  }
}

function logueado(req, res) {
  if (!esLogueado(req.session.nombre)) {
    res
      .status(200)
      .send({ logueado: false, message: "No hay usuario logueado" });
  } else {
    res.status(200).send({
      logueado: true,
      usuario: req.session.nombre,
      message: "Usuario " + req.session.nombre,
    });
  }
}

function logueado_administrador(req, res) {
  if (esLogueado(req.session.nombre)) {
    let usuario = req.session.nombre;
    gestion_usuarios.esAdministrador(usuario).then(function (bAdministrador) {
      if (bAdministrador) {
        return res.status(200).send({
          error: false,
          administrador: true,
          message: "Usuario administrador",
        });
      }
      return res.status(200).send({
        error: false,
        administrador: false,
        message: "No encontrado usuario",
      });
    });
  } else {
    return res.status(200).send({
      error: false,
      administrador: false,
      message: "No encontrado usuario",
    });
  }
}

function login(req, res) {
  let usuario = req.body.usuario;
  let password = req.body.pass;

  gestion_usuarios.login(usuario, password).then(function (bResultado) {
    if (bResultado) {
      req.session.nombre = usuario;
      return res
        .status(200)
        .send({ error: false, message: "Usuario logueado" });
    }
    return res
      .status(400)
      .send({ error: true, message: "El usuario o contraseña es incorrecta" });
  });
}

function registrar(req, res) {
  if (esLogueado(req.session.nombre)) {
    let usuario = req.session.nombre;
    gestion_usuarios.esAdministrador(usuario).then(function (bAdministrador) {
      if (bAdministrador) {
        let usuario = req.body.usuario;
        let password = req.body.pass;

        gestion_usuarios
          .registrar(usuario, password)
          .then(function (bResultado) {
            if (bResultado) {
              return res.status(200).send({
                error: false,
                message: "Usuario registrado correctamente",
              });
            }
            return res.status(400).send({
              error: true,
              message: "El usuario ya existe",
            });
          });
      }
    });
  }
}

module.exports.actualizar_password = actualizar_password;
module.exports.usuarios = usuarios;
module.exports.esLogueado = esLogueado;
module.exports.logueado = logueado;
module.exports.logueado_administrador = logueado_administrador;
module.exports.login = login;
module.exports.registrar = registrar;
