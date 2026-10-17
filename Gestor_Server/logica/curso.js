const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function registrar_curso(descripcion, ano) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".curso(descripcion, ano) values(" +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(ano) +
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
      ", sucio = 'S'" +
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

async function activar_curso(nid_curso) {
  try {
    // Desactivar todos los cursos
    const sqlDesactivar =
      "update " + constantes.ESQUEMA_BD + ".curso set seleccionado = 'N'";

    await gestor_base_datos.actualiza(sqlDesactivar);

    // Activar el curso seleccionado
    const sqlActivar =
      "update " +
      constantes.ESQUEMA_BD +
      ".curso set seleccionado = 'S', sucio = 'S' where nid = " +
      conexion.dbConn.escape(nid_curso);

    const results = await gestor_base_datos.actualiza(sqlActivar);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al activar curso: ", error);
    throw new Error("Error al activar curso");
  }
}

async function obtener_cursos_sucios() {
  try {
    const sql =
      "select * from " + constantes.ESQUEMA_BD + ".curso where sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener cursos sucios: ", error);
    throw new Error("Error al obtener cursos sucios");
  }
}

async function actualizar_sucio(nid_curso, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".curso set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid = " +
      conexion.dbConn.escape(nid_curso);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al actualizar sucio del curso: ", error);
    throw new Error("Error al actualizar sucio del curso");
  }
}

module.exports.registrar_curso = registrar_curso;
module.exports.actualizar_curso = actualizar_curso;
module.exports.obtener_cursos = obtener_cursos;
module.exports.eliminar_curso = eliminar_curso;

module.exports.obtener_ultimo_curso = obtener_ultimo_curso;
module.exports.activar_curso = activar_curso;
module.exports.obtener_cursos_sucios = obtener_cursos_sucios;
module.exports.actualizar_sucio = actualizar_sucio;
