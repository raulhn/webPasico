const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const gestor_base_datos = require("./base_datos.js");

const bcrypt = require("bcryptjs");
const rondas = 10;

async function obtener_usuarios() {
  try {
    const sql = "select * from " + constantes.ESQUEMA_BD + ".usuario";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener usuarios: ", error);
    throw new Error("Error al obtener usuarios");
  }
}

/**
 * Dado un usuario se recupera su contraseña de base de datos
 * @param {*} user
 * @returns
 */
async function obtener_pass(user) {
  try {
    const sql =
      "select password from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(user);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1 || results.length > 1) {
      throw new Error("Usuario no encontrado");
    } else {
      return results[0].password;
    }
  } catch (error) {
    console.log("Error al obtener contraseña: ", error);
    throw new Error("Error al obtener contraseña");
  }
}

/**
 * Compara la contraseña con la contraseña cifrada que esté almacenada en bd
 * @param {*} pass
 * @param {*} pass_hash
 * @returns
 */
async function comparar_pass(pass, pass_hash) {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.compare(pass, pass_hash, (err, coinciden) => {
        try {
          if (err) {
            console.log("Error comprobando:", err);
            resolve(false);
          } else {
            resolve(coinciden);
          }
        } catch (error) {
          console.log("Error en comparar_pass:", error);
          reject("Error al comparar password", error);
        }
      });
    } catch (error) {
      console.log("Error en comparar_pass:", error);
      reject("Error al comparar password", error);
    }
  });
}

/**
 * Comprueba que el usuario está registrado y la contraseña es correcta
 * @param {*} user
 * @param {*} pass
 * @returns Devuelve true en caso de que el usuario y la contraseña sea correcta, false en caso contrario
 */
async function login(user, pass) {
  try {
    pass_hash = await obtener_pass(user);
    return await comparar_pass(pass, pass_hash);
  } catch (err) {
    return false;
  }
}

async function existe_login(user) {
  try {
    const sql =
      "select count(*) nCont from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(user);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1 || results.length > 1) {
      return false;
    } else {
      return results[0].nCont > 0;
    }
  } catch (error) {
    console.log("Error al comprobar existencia de login: ", error);
    throw new Error("Error al comprobar existencia de login");
  }
}

/**
 * Comprueba si el usuario tiene el rol de adminstrador
 * @param {*} user
 * @returns
 */
async function esAdministrador(user) {
  try {
    const sql =
      "select count(*) ncont from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(user) +
      " and nid_rol = " +
      conexion.dbConn.escape(constantes.ROL_ADMINISTRADOR);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1 || results.length > 1) {
      return false;
    } else {
      return results[0].ncont > 0;
    }
  } catch (error) {
    console.log("Error al comprobar si es administrador: ", error);
    throw new Error("Error al comprobar si es administrador");
  }
}

async function esProfesor(user) {
  try {
    const sql =
      "select count(*) ncont from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(user) +
      " and nid_rol = " +
      conexion.dbConn.escape(constantes.ROL_PROFESOR);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1 || results.length > 1) {
      return false;
    } else {
      return results[0].ncont > 0;
    }
  } catch (error) {
    console.log("Error al comprobar si es profesor: ", error);
    throw new Error("Error al comprobar si es profesor");
  }
}

function hass_password(pass, rondas) {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.hash(pass, rondas, (err, hash) => {
        if (err) {
          console.log("Error al hashear la contraseña:", err);
          reject("Error al hashear la contraseña");
        } else {
          resolve(hash);
        }
      });
    } catch (error) {
      console.log("Error en hass_password:", error);
      reject("Error al hashear la contraseña");
    }
  });
}

/**
 * Función que registra a un usuario nuevo con el rol por defecto de gestor
 * @param {*} user
 * @param {*} pass
 * @returns
 */
async function registrar_usuario(user, pass) {
  try {
    bExiste = await existe_login(user);
    if (!bExiste) {
      const saltRounds = 15;
      const hash = await hass_password(pass, saltRounds);
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".usuario(usuario, password, nid_rol) values(" +
        conexion.dbConn.escape(user) +
        ", " +
        conexion.dbConn.escape(hash) +
        ", 2)";

      const results = await gestor_base_datos.actualiza(sql);
      return results.insertId;
    } else {
      throw new Error("El usuario ya existe");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el usuario");
  }
}

async function actualizar_password(user, pass) {
  try {
    let bExiste = await existe_login(user);
    if (bExiste) {
      const saltRounds = 15;
      const hash = await hass_password(pass, saltRounds);
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".usuario set password = " +
        conexion.dbConn.escape(hash) +
        " where usuario = " +
        conexion.dbConn.escape(user);
      const results = await gestor_base_datos.actualiza(sql);
      return results;
    } else {
      throw new Error("El usuario no existe");
    }
  } catch (error) {
    console.log("Error al actualizar la contraseña: ", error);
    throw new Error("Error al actualizar la contraseña");
  }
}

async function obtener_rol(user) {
  try {
    const sql =
      "select nid_rol from " +
      constantes.ESQUEMA_BD +
      ".usuario where usuario = " +
      conexion.dbConn.escape(user);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1 || results.length > 1) {
      throw new Error("Usuario no encontrado");
    } else {
      return results[0].nid_rol;
    }
  } catch (error) {
    console.log("Error al obtener rol: ", error);
    throw new Error("Error al obtener rol");
  }
}

async function obtener_nid_persona(user) {
  try {
    const sql =
      "select nid_persona from " +
      constantes.ESQUEMA_BD +
      ".persona_usuario where usuario = " +
      conexion.dbConn.escape(user);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1 || results.length > 1) {
      throw new Error("Usuario no encontrado");
    } else {
      return results[0].nid_persona;
    }
  } catch (error) {
    console.log("Error al obtener nid_persona: ", error);
    throw new Error("Error al obtener nid_persona");
  }
}

module.exports.login = login;
module.exports.existe_login = existe_login;
module.exports.obtener_usuarios = obtener_usuarios;
module.exports.registrar_usuario = registrar_usuario;
module.exports.esAdministrador = esAdministrador;
module.exports.esProfesor = esProfesor;
module.exports.actualizar_password = actualizar_password;
module.exports.obtener_rol = obtener_rol;
module.exports.obtener_nid_persona = obtener_nid_persona;
