const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const ficheros = require("./ficheros.js");
const { obtener_evaluacion } = require("./evaluacion.js");
const fs = require("fs");
const gestor_base_datos = requiree("./base_datos.js");

async function existe_imagen(id_imagen) {
  try {
    const sql =
      "select count(*) num from " +
      constantes.ESQUEMA_BD +
      ".imagenes where nid_imagen = " +
      conexion.dbConn.escape(id_imagen);

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["num"] > 0;
  } catch (error) {
    console.log("Error al comprobar si existe la imagen: " + error);
    throw new Error("Error al comprobar si existe la imagen");
  }
}

async function obtener_siguiente_id() {
  try {
    const sql =
      "select nvl(max(nid_imagen), '0') siguiente_id from " +
      constantes.ESQUEMA_BD +
      ".imagenes";

    const results = await gestor_base_datos.consulta(sql);
    return Number(results[0]["siguiente_id"]) + 1;
  } catch (error) {
    console.log("Error al obtener el siguiente id de imagen: " + error);
    throw new Error("Error al obtener el siguiente id de imagen");
  }
}

async function actualizar_imagen(fichero, nombre) {
  try {
    let nid_imagen = await obtener_siguiente_id();

    let nombre_fichero = nid_imagen + nombre;
    await ficheros.subir_ficheros(fichero, nombre_fichero);
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".imagenes(nid_imagen, path, nombre) values(" +
      conexion.dbConn.escape(nid_imagen) +
      ", " +
      conexion.dbConn.escape(constantes.RUTA_SUBIDAS) +
      ", " +
      conexion.dbConn.escape(nombre_fichero) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("Error al actualizar la imagen: " + error);
    throw new Error("Error al actualizar la imagen");
  }
}

async function obtener_ruta(nid_imagen) {
  try {
    const sql =
      "select concat(path, nombre) ruta from " +
      constantes.ESQUEMA_BD +
      ".imagenes where nid_imagen = " +
      conexion.dbConn.escape(nid_imagen);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      console.log("No se ha encontrado la imagen con id: " + nid_imagen);
      throw new Error("No se ha encontrado la imagen");
    }
    return results[0]["ruta"];
  } catch (error) {
    console.log("Error al obtener la ruta de la imagen: " + error);
    throw new Error("Error al obtener la ruta de la imagen");
  }
}

function leerFichero(ruta) {
  return new Promise((resolve, reject) => {
    fs.readFile(ruta, (error, data) => {
      try {
        if (error) {
          console.log("Error al leer el fichero: " + error);
          reject("Error al leer el fichero");
        } else {
          resolve(data);
        }
      } catch (error) {
        console.log("Error al leer el fichero: " + error);
        reject("Error al leer el fichero");
      }
    });
  });
}

async function obtener_imagen(nid_imagen) {
  try {
    let bExiste_imagen = await existe_imagen(nid_imagen);

    if (bExiste_imagen) {
      let ruta = await obtener_ruta(nid_imagen);
      return await leerFichero(ruta);
    } else {
      return await leerFichero(constantes.IMAGEN_NO_ENCONTRADA);
    }
  } catch (error) {
    console.log("obtener_imagen " + error);
    throw new Error("Error al obtener la imagen");
  }
}

module.exports.actualizar_imagen = actualizar_imagen;
module.exports.obtener_imagen = obtener_imagen;
