const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function insertarEventoConcierto(
  nombre,
  descripcion,
  fecha_evento,
  tipo_evento,
  publicado
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".evento_concierto (nombre, descripcion, fecha_evento, tipo_evento, publicado) " +
      "values(" +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(fecha_evento) +
      ", " +
      conexion.dbConn.escape(tipo_evento) +
      ", " +
      conexion.dbConn.escape(publicado) +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.log(
            "eventoConcienrot.js - insertarEventoConcierot -> Error: " + err
          );
          conexion.dbConn.rollback();
          reject("Error al insertar el evento de concierto");
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

function actualizarEvento(
  nid_evento_concierto,
  nombre,
  descripcion,
  fecha_evento,
  tipo_evento,
  publicado
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evento_concierto SET nombre = " +
      dbConn.escape(nombre) +
      ", descripcion = " +
      dbConn.escape(descripcion) +
      ", fecha_evento = " +
      dbConn.escape(fecha_evento) +
      ", tipo_evento = " +
      dbConn.escape(tipo_evento) +
      ", publicado = " +
      dbConn.escape(publicado) +
      " WHERE nid_evento_concierto = " +
      dbConn.escape(nid_evento_concierto);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.log("eventoConcierto.js - actualizarEvento -> Error: " + err);
          conexion.dbConn.rollback();
          reject("Error al actualizar el evento de concierto");
        } else {
          dbConn.commit();
          conexion.resolve();
        }
      });
    });
  });
}

function obtenerEventosConcierto() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evento_concierto ORDER BY fecha_evento DESC";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - obtenerEventosConcierto -> Error: " + err
        );
        reject("Error al obtener los eventos de concierto");
      } else {
        resolve(result);
      }
    });
  });
}

module.exports.insertarEventoConcierto = insertarEventoConcierto;
module.exports.actualizarEvento = actualizarEvento;
module.exports.obtenerEventosConcierto = obtenerEventosConcierto;
