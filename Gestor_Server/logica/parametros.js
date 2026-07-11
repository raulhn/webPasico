const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function obtener_valor(p_nombre) {
  try {
    const sql =
      "select nombre, valor from " +
      constantes.ESQUEMA_BD +
      ".parametros " +
      "where nombre = " +
      conexion.dbConn.escape(p_nombre);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log(
      "parametro.js -> obtener_valor: Error en obtener_valor: " + error,
    );
    throw new Error("Error en obtener_valor: " + error);
  }
}

async function actualizar_valor(p_nombre, p_valor) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".parametros " +
      "set valor = " +
      conexion.dbConn.escape(p_valor) +
      " where nombre = " +
      conexion.dbConn.escape(p_nombre);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log(
      "parametro.js -> actualizar_valor: Error en actualizar_valor: " + error,
    );
    throw new Error("Error en actualizar_valor: " + error);
  }
}

module.exports.obtener_valor = obtener_valor;
module.exports.actualizar_valor = actualizar_valor;
