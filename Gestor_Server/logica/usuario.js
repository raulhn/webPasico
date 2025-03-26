const constantes = require("../constantes.js");
const conexion = require("../conexion.js");

const bcrypt = require("bcryptjs");

function obtenerUsuarios() {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "select * from " + constantes.ESQUEMA_BD + ".usuario",
      function (error, results, fields) {
        if (error) {
          console.log(error);
          reject(new Error("Error al obtener los usuarios"));
        }
        return resolve(results);
      }
    );
  });
}

/**
 * Dado un usuario se recupera su contraseña de base de datos
 * @param {*} user
 * @returns
 */
function obtenerPass(user) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select password from " +
        constantes.ESQUEMA_BD +
        ".usuario where usuario = " +
        conexion.dbConn.escape(user),
      function (error, results, fields) {
        console.log(error);
        console.log("results");
        console.log(results);
        if (error) {
          console.log(error);
          reject(new Error("Error"));
        }
        if (results.length < 1 || results.length > 1) {
          reject(new Error("Error"));
        } else {
          resolve(results[0].password);
        }
      }
    );
  });
}

/**
 * Compara la contraseña con la contraseña cifrada que esté almacenada en bd
 * @param {*} pass
 * @param {*} passHash
 * @returns
 */
async function compararPass(pass, passHash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, passHash, (err, coinciden) => {
      if (err) {
        console.log("Error comprobando:", err);
        resolve(false);
      } else {
        resolve(coinciden);
      }
    });
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
    const passHash = await obtenerPass(user);
    return await compararPass(pass, passHash);
  } catch (err) {
    return false;
  }
}

function existeLogin(user) {
  return new Promise((resolve, reject) => {
    try {
      conexion.dbConn.query(
        "select count(*) nCont from " +
          constantes.ESQUEMA_BD +
          ".usuario where usuario = " +
          conexion.dbConn.escape(user),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            reject(new Error("Error al consultar el login"));
          }
          if (results.length < 1 || results.length > 1) {
            resolve(false);
          } else {
            resolve(results[0].nCont > 0);
          }
        }
      );
    } catch (error) {
      console.log(error);
      reject(new Error("Error al consultar login"));
    }
  });
}

/**
 * Comprueba si el usuario tiene el rol de adminstrador
 * @param {*} user
 * @returns
 */
function esAdministrador(user) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) ncont from " +
        constantes.ESQUEMA_BD +
        ".usuario where usuario = " +
        conexion.dbConn.escape(user) +
        " and nid_rol = " +
        conexion.dbConn.escape(constantes.ROL_ADMINISTRADOR),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
        } else {
          resolve(results[0].ncont > 0);
        }
      }
    );
  });
}

function esProfesor(user) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) ncont from " +
        constantes.ESQUEMA_BD +
        ".usuario where usuario = " +
        conexion.dbConn.escape(user) +
        " and nid_rol = " +
        conexion.dbConn.escape(constantes.ROL_PROFESOR),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
        } else {
          resolve(results[0].ncont > 0);
        }
      }
    );
  });
}

async function asyncRegistrarUsuario(user, pass, resolve, reject) {
  const existe = await existeLogin(user);
  if (!existe) {
    const saltRounds = 15;
    conexion.dbConn.beginTransaction(() => {
      bcrypt.hash(pass, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
          reject(new Error("Error al registrar Usuario"));
        }
        conexion.dbConn.query(
          "insert into " +
            constantes.ESQUEMA_BD +
            ".usuario(usuario, password, nid_rol) values(" +
            conexion.dbConn.escape(user) +
            ", " +
            conexion.dbConn.escape(hash) +
            ", 2)",
          (error, results, fields) => {
            if (error) {
              conexion.dbConn.rollback();
              console.log(error);
              reject();
            } else {
              conexion.dbConn.commit();
              console.log("Usuario registrado");
              resolve();
            }
          }
        );
      });
    });
  }
}

/**
 * Función que registra a un usuario nuevo con el rol por defecto de gestor
 * @param {*} user
 * @param {*} pass
 * @returns
 */
async function registrarUsuario(user, pass) {
  return new Promise((resolve, reject) => {
    try {
      asyncRegistrarUsuario(user, pass, resolve, reject);
    } catch (error) {
      console.log(error);
      reject(new Error("Error al registrar usuario"));
    }
  });
}

async function asyncActualizarPassword(user, pass, resolve, reject) {
  const existe = await existeLogin(user);
  if (existe) {
    const saltRounds = 9;
    conexion.dbConn.beginTransaction(() => {
      bcrypt.hash(pass, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
          reject(new Error("Error al actualizar la contraseña"));
        }
        conexion.dbConn.query(
          "update " +
            constantes.ESQUEMA_BD +
            ".usuario set password = " +
            conexion.dbConn.escape(hash) +
            " where usuario = " +
            conexion.dbConn.escape(user),
          (error, results, fields) => {
            if (error) {
              conexion.dbConn.rollback();
              console.log(error);
              reject(new Error("Error al actualizar la contraseña"));
            } else {
              conexion.dbConn.commit();
              console.log("Usuario registrado");
              resolve();
            }
          }
        );
      });
    });
  } else {
    reject(new Error("Error al actualizarr la contraseña"));
  }
}

async function actualizarPassword(user, pass) {
  return new Promise((resolve, reject) => {
    try {
      asyncActualizarPassword(user, pass, resolve, reject);
    } catch (error) {
      console.log(error);
      reject(new Error("Error al registrar usuario"));
    }
  });
}

function obtenerRol(user) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid_rol from " +
        constantes.ESQUEMA_BD +
        ".usuario where usuario = " +
        conexion.dbConn.escape(user),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0].nid_rol);
          } else {
            reject(new Error("Usuario no encontrado"));
          }
        }
      }
    );
  });
}

function obtenerNidPersona(user) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid_persona from " +
        constantes.ESQUEMA_BD +
        ".persona_usuario where usuario = " +
        conexion.dbConn.escape(user),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0].nid_persona);
          } else {
            reject(new Error("Usuario no encontrado"));
          }
        }
      }
    );
  });
}

module.exports.login = login;
module.exports.existeLogin = existeLogin;
module.exports.obtenerUsuarios = obtenerUsuarios;
module.exports.registrarUsuario = registrarUsuario;
module.exports.esAdministrador = esAdministrador;
module.exports.esProfesor = esProfesor;
module.exports.actualizarPassword = actualizarPassword;
module.exports.obtenerRol = obtenerRol;
module.exports.obtenerNidPersona = obtenerNidPersona;
