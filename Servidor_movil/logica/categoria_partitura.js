const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_base_datos = require("./base_datos");

async function insertarCategoriaPartitura(nombre_categoria) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".categoria_partitura (nombre_categoria) VALUES (trim(" +
      conexion.dbConn.escape(nombre_categoria) +
      "))";

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al insertar la categoria de partitura: ", error);
    throw new Error("Error al insertar la categoria de partitura");
  }
}

async function actualizarCategoriaPartitura(nid_categoria, nombre_categoria) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".categoria_partitura SET nombre_categoria = " +
      conexion.dbConn.escape(nombre_categoria) +
      " WHERE nid_categoria = " +
      conexion.dbConn.escape(nid_categoria);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al actualizar la categoria de partitura: ", error);
    throw new Error("Error al actualizar la categoria de partitura");
  }
}

async function obtenerCategoriasPartitura() {
  try {
    const sql =
      "SELECT nid_categoria, nombre_categoria FROM " +
      constantes.ESQUEMA +
      ".categoria_partitura";

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener las categorias de partitura: ", error);
    throw new Error("Error al obtener las categorias de partitura");
  }
}

module.exports.insertarCategoriaPartitura = insertarCategoriaPartitura;
module.exports.actualizarCategoriaPartitura = actualizarCategoriaPartitura;
module.exports.obtenerCategoriasPartitura = obtenerCategoriasPartitura;
