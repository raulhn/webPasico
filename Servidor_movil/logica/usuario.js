const conexion = require("../conexion.js");
const bcrypt = require("bcrypt");
const constantes = require("../constantes.js");

function existUsuario(correoElectronico) {
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

async function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correoElectronico,
  password
) {
  try {
    const saltRounds = 10; // Número de rondas de sal para bcrypt
    let bExiste = await existUsuario(correoElectronico);
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
          "VALUES (" +
          conexion.dbConn.escape(nombre) +
          ", " +
          conexion.dbConn.escape(primerApellido) +
          ", " +
          conexion.dbConn.escape(segundoApellido) +
          ", " +
          conexion.dbConn.escape(correoElectronico) +
          ", " +
          conexion.dbConn.escape(hash) +
          ")";

        conexion.dbConn.query(query, (error, results) => {
          if (error) {
            console.error("Error al registrar el usuario:", error);
            reject("Error al reigistrar el usuario");
          } else {
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

module.exports.registrarUsuario = registrarUsuario;
