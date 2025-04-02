const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

async function asyncReegistrarConexion(token, resolve, reject) {
  bExsiste = await existeConexion(token);

  if (!bExsiste) {
    conexion.dbConn.query(
      "INSERT INTO " +
        constantes.ESQUEMA +
        ".conexiones (token, fecha) " +
        "values (" +
        conexion.dbConn.escape(token) +
        ", sysdate() )",
      (error, results) => {
        if (error) {
          console.error("Error al registrar la conexión:", error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  } else {
    conexion.dbConn.query(
      "UPDATE " +
        constantes.ESQUEMA +
        ".conexiones SET fecha = sysdate() WHERE token = " +
        conexion.dbConn.escape(token),
      (error, results) => {
        if (error) {
          console.error("Error al actualizar la conexión:", error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  }
}

function registrarConexion(token) {
  return new Promise((resolve, reject) => {
    asyncReegistrarConexion(token, resolve, reject);
  });
}

function existeConexion(token) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "SELECT * FROM " +
        constantes.ESQUEMA +
        ".conexiones WHERE token = " +
        conexion.dbConn.escape(token),
      (error, results) => {
        if (error) {
          console.error("Error al verificar la conexión:", error);
          reject(error);
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
}

module.exports.registrarConexion = registrarConexion;
