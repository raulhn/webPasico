const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");
const gestor_base_datos = require("./base_datos.js");

async function insertarSocio(
  nid_persona,
  fecha_alta,
  fecha_baja,
  num_socio,
  fecha_actualizacion,
) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".socios (nid_persona, fecha_alta, fecha_baja, num_socio, fecha_actualizacion) VALUES (" +
      conexion.dbConn.escape(nid_persona) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_alta)) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_baja)) +
      ", " +
      conexion.dbConn.escape(num_socio) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al insertar el socio: " + error.message);
    throw new Error("Error al insertar el socio");
  }
}

async function actualizarSocio(
  nid_persona,
  fecha_alta,
  fecha_baja,
  num_socio,
  fecha_actualizacion,
) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".socios SET fecha_alta = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_alta)) +
      ", fecha_baja = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_baja)) +
      ", num_socio = " +
      conexion.dbConn.escape(num_socio) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al actualizar el socio: " + error.message);
    throw new Error("Error al actualizar el socio");
  }
}

async function existeSocio(nid_persona) {
  try {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".socios WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const result = await gestor_base_datos.consulta(sql);
    return result[0].existe > 0;
  } catch (error) {
    console.error("Error al verificar la existencia del socio:", error);
    throw new Error("Error al verificar la existencia del socio");
  }
}

async function registrarSocio(
  nid_persona,
  fecha_alta,
  fecha_baja,
  num_socio,
  fecha_actualizacion,
) {
  try {
    let existe = await existeSocio(nid_persona);
    if (existe) {
      return await actualizarSocio(
        nid_persona,
        fecha_alta,
        fecha_baja,
        num_socio,
        fecha_actualizacion,
      );
    } else {
      return await insertarSocio(
        nid_persona,
        fecha_alta,
        fecha_baja,
        num_socio,
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al registrar el socio:", error);
    throw new Error("Error al registrar el socio");
  }
}

async function esSocio(nid_persona) {
  try {
    const sql =
      "SELECT COUNT(*) AS esSocio FROM " +
      constantes.ESQUEMA +
      ".socios WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results[0].esSocio > 0;
  } catch (error) {
    console.error("Error al verificar si es socio:", error);
    throw new Error("Error al verificar si es socio");
  }
}

async function obtenerSocio(nid_persona) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".socios WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.error("Error al obtener el socio:", error);
    throw new Error("Error al obtener el socio");
  }
}

module.exports.registrarSocio = registrarSocio;
module.exports.esSocio = esSocio;
module.exports.obtenerSocio = obtenerSocio;
