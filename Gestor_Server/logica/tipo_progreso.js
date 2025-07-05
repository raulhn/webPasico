const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function obtener_tipo_progreso(nid_tipo_progreso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".tipo_progreso where nid_tipo_progreso = " +
        conexion.dbConn.escape(nid_tipo_progreso),
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

function obtener_tipos_progreso_sucios() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".tipo_progreso where sucio = 'S'",
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

function actualizar_tipo_progreso_sucio(nid_tipo_progreso, sucio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".tipo_progreso set sucio = " +
          conexion.dbConn.escape(sucio) +
          " where nid_tipo_progreso = " +
          conexion.dbConn.escape(nid_tipo_progreso),
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

module.exports.obtener_tipo_progreso = obtener_tipo_progreso;
module.exports.obtener_tipos_progreso_sucios = obtener_tipos_progreso_sucios;
module.exports.actualizar_tipo_progreso_sucio = actualizar_tipo_progreso_sucio;
