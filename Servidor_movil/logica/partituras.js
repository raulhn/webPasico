const conexion = require("../conexion");
const constantes = require("../constantes");

function insertarPartitura(titulo, autor, nid_categoria, url_partitura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      const sql =
        "INSERT INTO " +
        constantes.ESQUEMA +
        ".partituras (titulo, autor, nid_categoria, url_partitura) VALUES (" +
        conexion.dbConn.escape(titulo) +
        ", " +
        conexion.dbConn.escape(autor) +
        ", " +
        conexion.dbConn.escape(nid_categoria) +
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
          resolve(result.insertId);
        }
      });
    });
  });
}

function actualizarPartitura(
  nid_partitura,
  titulo,
  autor,
  nid_categoria,
  url_partitura
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".partituras SET titulo = " +
      conexion.dbConn.escape(titulo) +
      ", " +
      "autor = " +
      conexion.dbConn.escape(autor) +
      ", " +
      "nid_categoria = " +
      conexion.dbConn.escape(nid_categoria) +
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

function obtenerPartituras() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.nid_partitura, p.titulo, p.autor, p.nid_categoria, p.url_partitura, c.nombre_categoria, p.url_partitura " +
      "FROM " +
      constantes.ESQUEMA +
      ".partituras p " +
      "JOIN " +
      constantes.ESQUEMA +
      ".categoria_partitura c ON p.nid_categoria = c.nid_categoria";

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener las partituras: " + error.message);
        reject("Error al obtener las partituras");
      } else {
        resolve(results);
      }
    });
  });
}

function obtenerPartitura(nid_partitura) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.nid_partitura, p.titulo, p.autor, p.nid_categoria, p.url_partitura, c.nombre_categoria " +
      "FROM " +
      constantes.ESQUEMA +
      ".partituras p " +
      "JOIN " +
      constantes.ESQUEMA +
      ".categoria_partitura c ON p.nid_categoria = c.nid_categoria " +
      "WHERE p.nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener la partitura: " + error.message);
        reject("Error al obtener la partitura");
      } else {
        resolve(results[0]);
      }
    });
  });
}

module.exports.insertarPartitura = insertarPartitura;
module.exports.actualizarPartitura = actualizarPartitura;
module.exports.obtenerPartituras = obtenerPartituras;
module.exports.obtenerPartitura = obtenerPartitura;
