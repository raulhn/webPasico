const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function insertarEventoConcierto(
  nombre,
  descripcion,
  fecha_evento,
  hora,
  tipo_evento,
  publicado,
  vestimenta,
  lugar,
) {
  try {
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

    const result = await gestor_base_datos.actualiza(sql);
    return result.insertId;
  } catch (error) {
    console.error("Error al insertar el evento de concierto:", error);
    throw new Error("Error al insertar el evento de concierto");
  }
}

async function actualizarEventoConcierto(
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
  try {
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

    const result = await gestor_base_datos.actualiza(sql);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el evento de concierto:", error);
    throw new Error("Error al actualizar el evento de concierto");
  }
}

async function eliminarEvento(nid_evento_concierto) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evento_concierto SET borrado = 'S' WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    const result = await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al eliminar el evento de concierto:", error);
    throw new Error("Error al eliminar el evento de concierto");
  }
}

async function obtenerEventosConcierto() {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evento_concierto where borrado = 'N' " +
      " and date(fecha_evento) >= date(now()) " +
      " ORDER BY fecha_evento DESC, nid_evento_concierto DESC";
    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener los eventos de concierto:", error);
    throw new Error("Error al obtener los eventos de concierto");
  }
}

async function obtenerEventoConcierto(nid_evento_concierto) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evento_concierto WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto) +
      " and borrado = 'N'";

    const result = await gestor_base_datos.consulta(sql);
    if (result.length === 0) {
      throw new Error("Evento de concierto no encontrado");
    }
    return result[0];
  } catch (error) {
    console.error(
      "Error al obtener la información del evento de concierto:",
      error,
    );
    throw new Error("Error al obtener la información del evento de concierto");
  }
}

async function obtenerEvento(nid_evento_concierto, bPublico) {
  try {
    const sql =
      "select nid_evento_concierto nid_evento, nombre, descripcion, fecha_evento fecha, hora, publicado, 'Banda' tipo " +
      "from " +
      constantes.ESQUEMA +
      ".evento_concierto where nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto) +
      (bPublico ? " and publicado = 'S' " : " ") +
      " and borrado = 'N'";

    const result = await gestor_base_datos.consulta(sql);

    if (result.length === 0) {
      throw new Error("Evento de concierto no encontrado");
    } else {
      return result[0];
    }
  } catch (error) {
    console.error(
      "Error al obtener la información del evento de concierto:",
      error,
    );
    throw new Error("Error al obtener la información del evento de concierto");
  }
}

async function registrar_partitura_evento(nid_evento_concierto, nid_partitura) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".partituras_evento (nid_evento_concierto, nid_partitura) " +
      "VALUES (" +
      conexion.dbConn.escape(nid_evento_concierto) +
      ", " +
      conexion.dbConn.escape(nid_partitura) +
      ")";

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error(
      "Error al registrar la partitura en el evento de concierto:",
      error,
    );
    throw new Error(
      "Error al registrar la partitura en el evento de concierto",
    );
  }
}

async function eliminar_partitura_evento(nid_evento_concierto, nid_partitura) {
  try {
    const sql =
      "DELETE FROM " +
      constantes.ESQUEMA +
      ".partituras_evento WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto) +
      " AND nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error(
      "Error al eliminar la partitura del evento de concierto:",
      error,
    );
    throw new Error("Error al eliminar la partitura del evento de concierto");
  }
}

async function obtenerPartiturasEvento(nid_evento_concierto) {
  try {
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

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error(
      "Error al obtener las partituras del evento de concierto:",
      error,
    );
    throw new Error("Error al obtener las partituras del evento de concierto");
  }
}

async function obtenerEventosConciertoRangoFecha(
  fecha_inicio,
  fecha_fin,
  publicado,
) {
  try {
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

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error(
      "Error al obtener los eventos de concierto en el rango de fechas:",
      error,
    );
    throw new Error(
      "Error al obtener los eventos de concierto en el rango de fechas",
    );
  }
}

async function existePartituraEvento(nid_evento_concierto, nid_partitura) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".partituras_evento WHERE nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto) +
      " AND nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    const result = await gestor_base_datos.consulta(sql);
    return result.length > 0;
  } catch (error) {
    console.error(
      "Error al verificar la existencia de la partitura en el evento:",
      error,
    );
    throw new Error(
      "Error al verificar la existencia de la partitura en el evento",
    );
  }
}

module.exports.insertarEventoConcierto = insertarEventoConcierto;
module.exports.actualizarEventoConcierto = actualizarEventoConcierto;
module.exports.eliminarEvento = eliminarEvento;
module.exports.obtenerEventosConcierto = obtenerEventosConcierto;
module.exports.obtenerEvento = obtenerEvento;
module.exports.obtenerEventoConcierto = obtenerEventoConcierto;

module.exports.registrar_partitura_evento = registrar_partitura_evento;
module.exports.eliminar_partitura_evento = eliminar_partitura_evento;
module.exports.obtenerPartiturasEvento = obtenerPartiturasEvento;
module.exports.obtenerEventosConciertoRangoFecha =
  obtenerEventosConciertoRangoFecha;
module.exports.existePartituraEvento = existePartituraEvento;
