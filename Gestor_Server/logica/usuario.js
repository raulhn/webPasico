const constantes = require("../constantes.js");
const conexion = require("../conexion.js");

const bcrypt = require("bcryptjs");
const rondas = 10;

function obtener_usuarios() {
  return new Promise(function (resolve, reject) {
    conexion.dbConn.query(
      "select * from " + constantes.ESQUEMA_BD + ".usuario",
      function (error, results, fields) {
        if (error) {
          console.log(error);
          reject();
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
function obtener_pass(user) {
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
          reject();
        }
        if (results.length < 1 || results.length > 1) {
          reject();
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
 * @param {*} pass_hash
 * @returns
 */
async function comparar_pass(pass, pass_hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass, pass_hash, (err, coinciden) => {
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
    pass_hash = await obtener_pass(user);
    return await comparar_pass(pass, pass_hash);
  } catch (err) {
    return false;
  }
}

function existe_login(user) {
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
            reject();
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
      reject("Error al consultar login");
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
      (error, results, fileds) => {
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
      (error, results, fileds) => {
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

/**
 * Función que registra a un usuario nuevo con el rol por defecto de gestor
 * @param {*} user
 * @param {*} pass
 * @returns
 */
async function registrar_usuario(user, pass) {
  return new Promise(async (resolve, reject) => {
    bExiste = await existe_login(user);
    if (!bExiste) {
      const saltRounds = 15;
      conexion.dbConn.beginTransaction(() => {
        bcrypt.hash(pass, saltRounds, (err, hash) => {
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
  });
}

async function actualizar_password(user, pass) {
  return new Promise(async (resolve, reject) => {
    bExiste = await existe_login(user);
    if (bExiste) {
      const saltRounds = 9;
      conexion.dbConn.beginTransaction(() => {
        bcrypt.hash(pass, saltRounds, (err, hash) => {
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
    } else {
      reject();
    }
  });
}

function obtener_rol(user) {
  return new Promise(async (resolve, reject) => {
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
            resolve(results[0]["nid_rol"]);
          } else {
            reject("Usuario no encontrado");
          }
        }
      }
    );
  });
}

function obtener_nid_persona(user) {
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
            resolve(results[0]["nid_persona"]);
          } else {
            reject("Usuario no encontrado");
          }
        }
      }
    );
  });
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
