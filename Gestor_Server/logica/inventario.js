const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_imagenes = require("./imagenes.js");
const gestor_base_datos = require("./base_datos.js");

async function existe_inventario(nid_inventario) {
  try {
    const sql =
      "select count(*) num from " +
      constantes.ESQUEMA_BD +
      ".inventario where nid_inventario = " +
      conexion.dbConn.escape(nid_inventario);
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al verificar si existe el inventario");
  }
}

async function registrar_inventario(
  nid_inventario,
  descripcion,
  modelo,
  num_serie,
  comentarios,
) {
  try {
    const bExiste = await existe_inventario(nid_inventario);
    if (bExiste) {
      const sql =
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
        conexion.dbConn.escape(nid_inventario);
      const results = await gestor_base_datos.actualiza(sql);
      return;
    } else {
      const sql =
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
        ")";
      const results = await gestor_base_datos.actualiza(sql);
      return results.insertId;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el inventario");
  }
}

async function obtener_inventarios() {
  try {
    const sql = "select * from " + constantes.ESQUEMA_BD + ".inventario";
    const results = await gestor_base_datos.consulta(sql);

    return results;
  } catch (error) {
    console.log("Error al obtener los inventarios: ", error);
    throw new Error("Error al obtener los inventarios");
  }
}

async function obtener_inventario(nid_inventario) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".inventario where nid_inventario = " +
      conexion.dbConn.escape(nid_inventario);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log("Error al obtener el inventario: ", error);
    throw new Error("Error al obtener el inventario");
  }
}

async function eliminar_inventario(nid_inventario) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      ".inventario where nid_inventario = " +
      conexion.dbConn.escape(nid_inventario);
    await gestor_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.log("Error al eliminar el inventario: ", error);
    throw new Error("Error al eliminar el inventario");
  }
}

async function actualizar_imagen(fichero, nid_inventario) {
  try {
    let imagen = fichero.imagen;
    let nombre = imagen.name;

    let nid_imagen = await gestor_imagenes.actualizar_imagen(fichero, nombre);

    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".inventario set nid_imagen = " +
      conexion.dbConn.escape(nid_imagen) +
      " where nid_inventario = " +
      conexion.dbConn.escape(nid_inventario);
    const results = await gestor_base_datos.actualiza(sql);
    return;
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
