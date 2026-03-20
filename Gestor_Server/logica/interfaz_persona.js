const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function obtener_persona_nombre_insert(
  nombre,
  primer_apellido,
  segundo_apellido,
) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where nombre <> " +
    conexion.dbConn.escape(nombre) +
    " and primer_apellido = '" +
    conexion.dbConn.escape(primer_apellido) +
    " and segundo_apellido = '" +
    conexion.dbConn.escape(segundo_apellido) +
    " and estado = " +
    constantes.ESTADOS_INTERFAZ.INSERTAR;
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        reject("Error al recuperar la persona");
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
}

module.exports.obtener_persona_nombre_insert = obtener_persona_nombre_insert;
