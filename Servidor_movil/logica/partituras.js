const conexion = require("../conexion");
const constantes = require("../constantes");

function insertarPartitura(titulo, autor, categoria, url_partitura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      const sql =
        "INSERT INTO " +
        constantes.ESQUEMA +
        ".partitura (titulo, autor, categoria, url_partitura) VALUES (" +
        conexion.dbConn.escape(titulo) +
        ", " +
        conexion.dbConn.escape(autor) +
        ", " +
        conexion.dbConn.escape(categoria) +
        ", " +
        conexion.dbConn.escape(url_partitura) +
        ")";

      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al insertar la partitura: " + error.message);
          conexion.dbConn.rollback();
          reject("Error al insertar la partitura");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function actualizarPartitura(
  nid_partitura,
  titulo,
  autor,
  categoria,
  url_partitura
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".partitura SET titulo = " +
      conexion.dbConn.escape(titulo) +
      ", " +
      "autor = " +
      conexion.dbConn.escape(autor) +
      ", " +
      "categoria = " +
      conexion.dbConn.escape(categoria) +
      ", " +
      "url_partitura = " +
      conexion.dbConn.escape(url_partitura) +
      " WHERE nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al actualizar la partitura: " + error.message);
          conexion.dbConn.rollback();
          reject("Error al actualizar la partitura");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

module.exports.insertarPartitura = insertarPartitura;
module.exports.actualizarPartitura = actualizarPartitura;
