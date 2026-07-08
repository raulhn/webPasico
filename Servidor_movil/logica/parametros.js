const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function obtener_valor(p_nombre) {
  try {
    const sql =
      "select nombre, valor from " +
      constantes.ESQUEMA +
      ".parametros " +
      "where nombre = " +
      conexion.dbConn.escape(p_nombre);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.error("Error al obtener el valor del parámetro: ", error);
    throw new Error("Error al obtener el valor del parámetro");
  }
}

async function actualizar_valor(p_nombre, p_valor) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".parametros " +
      "set valor = " +
      conexion.dbConn.escape(p_valor) +
      " where nombre = " +
      conexion.dbConn.escape(p_nombre);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el valor del parámetro: ", error);
    throw new Error("Error al actualizar el valor del parámetro");
  }
}

module.exports.obtener_valor = obtener_valor;
module.exports.actualizar_valor = actualizar_valor;
