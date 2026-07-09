const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos");

async function tiene_direccion(nid_persona) {
  try {
    const sql =
      "select count(*) num from " +
      constantes.ESQUEMA_BD +
      ".persona where nid_direccion is not null and nid_direccion <> '' " +
      " and nid = " +
      conexion.dbConn.escape(nid_persona);
    const results = await gestor_base_datos.consulta(sql);
    if (results[0]["num"] < 1) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al comprobar si la persona tiene dirección");
  }
}

async function obtiene_nid_direccion(nid_persona) {
  try {
    const sql =
      "select nid_direccion from " +
      constantes.ESQUEMA_BD +
      ".persona where nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      throw new Error("No se encontró la persona");
    }
    return results[0]["nid_direccion"];
  } catch (error) {
    console.log("Error al obtener el nid_direccion de la persona", error);
    throw new Error("Error al obtener el nid_direccion de la persona");
  }
}

async function registrar_direccion_persona(nid_persona, nid_direccion) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".persona set nid_direccion = " +
      conexion.dbConn.escape(nid_direccion) +
      " where nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al registrar la dirección de la persona", error);
    throw new Error("Error al registrar la dirección de la persona");
  }
}

async function registrar_direccion(
  nid_persona,
  direccion,
  municipio,
  provincia,
  codigo_postal,
  numero,
  puerta,
  escalera,
  planta,
) {
  try {
    let bExiste = await tiene_direccion(nid_persona);
    if (!bExiste) {
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".direccion(direccion, municipio, provincia, codigo_postal, numero, puerta, escalera, planta) values(" +
        conexion.dbConn.escape(direccion) +
        ", " +
        conexion.dbConn.escape(municipio) +
        ", " +
        conexion.dbConn.escape(provincia) +
        ", " +
        conexion.dbConn.escape(codigo_postal) +
        ", " +
        conexion.dbConn.escape(numero) +
        ", " +
        conexion.dbConn.escape(puerta) +
        ", " +
        conexion.dbConn.escape(escalera) +
        ", " +
        conexion.dbConn.escape(planta) +
        ")";

      const results = gestor_base_datos.actualiza(sql);
      await registrar_direccion_persona(nid_persona, results.insertId);

      return results.insertId;
    } else {
      let nid_direccion = await obtiene_nid_direccion(nid_persona);
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".direccion set " +
        "direccion = " +
        conexion.dbConn.escape(direccion) +
        ", " +
        "municipio = " +
        conexion.dbConn.escape(municipio) +
        ", " +
        "provincia = " +
        conexion.dbConn.escape(provincia) +
        ", " +
        "codigo_postal = " +
        conexion.dbConn.escape(codigo_postal) +
        ", " +
        "numero = " +
        conexion.dbConn.escape(numero) +
        ", " +
        "puerta = " +
        conexion.dbConn.escape(puerta) +
        ", " +
        "escalera = " +
        conexion.dbConn.escape(escalera) +
        ", " +
        "planta = " +
        conexion.dbConn.escape(planta) +
        " where nid_direccion = " +
        conexion.dbConn.escape(nid_direccion);

      const results = await gestor_base_datos.actualiza(sql);
      return nid_direccion;
    }
  } catch (error) {
    console.log("Error al registrar la dirección: ", error);
    throw new Error("Error al registrar la dirección");
  }
}

async function obtener_direccion(nid_persona) {
  try {
    const sql =
      "select d.* from " +
      constantes.ESQUEMA_BD +
      ".direccion d, " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where d.nid_direccion = p.nid_direccion and p.nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      throw new Error("No se encontró la dirección para la persona");
    }
    return results[0];
  } catch (error) {
    console.log("Error al obtener la dirección: ", error);
    throw new Error("Error al obtener la dirección");
  }
}

module.exports.registrar_direccion = registrar_direccion;
module.exports.obtener_direccion = obtener_direccion;
