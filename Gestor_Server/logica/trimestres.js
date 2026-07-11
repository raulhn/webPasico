const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function obtener_trimestre(nid_trimestre) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".trimestre where nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre);
    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log("Error al obtener trimestre: ", error);
    throw new Error("Error al obtener el trimestre");
  }
}

async function obtener_trimestres() {
  try {
    const sql =
      "select * from " + constantes.ESQUEMA_BD + ".trimestre";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener trimestres: ", error);
    throw new Error("Error al obtener los trimestres");
  }
}

async function obtener_trimestres_sucios() {
  try {
    const sql =
      "select * from " + constantes.ESQUEMA_BD + ".trimestre where sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener trimestres sucios: ", error);
    throw new Error("Error al obtener los trimestres sucios");
  }
}

async function actualizar_trimestre_sucio(nid_trimestre, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".trimestre set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log("Error al actualizar trimestre: ", error);
    throw new Error("Error al actualizar el trimestre");
  }
}

module.exports.obtener_trimestre = obtener_trimestre;
module.exports.obtener_trimestres = obtener_trimestres;
module.exports.obtener_trimestres_sucios = obtener_trimestres_sucios;
module.exports.actualizar_trimestre_sucio = actualizar_trimestre_sucio;