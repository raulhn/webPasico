const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function registrar_asistencia(nid_evento_asistencia, nid_persona) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".asistentes(nid_evento_asistencia, nid_persona) values(" +
      conexion.dbConn.escape(nid_evento_asistencia) +
      ", " +
      conexion.dbConn.escape(nid_persona) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("Error al registrar asistencia: ", error);
    throw new Error("Error al registrar asistencia");
  }
}

async function registrar_evento_asistencia(descripcion) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".evento_asistencia(descripcion, fecha) values(" +
      conexion.dbConn.escape(descripcion) +
      ", sysdate())";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("Error al registrar evento de asistencia: ", error);
    throw new Error("Error al registrar evento de asistencia");
  }
}

async function registrar_asistencias(descripcion, personas) {
  try {
    let nid_evento_asistencia = await registrar_evento_asistencia(descripcion);
    for (let i = 0; i < personas.length; i++) {
      await registrar_asistencia(nid_evento_asistencia, personas[i]);
    }
    return;
  } catch (error) {
    console.log("Error al registrar asistencias: " + error.message);

    throw new Error("Error al registrar asistencias");
  }
}

module.exports.registrar_asistencias = registrar_asistencias;
module.exports.registrar_evento_asistencia = registrar_evento_asistencia;
