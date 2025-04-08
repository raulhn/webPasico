const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_imagenes = require("./imagenes.js");

function existe_inventario(nid_inventario) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".inventario where nid_inventario = " +
        conexion.dbConn.escape(nid_inventario),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]["num"] > 0);
        }
      }
    );
  });
}

async function registrar_inventario(
  nid_inventario,
  descripcion,
  modelo,
  num_serie,
  comentarios
) {
  try {
    let bExiste_inventario = await existe_inventario(nid_inventario);
    return new Promise((resolve, reject) => {
      if (bExiste_inventario) {
        conexion.dbConn.beginTransaction(() => {
          conexion.dbConn.query(
            "update " +
              constantes.ESQUEMA_BD +
              ".inventario set descripcion = " +
              conexion.dbConn.escape(descripcion) +
              ", modelo = " +
              conexion.dbConn.escape(modelo) +
              ", num_serie = " +
              conexion.dbConn.escape(num_serie) +
              ", comentarios = " +
              conexion.dbConn.escape(comentarios) +
              " where nid_inventario = " +
              conexion.dbConn.escape(nid_inventario),
            (error, results, fields) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject(error);
              } else {
                conexion.dbConn.commit();
                resolve();
              }
            }
          );
        });
      } else {
        conexion.dbConn.beginTransaction(() => {
          conexion.dbConn.query(
            "insert into " +
              constantes.ESQUEMA_BD +
              ".inventario(descripcion, modelo, num_serie, comentarios) values(" +
              conexion.dbConn.escape(descripcion) +
              ", " +
              conexion.dbConn.escape(modelo) +
              ", " +
              conexion.dbConn.escape(num_serie) +
              ", " +
              conexion.dbConn.escape(comentarios) +
              ")",
            (error, results, fields) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject(error);
              } else {
                conexion.dbConn.commit();
                resolve(results.insertId);
              }
            }
          );
        });
      }
    });
  } catch (error) {
    console.log(error);
    return new Promise((resolve, reject) => {
      console.log("inventario.js -> registrar_inventario: " + error);
      reject("Error al registrar el inventario");
    });
  }
}

function obtener_inventarios() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " + constantes.ESQUEMA_BD + ".inventario",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_inventario(nid_inventario) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".inventario where nid_inventario = " +
        conexion.dbConn.escape(nid_inventario),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else if (results.length == 0) {
          let mensaje = "No se ha encontrado el inventario";
          console.log(mensaje);
          reject(mensaje);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function eliminar_inventario(nid_inventario) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".inventario where nid_inventario = " +
          conexion.dbConn.escape(nid_inventario),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(error);
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

async function actualizar_imagen(fichero, nid_inventario) {
  try {
    let imagen = fichero.imagen;
    let nombre = imagen.name;

    let nid_imagen = await gestor_imagenes.actualizar_imagen(fichero, nombre);

    return new Promise((resolve, reject) => {
      conexion.dbConn.beginTransaction(() => {
        conexion.dbConn.query(
          "update " +
            constantes.ESQUEMA_BD +
            ".inventario set nid_imagen = " +
            conexion.dbConn.escape(nid_imagen) +
            " where nid_inventario = " +
            conexion.dbConn.escape(nid_inventario),
          (error, results, fields) => {
            if (error) {
              console.log(error);
              conexion.dbConn.rollback();
              reject("Error al actualizar la imagen");
            } else {
              conexion.dbConn.commit();
              resolve();
            }
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error al actualizar la imagen");
  }
}

module.exports.registrar_inventario = registrar_inventario;
module.exports.obtener_inventarios = obtener_inventarios;
module.exports.obtener_inventario = obtener_inventario;
module.exports.eliminar_inventario = eliminar_inventario;
module.exports.actualizar_imagen = actualizar_imagen;
