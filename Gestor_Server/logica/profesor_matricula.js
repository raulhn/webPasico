const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_base_datos = require("./base_datos.js");

async function alta_profesor_matricula(nid_matricula_asignatura, nid_profesor) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula(nid_profesor, nid_matricula_asignatura, fecha_alta) values(" +
      conexion.dbConn.escape(nid_profesor) +
      ", " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", sysdate())";

    const results = await gestor_base_datos.inserta(sql);
    return results.insertId;
  } catch (error) {
    console.log("profesor_matricula.js - alta_profesor_matricula -> " + error);
    throw new Error("Error al dar de alta profesor-matrícula");
  }
}

module.exports.alta_profesor_matricula = alta_profesor_matricula;
