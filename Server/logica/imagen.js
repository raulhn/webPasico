const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const gestion_ficheros = require("./gestion_ficheros.js");
const gestion_base_datos = require("./base_datos.js");

async function obtiene_id_imagen(id_componente_imagen) {
  try {
    const sql =
      "select nid_imagen from " +
      constantes.ESQUEMA_BD +
      ".componente_imagen where nid_componente = " +
      conexion.dbConn.escape(id_componente_imagen);

    return await gestion_base_datos.consulta(sql);
  } catch (error) {
    console.log("imagen.js: Error al obtener id_imagen: " + error);
    return "-1";
  }
}

async function obtiene_ruta_imagen(id_imagen) {
  try {
    const sql =
      "select ruta_servidor from " +
      constantes.ESQUEMA_BD +
      ".imagen where nid = " +
      conexion.dbConn.escape(id_imagen);

    const results = await gestion_base_datos.consulta(sql);
    if (results.length < 1) {
      return constantes.IMAGEN_NO_ENCONTRADA;
    } else if (results[0]["ruta_servidor"] == null) {
      return constantes.IMAGEN_NO_ENCONTRADA;
    } else {
      return results[0]["ruta_servidor"];
    }
  } catch (error) {
    console.log("imagen.js: Error al obtener ruta_imagen: " + error);
    return constantes.IMAGEN_NO_ENCONTRADA;
  }
}

async function eliminar_imagen(id_imagen) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      "imagen where nid = " +
      conexion.dbConn.escape(id_imagen);

    await gestion_base_datos.actualiza(sql);
  } catch (error) {
    console.log("imagen.js: Error al eliminar imagen: " + error);
    throw new Error("Error al eliminar imagen: " + error);
  }
}

async function actualizar_imagen_servidor(id_imagen, fichero) {
  try {
    let imagen = fichero.imagen;
    let nombre_imagen = id_imagen + "_" + imagen.name;

    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".imagen set ruta_servidor = " +
      conexion.dbConn.escape(constantes.RUTA_SUBIDAS + nombre_imagen) +
      " where nid = " +
      conexion.dbConn.escape(id_imagen);

    await gestion_base_datos.actualiza(sql);
    console.log("Subida de fichero");
    await gestion_ficheros.subir_ficheros(fichero, nombre_imagen);
  } catch (error) {
    console.log("imagen.js: Error al actualizar imagen en servidor: " + error);
    throw new Error("Error al actualizar imagen en servidor: " + error);
  }
}

async function actualizar_imagen(id_componente_imagen, fichero) {
  try {
    const id_imagen = await obtiene_id_imagen(id_componente_imagen);
    await actualizar_imagen_servidor(id_imagen, fichero);
  } catch (error) {
    console.log("imagen.js: Error al actualizar imagen: " + error);
    throw new Error("Error al actualizar imagen: " + error);
  }
}

async function subir_imagen(titulo, fichero) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".imagen(titulo) values(" +
      conexion.dbConn.escape(titulo) +
      ")";
    const results = await gestion_base_datos.actualiza(sql);
    const id_imagen = results.insertId;
    await actualizar_imagen_servidor(id_imagen, fichero);
    return id_imagen;
  } catch (error) {
    console.log("imagen.js: Error al subir imagen: " + error);
    throw new Error("Error al subir imagen: " + error);
  }
}

module.exports.actualizar_imagen = actualizar_imagen;
module.exports.obtiene_id_imagen = obtiene_id_imagen;
module.exports.obtiene_ruta_imagen = obtiene_ruta_imagen;
module.exports.subir_imagen = subir_imagen;
module.exports.eliminar_imagen = eliminar_imagen;
