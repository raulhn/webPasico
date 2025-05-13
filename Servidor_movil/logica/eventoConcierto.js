const dbConn = require("../conexion.js");
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
      dbConn.escape(nombre) +
      ", " +
      dbConn.escape(descripcion) +
      ", " +
      dbConn.escape(fecha_evento) +
      ", " +
      dbConn.escape(tipo_evento) +
      ", " +
      dbConn.escape(publicado) +
      ")";

    dbConn.beginTransaction(() => {
      dbConn.query(sql, (err, result) => {
        if (err) {
          console.log(
            "eventoConcienrot.js - insertarEventoConcierot -> Error: " + err
          );
          dbConn.rollback();
          reject("Error al insertar el evento de concierto");
        } else {
          dbConn.commit();
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

    dbConn.beginTransaction(() => {
      dbConn.query(sql, (err, result) => {
        if (err) {
          console.log("eventoConcierto.js - actualizarEvento -> Error: " + err);
          dbConn.rollback();
          reject("Error al actualizar el evento de concierto");
        } else {
          dbConn.commit();
          resolve();
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

    dbConn.query(sql, (err, result) => {
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
