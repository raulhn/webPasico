const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const ficheros = require("./ficheros.js");
const { obtener_evaluacion } = require("./evaluacion.js");
const fs = require("fs");

function existe_imagen(id_imagen) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".imagenes where nid_imagen = " +
        conexion.dbConn.escape(id_imagen),
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

function obtener_siguiente_id() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nvl(max(nid_imagen), '0') siguiente_id from " +
        constantes.ESQUEMA_BD +
        ".imagenes",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(Number(results[0]["siguiente_id"]) + 1);
        }
      }
    );
  });
}

function actualizar_imagen(fichero, nombre) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      try {
        let nid_imagen = await obtener_siguiente_id();

        let nombre_fichero = nid_imagen + nombre;
        await ficheros.subir_ficheros(fichero, nombre_fichero);

        conexion.dbConn.query(
          "insert into " +
            constantes.ESQUEMA_BD +
            ".imagenes(nid_imagen, path, nombre) values(" +
            conexion.dbConn.escape(nid_imagen) +
            ", " +
            conexion.dbConn.escape(constantes.RUTA_SUBIDAS) +
            ", " +
            conexion.dbConn.escape(nombre_fichero) +
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
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  });
}

function obtener_ruta(nid_imagen) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(path, nombre) ruta from " +
        constantes.ESQUEMA_BD +
        ".imagenes where nid_imagen = " +
        conexion.dbConn.escape(nid_imagen),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else if (results.length < 1) {
          reject("No se ha encontrado la imagen");
        } else {
          resolve(results[0]["ruta"]);
        }
      }
    );
  });
}

async function obtener_imagen(nid_imagen) {
  try {
    let bExiste_imagen = await existe_imagen(nid_imagen);

    if (bExiste_imagen) {
      let ruta = await obtener_ruta(nid_imagen);
      return new Promise((resolve, reject) => {
        fs.readFile(ruta, (error, data) => {
          if (error) {
            console.log(error);
            reject("Error al leer la imagen");
          } else {
            resolve(data);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        fs.readFile(constantes.IMAGEN_NO_ENCONTRADA, (error, data) => {
          if (error) {
            console.log(error);
            reject("Error al leer la imagen");
          } else {
            resolve(data);
          }
        });
      });
    }
  } catch (error) {
    console.log("obtener_imagen " + error);
    throw new Error("Error al obtener la imagen");
  }
}

module.exports.actualizar_imagen = actualizar_imagen;
module.exports.obtener_imagen = obtener_imagen;
