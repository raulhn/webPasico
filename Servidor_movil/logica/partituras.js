const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_base_datos = require("./base_datos");

async function insertarPartitura(titulo, autor, nid_categoria, url_partitura) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".partituras (titulo, autor, nid_categoria, url_partitura) VALUES (" +
      conexion.dbConn.escape(titulo) +
      ", " +
      conexion.dbConn.escape(autor) +
      ", nullif(" +
      conexion.dbConn.escape(nid_categoria) +
      ", '')," +
      conexion.dbConn.escape(url_partitura) +
      ")";

    const result = await gestor_base_datos.actualiza(sql);
    return result.insertId;
  } catch (error) {
    console.error("Error al insertar la partitura: " + error.message);
    throw new Error("Error al insertar la partitura");
  }
}

async function actualizarPartitura(
  nid_partitura,
  titulo,
  autor,
  nid_categoria,
  url_partitura,
) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".partituras SET titulo = " +
      conexion.dbConn.escape(titulo) +
      ", " +
      "autor = " +
      conexion.dbConn.escape(autor) +
      ", " +
      "nid_categoria = nullif(" +
      conexion.dbConn.escape(nid_categoria) +
      ", '')" +
      ", " +
      "url_partitura = " +
      conexion.dbConn.escape(url_partitura) +
      " WHERE nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    const result = await gestor_base_datos.actualiza(sql);
    return result.affectedRows;
  } catch (error) {
    console.error("Error al actualizar la partitura: " + error.message);
    throw new Error("Error al actualizar la partitura");
  }
}

async function obtenerPartituras() {
  try {
    const sql =
      "SELECT p.nid_partitura, p.titulo, p.autor, p.nid_categoria, p.url_partitura, ifnull(c.nombre_categoria, '') nombre_categoria, p.url_partitura " +
      "FROM " +
      constantes.ESQUEMA +
      ".partituras p " +
      "LEFT JOIN " +
      constantes.ESQUEMA +
      ".categoria_partitura c ON p.nid_categoria = c.nid_categoria";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener las partituras: " + error.message);
    throw new Error("Error al obtener las partituras");
  }
}

async function obtenerPartitura(nid_partitura) {
  try {
    const sql =
      "SELECT p.nid_partitura, p.titulo, p.autor, p.nid_categoria, p.url_partitura, ifnull(c.nombre_categoria, '') nombre_categoria " +
      "FROM " +
      constantes.ESQUEMA +
      ".partituras p " +
      "LEFT JOIN " +
      constantes.ESQUEMA +
      ".categoria_partitura c ON p.nid_categoria = c.nid_categoria " +
      "WHERE p.nid_partitura = " +
      conexion.dbConn.escape(nid_partitura);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.error("Error al obtener la partitura: " + error.message);
    throw new Error("Error al obtener la partitura");
  }
}

module.exports.insertarPartitura = insertarPartitura;
module.exports.actualizarPartitura = actualizarPartitura;
module.exports.obtenerPartituras = obtenerPartituras;
module.exports.obtenerPartitura = obtenerPartitura;
