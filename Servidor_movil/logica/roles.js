const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("./base_datos.js");

async function obtenerRoles(nid_usuario) {
  try {
    const sql =
      "SELECT r.* FROM " +
      constantes.ESQUEMA +
      ".roles r, " +
      constantes.ESQUEMA +
      ".usuarios u where r.nid_rol = u.nid_rol" +
      " and u.nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los roles: " + error.message);
    throw new Error("Error al obtener los roles");
  }
}

module.exports.obtenerRoles = obtenerRoles;
