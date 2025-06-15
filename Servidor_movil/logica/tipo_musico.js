const conexion = require("../conexion");
const constantes = require("../constantes");

function insertarTipoMusico(descripcion) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".tipo_musico (descripcion) VALUES (" +
      conexion.dbConn.escape(descripcion) +
      ")";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al insertar el tipo de músico:", err);
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
}

function actualizarTipoMusico(nid_tipo_musico, descripcion) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".tipo_musico SET descripcion = " +
      conexion.dbConn.escape(descripcion) +
      " WHERE nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al actualizar el tipo de músico:", err);
        reject(err);
      } else {
        resolve(result.affectedRows);
      }
    });
  });
}

function existeTipoMusico(nid_tipo_musico) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".tipo_musico WHERE nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error(
          "Error al verificar la existencia del tipo de músico:",
          err
        );
        reject(err);
      } else {
        resolve(result[0].count > 0);
      }
    });
  });
}

async function registrarTipoMusico(nid_tipo_musico, descripcion) {
  try {
    const existe = await existeTipoMusico(nid_tipo_musico);
    if (existe) {
      return await actualizarTipoMusico(nid_tipo_musico, descripcion);
    } else {
      return await insertarTipoMusico(descripcion);
    }
  } catch (error) {
    console.error("Error al registrar el tipo de músico:", error);
    throw error;
  }
}

module.exports.registrarTipoMusico = registrarTipoMusico;
