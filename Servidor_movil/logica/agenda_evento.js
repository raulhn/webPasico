const constantes = require("../constantes");
const conexion = require("../conexion");

function registrarAgendaEvento(nombre, descripcion, fecha) {
  const sql =
    "insert into " +
    constantes.ESQUEMA +
    ".agenda_eventos (nombre, descripcion, fecha) " +
    " values (" +
    conexion.dbConn.escape(nombre) +
    ", " +
    conexion.dbConn.escape(descripcion) +
    ", " +
    conexion.dbConn.escape(fecha) +
    ")";

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.log("Error al insertar el evento de la agenda: ", error);
          conexion.dbConn.rollback();
          reject(new Error("Error al insertar el evento de la agenda"));
        } else {
          conexion.dbConn.commit();
          console.log("Evento de la agenda insertado correctamente");
          resolve();
        }
      });
    });
  });
}

function actualizarAgendaEvento(nid_evento, nombre, descripcion, fecha) {
  const sql =
    "update " +
    constantes.ESQUEMA +
    ".agenda_eventos set nombre = " +
    conexion.dbConn.escape(nombre) +
    ", descripcion = " +
    conexion.dbConn.escape(descripcion) +
    ", fecha = " +
    conexion.dbConn.escape(fecha) +
    " where nid_agenda_evento = " +
    conexion.dbConn.escape(nid_evento);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.log("Error al actualizar el evento de la agenda: ", error);
          conexion.dbConn.rollback();
          reject(new Error("Error al actualizar el evento de la agenda"));
        } else {
          conexion.dbConn.commit();
          console.log("Evento de la agenda actualizado correctamente");
          resolve();
        }
      });
    });
  });
}

function recuperarEventos(bPublicos) {
  let sql =
    "select nid_agenda_evento, nombre, descripcion, fecha " +
    "from " +
    constantes.ESQUEMA +
    ".agenda_eventos ";

  if (bPublicos) {
    sql += "where publico = 'S' ";
  }

  sql += "order by fecha desc";

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("Error al recuperar los eventos de la agenda: ", error);
        reject(new Error("Error al recuperar los eventos de la agenda"));
      } else {
        console.log("Eventos de la agenda recuperados correctamente");
        resolve(results);
      }
    });
  });
}

function eliminarAgendaEvento(nid_evento) {
  const sql =
    "update " +
    constantes.ESQUEMA +
    ".agenda_eventos set borrado = 'S' where " +
    "nid_agenda_evento = " +
    conexion.dbConn.escape(nid_evento);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.log("Error al eliminar el evento de la agenda: ", error);
          conexion.dbConn.rollback();
          reject(new Error("Error al eliminar el evento de la agenda"));
        } else {
          conexion.dbConn.commit();
          console.log("Evento de la agenda eliminado correctamente");
          resolve();
        }
      });
    });
  });
}

module.exports.registrarAgendaEvento = registrarAgendaEvento;
module.exports.actualizarAgendaEvento = actualizarAgendaEvento;
module.exports.recuperarEventos = recuperarEventos;
module.exports.eliminarAgendaEvento = eliminarAgendaEvento;
