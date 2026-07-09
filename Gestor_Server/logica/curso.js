const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function registrar_curso(descripcion) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".curso(descripcion) values(" +
      conexion.dbConn.escape(descripcion) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("Error al registrar curso: ", error);
    throw new Error("Error al registrar curso");
  }
}

async function actualizar_curso(nid_curso, descripcion) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".curso set descripcion = " +
      conexion.dbConn.escape(descripcion) +
      " where nid = " +
      conexion.dbConn.escape(nid_curso);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al actualizar curso: ", error);
    throw new Error("Error al actualizar curso");
  }
}

async function obtener_cursos() {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".curso order by descripcion desc";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener cursos: ", error);
    throw new Error("Error al obtener cursos");
  }
}

async function eliminar_curso(nid_curso) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      ".curso where nid = " +
      conexion.dbConn.escape(nid_curso);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al eliminar curso: ", error);
    throw new Error("Error al eliminar curso");
  }
}

async function obtener_ultimo_curso() {
  try {
    const sql =
      "select nid from " +
      constantes.ESQUEMA_BD +
      ".curso where seleccionado = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["nid"];
  } catch (error) {
    console.log("Error al obtener el último curso: ", error);
    throw new Error("Error al obtener el último curso");
  }
}

module.exports.registrar_curso = registrar_curso;
module.exports.actualizar_curso = actualizar_curso;
module.exports.obtener_cursos = obtener_cursos;
module.exports.eliminar_curso = eliminar_curso;

module.exports.obtener_ultimo_curso = obtener_ultimo_curso;
