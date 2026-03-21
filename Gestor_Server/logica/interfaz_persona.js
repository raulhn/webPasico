const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function obtener_persona_nif_insert(nif, lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where dni = " +
    conexion.dbConn.escape(nif) +
    " and estado = " +
    conexion.dbConn.escape(constantes.ESTADOS_INTERFAZ.INSERTAR) +
    " and lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("interfaz_persona -> obtener_persona_nif_insert", error);
        reject("Error al recuperar la persona por nif");
      } else {
        resolve(results);
      }
    });
  });
}
function obtener_persona_nombre_insert(
  nombre,
  primer_apellido,
  segundo_apellido,
  lote,
) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where nombre = " +
    conexion.dbConn.escape(nombre) +
    " and primer_apellido = " +
    conexion.dbConn.escape(primer_apellido) +
    " and segundo_apellido = " +
    conexion.dbConn.escape(segundo_apellido) +
    " and estado = " +
    conexion.dbConn.escape(constantes.ESTADOS_INTERFAZ.INSERTAR) +
    " and lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        reject("Error al recuperar la persona");
      } else {
        resolve(result);
      }
    });
  });
}

function obtener_persona_apellidos_insert(
  primer_apellido,
  segundo_apellido,
  lote,
) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where primer_apellido = " +
    conexion.dbConn.escape(primer_apellido) +
    " and segundo_apellido = " +
    conexion.dbConn.escape(segundo_apellido) +
    " and estado = " +
    conexion.dbConn.escape(constantes.ESTADOS_INTERFAZ.INSERTAR) +
    " and lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.log(
          "interfaz_persona -> obtener_persona_apellidos_insert:",
          err,
        );
        throw new Error("Error al recuperar las personas");
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.obtener_persona_nif_insert = obtener_persona_nif_insert;
module.exports.obtener_persona_nombre_insert = obtener_persona_nombre_insert;
module.exports.obtener_persona_apellidos_insert =
  obtener_persona_apellidos_insert;
