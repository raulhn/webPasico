const constantes = require("../constantes");
const conexion = require("../conexion");

function obtenerRoles(nid_usuario) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT r.* FROM " +
      constantes.ESQUEMA +
      ".roles r, " +
      constantes.ESQUEMA +
      ".usuarios u where r.nid_rol = u.nid_rol" +
      " and u.nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    console.log("SQL: " + sql);
    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log("roles.js - obtenerRoles -> Error: " + err);
        reject("Error al obtener los roles");
      } else {
        resolve(result);
      }
    });
  });
}

module.exports.obtenerRoles = obtenerRoles;
