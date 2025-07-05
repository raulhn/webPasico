const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function obtener_trimestre(nid_trimestre) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".trimestre where nid_trimestre = " +
        conexion.dbConn.escape(nid_trimestre),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function obtener_trimestres_sucios() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " + constantes.ESQUEMA_BD + ".trimestre where sucio = 'S'",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function actualizar_trimestre_sucio(nid_trimestre, sucio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".trimestre set sucio = " +
          conexion.dbConn.escape(sucio) +
          " where nid_trimestre = " +
          conexion.dbConn.escape(nid_trimestre),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(error);
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

module.exports.obtener_trimestre = obtener_trimestre;
module.exports.obtener_trimestres_sucios = obtener_trimestres_sucios;
module.exports.actualizar_trimestre_sucio = actualizar_trimestre_sucio;
