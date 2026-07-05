const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("../base_datos");

async function registrarAgendaEvento(
  nombre,
  descripcion,
  fecha,
  hora,
  publicado,
) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".agenda_evento (nombre, descripcion, fecha, hora, publicado) " +
      " values (" +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(fecha) +
      ", " +
      conexion.dbConn.escape(hora) +
      ", " +
      conexion.dbConn.escape(publicado) +
      ")";

    await gestor_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.log("Error al registrar el evento de la agenda: ", error);
    throw new Error("Error al registrar el evento de la agenda");
  }
}

async function actualizarAgendaEvento(
  nid_evento,
  nombre,
  descripcion,
  fecha,
  hora,
  publicado,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".agenda_evento set nombre = " +
      conexion.dbConn.escape(nombre) +
      ", descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", fecha = " +
      conexion.dbConn.escape(fecha) +
      ", publicado = " +
      conexion.dbConn.escape(publicado) +
      ", hora = " +
      conexion.dbConn.escape(hora) +
      " where nid_agenda_evento = " +
      conexion.dbConn.escape(nid_evento);

    await gestor_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.log("Error al actualizar el evento de la agenda: ", error);
    throw new Error("Error al actualizar el evento de la agenda");
  }
}

async function recuperarEventos(bPublicos) {
  try {
    let sql =
      "select nid_agenda_evento, nombre, descripcion, fecha, publicado " +
      "from " +
      constantes.ESQUEMA +
      ".agenda_evento ";

    if (bPublicos) {
      sql += "where publicado = 'S' ";
    }

    sql += "order by fecha desc";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al recuperar los eventos de la agenda: ", error);
    throw new Error("Error al recuperar los eventos de la agenda");
  }
}

async function recuperarEventosFecha(bPublicos, fecha) {
  try {
    let sql =
      "select nid_agenda_evento, nombre, descripcion, fecha, hora, publicado " +
      "from " +
      constantes.ESQUEMA +
      ".agenda_evento ";

    if (bPublicos) {
      sql += "where publicado = 'S' ";
      if (fecha) {
        sql += "and fecha = " + conexion.dbConn.escape(fecha) + " ";
      }
    } else {
      if (fecha) {
        sql += "where fecha = " + conexion.dbConn.escape(fecha) + " ";
      }
    }

    sql += "order by fecha desc";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al recuperar los eventos de la agenda: ", error);
    throw new Error("Error al recuperar los eventos de la agenda");
  }
}

async function recuperarEventosRangoFecha(bPublicos, fechaInicio, fechaFin) {
  try {
    let sql =
      "select nid_agenda_evento nid_evento, nombre, descripcion, fecha, 'Agenda' tipo, publicado, hora " +
      "from " +
      constantes.ESQUEMA +
      ".agenda_evento " +
      "where fecha between " +
      conexion.dbConn.escape(fechaInicio) +
      " and " +
      conexion.dbConn.escape(fechaFin) +
      " and borrado = 'N' ";

    if (bPublicos) {
      sql = sql + " and publicado = 'S' ";
    }

    sql = sql + "order by fecha desc";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al recuperar los eventos de la agenda: ", error);
    throw new Error("Error al recuperar los eventos de la agenda");
  }
}

async function recuperarEventosMes(bPublicos, mes, anio) {
  try {
    let sql =
      "select nid_agenda_evento, nombre, descripcion, fecha, MONTH(fecha) mes, YEAR(fecha) anio , publicado, hora " +
      "from " +
      constantes.ESQUEMA +
      ".agenda_evento " +
      "where MONTH(fecha) = " +
      conexion.dbConn.escape(mes) +
      " " +
      "and YEAR(fecha) = " +
      conexion.dbConn.escape(anio) +
      " and borrado = 'N' ";

    if (bPublicos) {
      sql = sql + " and publicado = 'S' ";
    }

    sql = sql + "order by fecha desc";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al recuperar los eventos de la agenda: ", error);
    throw new Error("Error al recuperar los eventos de la agenda");
  }
}

async function eliminarAgendaEvento(nid_evento) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".agenda_evento set borrado = 'S' where " +
      "nid_agenda_evento = " +
      conexion.dbConn.escape(nid_evento);

    await gestor_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.log("Error al eliminar el evento de la agenda: ", error);
    throw new Error("Error al eliminar el evento de la agenda");
  }
}

async function obtenerAgendaEvento(nid_agenda_evento, bPublicos) {
  try {
    const sql =
      "select nid_agenda_evento nid_evento, 'Agenda' tipo, nombre, descripcion, fecha, hora, publicado " +
      "from " +
      constantes.ESQUEMA +
      ".agenda_evento where nid_agenda_evento = " +
      conexion.dbConn.escape(nid_agenda_evento) +
      (bPublicos ? " and publicado = 'S' " : "") +
      " and borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log("Error al recuperar el evento de la agenda: ", error);
    throw new Error("Error al recuperar el evento de la agenda");
  }
}

module.exports.registrarAgendaEvento = registrarAgendaEvento;
module.exports.actualizarAgendaEvento = actualizarAgendaEvento;
module.exports.recuperarEventos = recuperarEventos;
module.exports.recuperarEventosFecha = recuperarEventosFecha;
module.exports.recuperarEventosRangoFecha = recuperarEventosRangoFecha;
module.exports.recuperarEventosMes = recuperarEventosMes;
module.exports.eliminarAgendaEvento = eliminarAgendaEvento;
module.exports.obtenerAgendaEvento = obtenerAgendaEvento;
