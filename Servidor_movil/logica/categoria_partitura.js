const conexion = require("../conexion");
const constantes = require("../constantes");

function insertarCategoriaPartitura(nombre_categoria) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".categoria_partitura (nombre_categoria) VALUES (trim(" +
      conexion.dbConn.escape(nombre_categoria) +
      "))";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error(
            "Error al insertar la categoria de partitura: " + error.message
          );
          conexion.dbConn.rollback();
          reject("Error al insertar la categoria de partitura");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function actualizarCategoriaPartitura(nid_categoria, nombre_categoria) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".categoria_partitura SET nombre_categoria = " +
      conexion.dbConn.escape(nombre_categoria) +
      " WHERE nid_categoria = " +
      conexion.dbConn.escape(nid_categoria);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error(
            "Error al actualizar la categoria de partitura: " + error.message
          );
          conexion.dbConn.rollback();
          reject("Error al actualizar la categoria de partitura");
        } else {
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function obtenerCategoriasPartitura() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT nid_categoria, nombre_categoria FROM " +
      constantes.ESQUEMA +
      ".categoria_partitura";

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.error(
          "Error al obtener las categorias de partitura: " + error.message
        );
        reject("Error al obtener las categorias de partitura");
      } else {
        console.log("Categorias de partitura obtenidas correctamente");
        resolve(result);
      }
    });
  });
}

module.exports.insertarCategoriaPartitura = insertarCategoriaPartitura;
module.exports.actualizarCategoriaPartitura = actualizarCategoriaPartitura;
module.exports.obtenerCategoriasPartitura = obtenerCategoriasPartitura;
