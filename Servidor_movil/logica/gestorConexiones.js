const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

async function asyncReegistrarConexion(token, resolve, reject) {
  let bExsiste = await existeConexion(token);
  let numeroConexiones = await numConexiones();
  if (numeroConexiones > constantes.MAX_CONEXIONES) {
    console.error("Se ha alcanzado el número máximo de conexiones.");
    reject("Se ha alcanzado el número máximo de conexiones.");
  } else {
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
}

function actualizarTokenUsuario(token, nidUsuario) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "UPDATE " +
        constantes.ESQUEMA +
        ".conexiones set nid_usuario = " +
        conexion.dbConn.escape(nidUsuario) +
        " WHERE token = " +
        conexion.dbConn.escape(token),
      (error, results) => {
        if (error) {
          console.error("Error al actualizar el token del usuario:", error);
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

function obtenerTokenUsuario(nidUsuario) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "SELECT token FROM " +
        constantes.ESQUEMA +
        ".conexiones WHERE nid_usuario = " +
        conexion.dbConn.escape(nidUsuario),
      (error, results) => {
        if (error) {
          console.error("Error al obtener el token del usuario:", error);
          reject(error);
        } else if (results.length > 0) {
          resolve(results[0].token);
        } else {
          resolve(null); // No se encontró el token
        }
      }
    );
  });
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

function numConexiones() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "SELECT COUNT(*) as numConexiones FROM " +
        constantes.ESQUEMA +
        ".conexiones",
      (error, results) => {
        if (error) {
          console.error("Error al contar las conexiones:", error);
          reject(error);
        } else {
          resolve(results[0].numConexiones);
        }
      }
    );
  });
}

module.exports.registrarConexion = registrarConexion;
module.exports.actualizarTokenUsuario = actualizarTokenUsuario;
module.exports.obtenerTokenUsuario = obtenerTokenUsuario;
