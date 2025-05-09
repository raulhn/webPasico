const conexion = require("../conexion.js");
const bcrypt = require("bcrypt");
const constantes = require("../constantes.js");
const validacionEmail = require("./validacionEmail.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const gestorSocios = require("./socios.js");
const gestorPersona = require("./persona.js");

function existeUsuario(correoElectronico) {
  return new Promise((resolve, reject) => {
    const query =
      "select count(*) num from " +
      constantes.ESQUEMA +
      ".usuarios where correo_electronico = " +
      conexion.dbConn.escape(correoElectronico);
    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al comprobar la existencia del usuario:", error);
        resolve(false);
      } else {
        resolve(results[0].num > 0);
      }
    });
  });
}

function existeUsuarioNid(nid_usuario) {
  return new Promise((resolve, reject) => {
    const query =
      "select count(*) num from " +
      constantes.ESQUEMA +
      ".usuarios where nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);
    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al comprobar la existencia del usuario:", error);
        resolve(false);
      } else {
        resolve(results[0].num > 0);
      }
    });
  });
}

async function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correoElectronico,
  password
) {
  try {
    const saltRounds = constantes.SALT_ROUNDS; // Número de rondas de sal para bcrypt
    let bExiste = await existeUsuario(correoElectronico);
    if (bExiste) {
      console.error("El usuario ya está registrado.");
      throw new Error("El usuario ya está registrado.");
    }
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        const query =
          "INSERT INTO " +
          constantes.ESQUEMA +
          ".usuarios (nombre, primer_apellido, segundo_apellido, correo_electronico, password) " +
          "VALUES (trim(" +
          conexion.dbConn.escape(nombre) +
          "), trim(" +
          conexion.dbConn.escape(primerApellido) +
          "), trim(" +
          conexion.dbConn.escape(segundoApellido) +
          "), trim(" +
          conexion.dbConn.escape(correoElectronico) +
          "), trim(" +
          conexion.dbConn.escape(hash) +
          "))";

        conexion.dbConn.query(query, async (error, results) => {
          if (error) {
            console.error("Error al registrar el usuario:", error);
            reject("Error al reigistrar el usuario");
          } else {
            await validacionEmail.enviarEmailValidacion(
              results.insertId,
              correoElectronico
            );
            resolve(results);
          }
        });
      });
    });
  } catch (error) {
    console.error("Error en el registro del usuario:", error.message);
    throw new Error(error);
  }
}

async function construirRoles(nid_usuario) {
  try {
    let roles = [];
    const persona = await gestorPersona.obtenerPersonaUsuario(nid_usuario);
    let esSocio = await gestorSocios.esSocio(persona.nid_persona);

    if (esSocio) {
      console.log("El usuario es socio.");
      roles.push({ rol: "SOCIO" });
    }

    return roles;
  } catch (error) {
    console.error("Error al construir los roles:", error.message);
    throw new Error("Error al construir los roles");
  }
}

function obtenerUsuario(nid_usuario) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT nid_usuario, nombre, primer_apellido, segundo_apellido, correo_electronico FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener el usuario:", error);
        reject(new Error("Error al obtener el usuario"));
      } else if (results.length > 0) {
        resolve(results[0]);
      } else {
        console.error("El usuario no existe.");
        reject(new Error("El usuario no existe."));
      }
    });
  });
}

function login(correoElectronico, password) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE correo_electronico = " +
      conexion.dbConn.escape(correoElectronico);
    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al comprobar la existencia del usuario:", error);
        reject(new Error("Error al realizar el login"));
      } else if (results.length > 0) {
        bcrypt.compare(password, results[0].password, (err, result) => {
          if (err) {
            console.error("Error al comparar las contraseñas:", err);
            reject(new Error("Error al realizar el login"));
          } else {
            if (!result) {
              console.error("La contraseña es incorrecta.");
              reject(new Error("La contraseña es incorrecta."));
            } else {
              resolve(results[0]);
            }
          }
        });
      } else {
        console.error("El usuario no existe.");
        reject(new Error("Error al realizar el login"));
      }
    });
  });
}

