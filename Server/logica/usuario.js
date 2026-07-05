const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const gestion_base_datos = require("./base_datos.js");

const bcrypt = require("bcryptjs");
const rondas = 10;

function esLogueado(usuario) {
  if (!usuario) {
    return false;
  } else {
    return true;
  }
}

async function esAdministrador(usuario) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(usuario) +
      " and rol = " +
      constantes.ROL_ADMINISTRADOR;
    const results = await gestion_base_datos.consulta(sql);
    if (results.length <= 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("usaurio.js -> esAdministrador:", error);
    throw new Error("Error al comprobar si es administrador");
  }
}

async function login(usuario, password) {
  try {
    const sql =
      "select pass from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(usuario);
    const results = await gestion_base_datos.consulta(sql);
    if (results.length <= 0) {
      return false;
    } else {
      let passHash = results[0].pass;
      const coinciden = await bcrypt.compare(password, passHash);
      return coinciden;
    }
  } catch (error) {
    console.log("usaurio.js -> login:", error);
    throw new Error("Error al comprobar el login");
  }
}

async function obtener_usuarios() {
  try {
    const sql = "select * from " + constantes.ESQUEMA_BD + ".usuario";
    const results = await gestion_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("usaurio.js -> obtener_usuarios:", error);
    throw new Error("Error al obtener usuarios");
  }
}

function hashPassword(pass, saltRounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pass, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

async function async_actualizar_password(user, pass) {
  try {
    let bExiste = await existe_login(user);
    if (bExiste) {
      const saltRounds = 9;
      const hash = hashPassword(pass, saltRounds);
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".usuario set pass = " +
        conexion.dbConn.escape(hash) +
        " where usuario = " +
        conexion.dbConn.escape(user);

      await gestion_base_datos.actualiza(sql);
    } else {
      console.log("El usuario no existe");
      throw new Error("El usuario no existe");
    }
  } catch (error) {
    console.log("Error en async_actualizar_password: " + error);
    throw new Error("Error al actualizar la contraseña");
  }
}

async function actualizar_password(user, pass) {
  try {
    await async_actualizar_password(user, pass);
    return;
  } catch (error) {
    console.log("Error en actualizar_password: " + error);
    throw new Error("Error al actualizar la contraseña");
  }
}

async function existe_login(user) {
  try {
    const sql =
      "select count(*) nCont from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(user);
    const results = await gestion_base_datos.consulta(sql);
    if (results.length < 1 || results.length > 1) {
      return false;
    } else {
      return results[0].nCont > 0;
    }
  } catch (error) {
    console.log("usuario.js -> existe_login:", error);
    throw new Error("Error al comprobar si existe el login");
  }
}

async function registrar(usuario, password) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".usuario(usuario, pass) values(" +
      conexion.dbConn.escape(usuario) +
      ", " +
      conexion.dbConn.escape(password) +
      ")";
    await gestion_base_datos.actualiza(sql);
  } catch (error) {
    console.log("usuario.js -> registrar:", error);
    throw new Error("Error al registrar el usuario");
  }
}

module.exports.esAdministrador = esAdministrador;
module.exports.login = login;
module.exports.obtener_usuarios = obtener_usuarios;
module.exports.esLogueado = esLogueado;
module.exports.actualizar_password = actualizar_password;
module.exports.existe_login = existe_login;
module.exports.registrar = registrar;
