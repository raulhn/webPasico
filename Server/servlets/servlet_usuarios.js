const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestionUsuarios = require("../logica/usuario.js");
const comun = require("../servlets/servlet_comun.js");

function actualizarPassword(req, res) {
  comun.comprobacionesLogin(req, res, async () => {
    const usuario = req.session.nombre;
    if (await gestionUsuarios.existeLogin(usuario)) {
      const password = req.body.password;
      await gestionUsuarios.actualizarPassword(usuario, password);
      res
        .status(200)
        .send({ error: false, message: "Actualización realizada" });
    } else {
      res.status(400).send({ error: true, message: "No existe el usuario" });
    }
  });
}

function obtenerUsuarios(req, res) {
  comun.comprobacionesLogin(req, res, async () => {
    const resultados = await gestionUsuarios.obtenerUsuarios();
    res.status(200).send({ error: false, usuarios: resultados });
  });
}

function esLogueado(req, res) {
  if (!esLogueado(req.session.nombre)) {
    res
      .status(200)
      .send({ logueado: false, message: "No hay usuario logueado" });
  } else {
    res
      .status(200)
      .send({
        logueado: true,
        usuario: req.session.nombre,
        message: "Usuario " + req.session.nombre,
      });
  }
}

function esLogueadoAdministrador(req, res) {
  comun.comprobacionesLogin(req, res, () => {
    return res
      .status(200)
      .send({
        error: false,
        administrador: true,
        message: "Usuario administrador",
      });
  });
}

function login(req, res) {
  const usuario = req.body.usuario;
  const password = req.body.pass;

  gestionUsuarios.login(usuario, password).then(function (bResultado) {
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

function logout(req, res) {
  comun.comprobacionesLogin(req, res, () => {
    req.session.destroy();
    res.status(200).send({ error: false, message: "Usuario deslogueado" });
  });
}

function registrar(req, res) {
  const usuario = req.body.usuario;
  const password = req.body.pass;

  conexion.dbConn.query(
    "insert into " +
      constantes.ESQUEMA_BD +
      ".usuario(usuario, pass) values(" +
      conexion.dbConn.escape(usuario) +
      ", " +
      conexion.dbConn.escape(password) +
      ")",
    function (error, results, field) {
      if (error) {
        console.log(error);
        return res.status(400).send({ message: "Error" });
      }
      return res.status(200).send({ message: "Usuario registrado" });
    }
  );
}

module.exports.actualizarPassword = actualizarPassword;
module.exports.obtenerUsuarios = obtenerUsuarios;

module.exports.esLogueado = esLogueado;
module.exports.esLogueadoAdministrador = esLogueadoAdministrador;
module.exports.login = login;
module.exports.logout = logout;
module.exports.registrar = registrar;
