const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestion_base_datos = require("../gestion_base_datos.js");

async function obtiene_parametro(identificador) {
  try {
    const sql =
      "select valor from " +
      constantes.ESQUEMA_BD +
      ".parametros where identificador = " +
      conexion.dbConn.escape(identificador);

    const results = await gestion_base_datos.ejecuta_sql(sql);
    return results[0];
  } catch (error) {
    console.log("parametro.js: Error en obtiene_parametro: " + error);
    throw new Error("Error al obtener el parametro");
  }
}

module.exports.obtiene_parametro = obtiene_parametro;
