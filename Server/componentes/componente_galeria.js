const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const imagen = require("../imagen.js");

function addImagenGaleria(idComponente, titulo, fichero) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      imagen
        .subirImagen(titulo, fichero)
        .then((idImagen) => {
          console.log("Galeria " + idImagen);
          conexion.dbConn.query(
            "insert into " +
              constantes.ESQUEMA_BD +
              ".galeria_imagen(nid_componente, nid_imagen) values(" +
              conexion.dbConn.escape(idComponente) +
              ", " +
              conexion.dbConn.escape(idImagen) +
              ")",

            (error, results, field) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject(new Error("Error al añadir una imagen a la galeria"));
              } else {
                conexion.dbConn.commit();
                resolve();
              }
            }
          );
        })
        .catch(() => {
          conexion.dbConn.rollback();
          reject(new Error("Error al añadir una imagen a la galeria"));
        });
    });
  });
}

function eliminarImagenGaleria(idComponente, idImagen) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".galeria_imagen where nid_componente = " +
          conexion.dbConn.escape(idComponente) +
          " and nid_imagen = " +
          conexion.dbConn.escape(idImagen),

        (error, results, field) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(new Error("Error al eliminar la imagen de la galería"));
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function obtieneImagenesGaleria(idComponente) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid_imagen from " +
        constantes.ESQUEMA_BD +
        ".galeria_imagen where nid_componente = " +
        conexion.dbConn.escape(idComponente),
      (error, results, field) => {
        if (error) {
          console.log(error);
          reject(new Error("Error la obtener las imagenes de la galeria"));
        } else {
          resolve(results);
        }
      }
    );
  });
}

module.exports.addImagenGaleria = addImagenGaleria;
module.exports.eliminarImagenGaleria = eliminarImagenGaleria;
module.exports.obtieneImagenesGaleria = obtieneImagenesGaleria;
