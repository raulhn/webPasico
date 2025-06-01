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

function actualizarEventoConcierto(
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
      conexion.dbConn.escape(nombre) +
      ", descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", fecha_evento = " +
      conexion.dbConn.escape(fecha_evento) +
      ", tipo_evento = " +
      conexion.dbConn.escape(tipo_evento) +
      ", publicado = " +
      conexion.dbConn.escape(publicado) +
      " WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.log("eventoConcierto.js - actualizarEvento -> Error: " + err);
          conexion.dbConn.rollback();
          reject("Error al actualizar el evento de concierto");
        } else {
          conexion.dbConn.commit();
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
      ".evento_concierto ORDER BY fecha_evento DESC, nid_evento_concierto DESC";

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

function obtenerEventoConcierto(nid_evento_concierto) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evento_concierto WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - obtenerInforEventoConcierto -> Error: " + err
        );
        reject("Error al obtener la información del evento de concierto");
      } else {
        resolve(result[0]);
      }
    });
  });
}

function registrar_partitura_evento(nid_evento_concierto, nid_partitura) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".partituras_evento (nid_evento_concierto, nid_partitura) " +
      "VALUES (" +
      conexion.dbConn.escape(nid_evento_concierto) +
      ", " +
      conexion.dbConn.escape(nid_partitura) +
      ")";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - registrar_partitura_evento -> Error: " + err
        );
        reject("Error al registrar la partitura en el evento de concierto");
      } else {
        resolve(result);
      }
    });
  });
}

function eliminar_partitura_evento(nid_evento_concierto, nid_partitura) {
  return new Promise((resolve, reject) => {
    const sql =
      "DELETE FROM " +
      constantes.ESQUEMA +
      ".partituras_evento WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto) +
      " AND nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - eliminar_partitura_evento -> Error: " + err
        );
        reject("Error al eliminar la partitura del evento de concierto");
      } else {
        resolve(result);
      }
    });
  });
}

function obtenerPartiturasEvento(nid_evento_concierto) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.*, cp.nid_categoria, nombre_categoria FROM " +
      constantes.ESQUEMA +
      ".partituras_evento pe, " +
      constantes.ESQUEMA +
      ".categoria_partitura cp, " +
      constantes.ESQUEMA +
      ".partituras p where pe.nid_partitura = p.nid_partitura " +
      "and p.nid_categoria = cp.nid_categoria " +
      "and pe.nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - obtenerPartiturasEvento -> Error: " + err
        );
        reject("Error al obtener las partituras del evento de concierto");
      } else {
        resolve(result);
      }
    });
  });
}

function existePartituraEvento(nid_evento_concierto, nid_partitura) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".partituras_evento WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto) +
      " AND nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - existePartituraEvento -> Error: " + err
        );
        reject("Error al verificar la existencia de la partitura en el evento");
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

module.exports.insertarEventoConcierto = insertarEventoConcierto;
module.exports.actualizarEventoConcierto = actualizarEventoConcierto;
module.exports.obtenerEventosConcierto = obtenerEventosConcierto;
module.exports.obtenerEventoConcierto = obtenerEventoConcierto;

module.exports.registrar_partitura_evento = registrar_partitura_evento;
module.exports.eliminar_partitura_evento = eliminar_partitura_evento;
module.exports.obtenerPartiturasEvento = obtenerPartiturasEvento;
module.exports.existePartituraEvento = existePartituraEvento;
