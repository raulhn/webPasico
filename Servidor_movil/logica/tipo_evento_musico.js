const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_base_datos = require("./base_datos.js");

function registrar_tipo_evento_musico(nid_evento_concierto, nid_tipo_musico) {
  try {
    const instrunccionsql =
      "insert into " +
      constantes.ESQUEMA +
      ".tipo_evento_musico(nid_evento_concierto, nid_tipo_musico) " +
      "values(" +
      conexion.dbConn.escape(nid_evento_concierto) +
      ", " +
      conexion.dbConn.escape(nid_tipo_musico) +
      ")";

    const results = gestor_base_datos.actualiza(instrunccionsql);
    return results;
  } catch (error) {
    console.log(
      "tipo_evento_musico.js -> registrar_tipo_evento_musico: " + error,
    );
    throw new Error("Se ha producio un error al asociar el tipo al evento");
  }
}

async function obtener_tipos_evento(nid_evento_concierto) {
  try {
    const instruccionSql =
      "select ec.*, tm.descripcion, tm.nid_tipo_musico " +
      "from " +
      constantes.ESQUEMA +
      ".evento_concierto ec, " +
      constantes.ESQUEMA +
      ".tipo_musico tm, " +
      constantes.ESQUEMA +
      ".tipo_evento_musico tem " +
      "where tm.nid_tipo_musico = tem.nid_tipo_musico " +
      "and ec.nid_evento_concierto = tem.nid_evento_concierto " +
      "and tem.nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    const results = await gestor_base_datos.consulta(instruccionSql);
    return results;
  } catch (error) {
    console.log("tipo_evento_musico.js -> obtener_tipos_eventro: " + error);
    throw new Error("Error al obtener los tipos de evento");
  }
}

async function eliminar_tipo_evento_musico(
  nid_evento_concierto,
  nid_tipo_musico,
) {
  try {
    const instruccionSql =
      "delete from " +
      constantes.ESQUEMA +
      ".tipo_evento_musico  " +
      " where nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto) +
      "   and nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico);

    const results = await gestor_base_datos.actualiza(instruccionSql);
    return results;
  } catch (error) {
    console.log(
      "tipo_evento_musico.js -> eliminar_tipo_evento_musico: " + error,
    );
    throw new Error("Se ha producido un error al eliminar el tipo de evento");
  }
}

async function eliminar_tipos_evento_musico(nid_evento_concierto) {
  try {
    const instruccionSql =
      "delete from " +
      constantes.ESQUEMA +
      ".tipo_evento_musico  " +
      " where nid_evento_concierto = " +
      conexion.dbConn.escape(nid_evento_concierto);

    const results = await gestor_base_datos.actualiza(instruccionSql);
    return results;
  } catch (error) {
    console.log(
      "tipo_evento_musico.js -> eliminar_tipos_evento_musico: " + error,
    );
    throw new Error("Se ha producido un error al eliminar los tipos de evento");
  }
}

module.exports.registrar_tipo_evento_musico = registrar_tipo_evento_musico;
module.exports.obtener_tipos_evento = obtener_tipos_evento;
module.exports.eliminar_tipo_evento_musico = eliminar_tipo_evento_musico;
module.exports.eliminar_tipos_evento_musico = eliminar_tipos_evento_musico;
