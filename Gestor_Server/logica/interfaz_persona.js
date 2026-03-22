const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function obtener_persona_nif_insert(nif, lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where dni = " +
    conexion.dbConn.escape(nif) +
    " and operacion = " +
    conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
    " and lote = " +
    conexion.dbConn.escape(lote) +
    " and dni <> ''";

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
    " and operacion = " +
    conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
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
    " and operacion = " +
    conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
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

function obtener_conflictos_personas(nid_interfaz_persona) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_conflictos_persona where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log(
          "interfaz_persona -> obtener_conflictos_personas: Error al obtener_conflictos_personas para ",
          nid_interfaz_persona,
        );
        reject("Error al obtener los conflictos de personas");
      } else {
        resolve(results);
      }
    });
  });
}

function obtener_interfaz_personas(lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        reject("Se ha producido un error al recuperar el interfaz de persona");
      } else {
        resolve(results);
      }
    });
  });
}

function actualizar_operacion_conflicto(
  nid_interfaz_persona,
  operacion,
  nid_persona,
) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona set operacion = " +
    conexion.dbConn.escape(operacion) +
    ", nid_persona = " +
    conexion.dbConn.escape(nid_persona) +
    " where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.log("Error al iniciar la transacción:", err);
        reject("Error al iniciar la transacción");
        return;
      }

      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log(
            "interfaz_persona -> actualizar_operacion_conflicto: Error al actualizar la operación del conflicto para ",
            nid_interfaz_persona,
            " a ",
            operacion,
            " con nid_persona ",
            nid_persona,
            ":",
            error,
          );
          conexion.dbConn.rollback();
          reject("Error al actualizar la operación del conflicto");
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

module.exports.obtener_persona_nif_insert = obtener_persona_nif_insert;
module.exports.obtener_persona_nombre_insert = obtener_persona_nombre_insert;
module.exports.obtener_persona_apellidos_insert =
  obtener_persona_apellidos_insert;
module.exports.obtener_conflictos_personas = obtener_conflictos_personas;
module.exports.obtener_interfaz_personas = obtener_interfaz_personas;
module.exports.actualizar_operacion_conflicto = actualizar_operacion_conflicto;
