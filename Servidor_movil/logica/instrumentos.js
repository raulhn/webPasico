const conexion = require("../conexion");
const constantes = require("../constantes");

function existeInstumento(nid_instrumento) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".instrumentos WHERE nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al verificar la existencia del instrumento:", err);
        reject(err);
      } else {
        resolve(result[0].existe > 0);
      }
    });
  });
}

function insertarInstrumento(nid_instrumento, descripcion) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".instrumentos (nid_instrumento, descripcion) VALUES (" +
      conexion.dbConn.escape(nid_instrumento) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ")";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al insertar el instrumento:", err);
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
}

function actualizarInstrumento(nid_instrumento, descripcion) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".instrumentos SET descripcion = " +
      conexion.dbConn.escape(descripcion) +
      " WHERE nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al actualizar el instrumento:", err);
        reject(err);
      } else {
        resolve(result.affectedRows);
      }
    });
  });
}

async function registrarInstrumento(nid_instrumento, descripcion) {
  try {
    const existe = await existeInstumento(nid_instrumento);
    if (existe) {
      return await actualizarInstrumento(nid_instrumento, descripcion);
    } else {
      return await insertarInstrumento(nid_instrumento, descripcion);
    }
  } catch (error) {
    console.error("Error al registrar el instrumento:", error);
    throw error;
  }
}

module.exports.registrarInstrumento = registrarInstrumento;
