const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function insertarEventoConcierto(
  nombre,
  descripcion,
  fecha_evento,
  hora,
  tipo_evento,
  publicado,
  vestimenta,
  lugar,
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".evento_concierto (nombre, descripcion, fecha_evento, hora, tipo_evento, publicado, vestimenta, lugar) " +
      "values(" +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(fecha_evento) +
      ", " +
      conexion.dbConn.escape(hora) +
      ", " +
      conexion.dbConn.escape(tipo_evento) +
      ", " +
      conexion.dbConn.escape(publicado) +
      ", " +
      conexion.dbConn.escape(vestimenta) +
      ", " +
      conexion.dbConn.escape(lugar) +
      ")";

    console.log("eventoConcierto.js - insertarEventoConcierto -> SQL: " + sql);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, results) => {
        if (err) {
          console.log(
            "eventoConcienrot.js - insertarEventoConcierot -> Error: " + err,
          );
          conexion.dbConn.rollback();
          reject("Error al insertar el evento de concierto");
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
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
  hora,
  tipo_evento,
  publicado,
  vestimenta,
  lugar,
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
      ", vestimenta = " +
      conexion.dbConn.escape(vestimenta) +
      ", lugar = " +
      conexion.dbConn.escape(lugar) +
      ",hora = " +
      conexion.dbConn.escape(hora) +
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

function eliminarEvento(nid_evento_concierto) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evento_concierto SET borrado = 'S' WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.log("eventoConcierto.js - eliminarEvento -> Error: " + err);
          conexion.dbConn.rollback();
          reject("Error al eliminar el evento de concierto");
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
      ".evento_concierto where borrado = 'N' " +
      " ORDER BY fecha_evento DESC, nid_evento_concierto DESC";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - obtenerEventosConcierto -> Error: " + err,
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
      conexion.dbConn.escape(nid_evento_concierto) +
      " and borrado = 'N'";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - obtenerInforEventoConcierto -> Error: " + err,
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
          "eventoConcierto.js - registrar_partitura_evento -> Error: " + err,
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
          "eventoConcierto.js - eliminar_partitura_evento -> Error: " + err,
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
      ".partituras p  " +
      " left join " +
      constantes.ESQUEMA +
      ".categoria_partitura cp on p.nid_categoria = cp.nid_categoria " +
      " where pe.nid_partitura = p.nid_partitura " +
      "and pe.nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - obtenerPartiturasEvento -> Error: " + err,
        );
        reject("Error al obtener las partituras del evento de concierto");
      } else {
        resolve(result);
      }
    });
  });
}

function obtenerEventosConciertoRangoFecha(fecha_inicio, fecha_fin, publicado) {
  const sql =
    "select ev.nid_evento_concierto nid_evento, nombre, fecha_evento fecha, descripcion, publicado, vestimenta, lugar, 'Concierto' tipo, hora from " +
    constantes.ESQUEMA +
    ".evento_concierto ev where fecha_evento between " +
    conexion.dbConn.escape(fecha_inicio) +
    " and " +
    conexion.dbConn.escape(fecha_fin) +
    (publicado ? " and publicado = 'S' " : " ") +
    " and borrado = 'N'";
  (" order by fecha_evento desc");

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "eventoConcierto.js - obtenerEventosConciertoRangoFecha -> Error: " +
            err,
        );
        reject(
          "Error al obtener los eventos de concierto en el rango de fechas",
        );
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
          "eventoConcierto.js - existePartituraEvento -> Error: " + err,
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
module.exports.eliminarEvento = eliminarEvento;
module.exports.obtenerEventosConcierto = obtenerEventosConcierto;
module.exports.obtenerEventoConcierto = obtenerEventoConcierto;

module.exports.registrar_partitura_evento = registrar_partitura_evento;
module.exports.eliminar_partitura_evento = eliminar_partitura_evento;
module.exports.obtenerPartiturasEvento = obtenerPartiturasEvento;
module.exports.obtenerEventosConciertoRangoFecha =
  obtenerEventosConciertoRangoFecha;
module.exports.existePartituraEvento = existePartituraEvento;