async function realizarLogin(correoElectronico, password) {
  try {
    const usuario = await login(correoElectronico, password);

    console.log("Usuario encontrado:", usuario);
    const sesion = jwt.sign(
      {
        nid_usuario: usuario.nid_usuario,
        correoElectronico: usuario.correo_electronico,
        nombre:
          usuario.nombre +
          " " +
          usuario.primer_apellido +
          " " +
          usuario.segundo_apellido,
      },
      process.env.SESSION_SECRET,
      {
        expiresIn: constantes.TIEMPO_ACCESS_TOKEN,
      }
    );

    const refreshToken = jwt.sign(
      { nid_usuario: usuario.nid_usuario },
      process.env.SESSION_SECRET,
      {
        expiresIn: constantes.TIEMPO_REFRESH_TOKEN,
      }
    );

    return {
      accessToken: sesion,
      refreshToken: refreshToken,
      usuario: {
        nid_usuario: usuario.nid_usuario,
        nombre: usuario.nombre,
        primer_apellido: usuario.primer_apellido,
        segundo_apellido: usuario.segundo_apellido,
        correoElectronico: usuario.correo_electronico,
      },
    };
  } catch (error) {
    console.error("Error en el inicio de sesión:", error.message);
    throw new Error(error.message);
  }
}

async function recuperarPassword(correoElectronico) {
  try {
    const saltRounds = constantes.SALT_ROUNDS; // Número de rondas de sal para bcrypt
    let obtenerUsuario = await existeUsuario(correoElectronico);
    return new Promise((resolve, reject) => {
      if (!obtenerUsuario) {
        console.error("El usuario no existe.");
        // Si el usuario no existe no se debe mostrar un mensaje de error
        resolve();
      } else {
        const token = crypto.randomBytes(6).toString("hex");

        bcrypt.hash(token, saltRounds, (err, hash) => {
          const query =
            "UPDATE " +
            constantes.ESQUEMA +
            ".usuarios SET password = " +
            conexion.dbConn.escape(hash) +
            " WHERE correo_electronico = " +
            conexion.dbConn.escape(correoElectronico);
          // Iniciar la transacción
          conexion.dbConn.beginTransaction((err) => {
            if (err) {
              console.error("Error al iniciar la transacción:", err);
              reject(new Error("Error al recuperar la contraseña"));
            }
            // Ejecutar la consulta de actualización
            conexion.dbConn.query(query, (error, results) => {
              if (error) {
                console.error("Error al actualizar el token:", error);
                conexion.dbConn.rollback();
                reject(new Error("Error al recuperar la contraseña"));
              } else {
                conexion.dbConn.commit();
                resolve(token);
              }
            });
          });
        });
      }
    });
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error.message);
    throw new Error("Error al recuperar la contraseña");
  }
}

function actualizarPassword(nid_usuario, password) {
  return new Promise((resolve, reject) => {
    const saltRounds = constantes.SALT_ROUNDS; // Número de rondas de sal para bcrypt
    bcrypt.hash(password, saltRounds, (err, hash) => {
      const query =
        "UPDATE " +
        constantes.ESQUEMA +
        ".usuarios SET password = " +
        conexion.dbConn.escape(hash) +
        " WHERE nid_usuario = " +
        conexion.dbConn.escape(nid_usuario);
      conexion.dbConn.query(query, (error, results) => {
        if (error) {
          console.error("Error al actualizar la contraseña:", error);
          reject(new Error("Error al actualizar la contraseña"));
        } else {
          resolve(results);
        }
      });
    });
  });
}

function realizarCambioPassword(nid_usuario, passwordActual, passwordNuevo) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);
    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al comprobar la existencia del usuario:", error);
        reject(new Error("Error al realizar el cambio de contraseña"));
      } else if (results.length > 0) {
        bcrypt.compare(passwordActual, results[0].password, (err, result) => {
          if (err) {
            console.error("Error al comparar las contraseñas:", err);
            reject(new Error("Error al realizar el cambio de contraseña"));
          } else if (result) {
            actualizarPassword(nid_usuario, passwordNuevo)
              .then(() => resolve())
              .catch((error) => reject(error));
          } else {
            console.error("La contraseña actual es incorrecta.");
            reject(new Error("La contraseña actual es incorrecta."));
          }
        });
      } else {
        console.error("El usuario no existe.");
        reject(new Error("Error al realizar el cambio de contraseña"));
      }
    });
  });
}

module.exports.existeUsuario = existeUsuario;
module.exports.existeUsuarioNid = existeUsuarioNid;
module.exports.registrarUsuario = registrarUsuario;
module.exports.realizarLogin = realizarLogin;
module.exports.construirRoles = construirRoles;
module.exports.obtenerUsuario = obtenerUsuario;
module.exports.recuperarPassword = recuperarPassword;
module.exports.realizarCambioPassword = realizarCambioPassword;
