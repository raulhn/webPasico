const gestion_usuarios = require("../logica/usuario.js");
const comun = require("./servlet_comun.js");

/**
 * Función login, inicio de sesión por usuario y contraseña
 */
async function login(req, res) {
  let usu = req.body.usuario;
  let pass = req.body.password;

  let bresultado = await gestion_usuarios.login(usu, pass);
  if (bresultado) {
    req.session.nombre = usu;
    res.status(200).send({ error: false, message: "logueado" });
  } else {
    res.status(200).send({ error: true, message: "fallo" });
  }
}

/*
 * Función que indica si quien realiza la petición tiene una sesión abierta estando logueado
 */
function logueado(req, res) {
  let bEsLogueado;
  let usu;
  if (!req.session.nombre) {
    bEsLogueado = false;
    usu = undefined;
  } else {
    bEsLogueado = true;
    usu = req.session.nombre;
  }
  res.status(200).send({ logueado: bEsLogueado, login: usu });
}

/*
 * Función para cerrar la sesión de usuario
 */
function logout(req, res) {
  if (req.session.nombre) {
    req.session.destroy();
  }
  res.status(200).send({ error: false, message: "Logout relizado" });
}

/*
 * Función que indica si el usuario tiene el rol de administrador
 */
async function esAdministrador(user) {
  return await gestion_usuarios.esAdministrador(user);
}

/*
 * Función para registrar un nuevo usuario, es necesario que quien realice la petición este logueado
 * y que el usuario tenga permisos de administrador
 */
async function registrar_usuario(req, res) {
  if (req.session.nombre) {
    let usuario = req.session.nombre;
    let usu = req.body.usuario;
    let pass = req.body.password;

    let bEsAdministrador = await esAdministrador(usuario);

    if (!bEsAdministrador) {
      return res
        .status(401)
        .send({ error: true, message: "No está autorizado" });
    } else {
      try {
        await gestion_usuarios.registrar_usuario(usu, pass);
        res.status(200).send({ error: false, message: "Registro realizado" });
      } catch (err) {
        console.log(err);
        res.status(200).send({ error: true, message: err });
      }
    }
  } else {
    return res.status(401).send({ error: true, message: "No está autorizado" });
  }
}

/*
 * Función para actualizar la contraseña de un usuario
 */
async function actualizar_password_usu(req, res) {
  let usuario = req.session.nombre;
  if (await gestion_usuarios.existe_login(usuario)) {
    let usu = req.body.usuario;
    let pass = req.body.password;

    let bEsAdministrador = await esAdministrador(usuario);

    if (!bEsAdministrador) {
      return res
        .status(401)
        .send({ error: true, message: "No está autorizado" });
    } else {
      try {
        await gestion_usuarios.actualizar_password(usu, pass);
        res
          .status(200)
          .send({ error: false, message: "Actualización realizada" });
      } catch (err) {
        console.log(err);
        res.status(200).send({ error: true, message: err });
      }
    }
  } else {
    return res.status(401).send({ error: true, message: "No está autorizado" });
  }
}

function actualizar_password(req, res) {
  comun.comprobaciones_general(req, res, async () => {
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

/*
 * Recupera los usuarios registrados en la aplicación,
 * es neceasrio estar logueado con un usuario con rol de administrador
 * para obtener la lista de usuarios
 */
async function obtener_usuarios(req, res) {
  if (req.session.nombre) {
    let usuario = req.session.nombre;
    let bEsAdministrador = await esAdministrador(usuario);
    if (bEsAdministrador) {
      try {
        let resultados = await gestion_usuarios.obtener_usuarios();
        res.status(200).send({ error: false, usuarios: resultados });
      } catch (error) {
        res.status(500).send({ error: true, message: error });
      }
    } else {
      res.status(401).send({ error: true, message: "No está autorizado" });
    }
  } else {
    res.status(401).send({ error: true, message: "No está autorizado" });
  }
}

async function obtener_rol(req, res) {
  comun.comprobaciones_general(req, res, async () => {
    let usuario = req.session.nombre;

    let nid_rol = await gestion_usuarios.obtener_rol(usuario);

    res.status(200).send({ error: false, nid_rol: nid_rol });
  });
}

module.exports.login = login;
module.exports.logueado = logueado;
module.exports.logout = logout;
module.exports.registrar_usuario = registrar_usuario;
module.exports.actualizar_password_usu = actualizar_password_usu;
module.exports.actualizar_password = actualizar_password;
module.exports.obtener_usuarios = obtener_usuarios;

module.exports.obtener_rol = obtener_rol;
