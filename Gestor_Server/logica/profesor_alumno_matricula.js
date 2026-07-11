const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("./base_datos.js");

async function obtener_profesor_alumno_matricula(nid_profesor_alumno_matricula) {
  try {
    const sql =
      "SELECT pam.nid nid_profesor_alumno_matricula, pam.nid_profesor, pam.nid_matricula_asignatura, " +
      " pam.fecha_alta, pam.fecha_baja, pam.fecha_actualizacion " +
      "FROM " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam " +
      "WHERE nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log(
      "profesor_alumno_matricula.js - obtener_profesor_alumno_matricula - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta");
  }
}

async function obtener_nid_profesor_alumno_matricula(nid_profesor, nid_matricula_asignatura) {
  try {
    const sql =
      "SELECT pam.nid as nid_profesor_alumno_matricula " +
      " FROM " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam " +
      " WHERE pam.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " AND pam.nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null;
    }
    return results[0]["nid_profesor_alumno_matricula"];
  } catch (error) {
    console.log(
      "profesor_alumno_matricula.js - obtener_nid_profesor_alumno_matricula - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta");
  }
}

async function actualizar_sucio(nid_profesor_alumno_matricula, sucio) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula SET sucio = " +
      conexion.dbConn.escape(sucio) +
      " WHERE nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log(
      "profesor_alumno_matricula.js - actualizar_sucio - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta");
  }
}

async function obtener_sucios() {
  try {
    const sql =
      "SELECT pam.* " +
      " FROM " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam " +
      " WHERE pam.sucio = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(
      "profesor_alumno_matricula.js - obtener_sucios - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta");
  }
}

async function cambiar_fecha_baja_profesor_alumno_matricula(nid_profesor_alumno_matricula, fecha_baja) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula SET fecha_baja = " +
      conexion.dbConn.escape(fecha_baja) +
      " WHERE nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log(
      "profesor_alumno_matricula.js - cambiar_fecha_baja_profesor_alumno_matricula - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta");
  }
}

async function cambiar_fecha_alta_profesor_alumno_matricula(nid_profesor_alumno_matricula, fecha_alta) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula SET fecha_alta = " +
      conexion.dbConn.escape(fecha_alta) +
      " WHERE nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log(
      "profesor_alumno_matricula.js - cambiar_fecha_alta_profesor_alumno_matricula - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta");
  }
}

module.exports.obtener_profesor_alumno_matricula =
  obtener_profesor_alumno_matricula;
module.exports.obtener_nid_profesor_alumno_matricula =
  obtener_nid_profesor_alumno_matricula;
module.exports.actualizar_sucio = actualizar_sucio;
module.exports.obtener_sucios = obtener_sucios;
module.exports.cambiar_fecha_baja_profesor_alumno_matricula =
  cambiar_fecha_baja_profesor_alumno_matricula;
module.exports.cambiar_fecha_alta_profesor_alumno_matricula =
  cambiar_fecha_alta_profesor_alumno_matricula;