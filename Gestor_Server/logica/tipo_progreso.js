const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function obtener_tipo_progreso(nid_tipo_progreso) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".tipo_progreso where nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso);
    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log("Error al obtener tipo progreso: ", error);
    throw new Error("Error al obtener el tipo de progreso");
  }
}

async function obtener_tipos_progreso_sucios() {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".tipo_progreso where sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener tipos de progreso sucios: ", error);
    throw new Error(
      "Error al obtener los tipos de progreso sucios"
    );
  }
}

async function actualizar_tipo_progreso_sucio(nid_tipo_progreso, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".tipo_progreso set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid_tipo_progreso = " +
      conexion.dbConn.escape(nid_tipo_progreso);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log("Error al actualizar tipo progreso: ", error);
    throw new Error("Error al actualizar el tipo de progreso");
  }
}

module.exports.obtener_tipo_progreso = obtener_tipo_progreso;
module.exports.obtener_tipos_progreso_sucios = obtener_tipos_progreso_sucios;
module.exports.actualizar_tipo_progreso_sucio = actualizar_tipo_progreso_sucio;