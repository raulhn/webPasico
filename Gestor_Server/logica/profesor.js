const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_base_datos = require("./base_datos");

async function esAlumnoProfesor(nid_alumno, nid_profesor, nid_curso) {
  try {
    const sql =
      "select count(*) as num " +
      " from " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam " +
      " where m.nid = ma.nid_matricula " +
      "   and ma.nid = pam.nid_matricula_asignatura " +
      "   and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      "   and pam.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      "   and m.nid_persona = " +
      conexion.dbConn.escape(nid_alumno);
    const results = await gestor_base_datos.consulta(sql);
    return results[0].num > 0;
  } catch (error) {
    console.log(
      "profesor.js - esAlumnoProfesor - Error en la consulta: ",
      error
    );
    throw new Error("Error al consultar si alumno es profesor");
  }
}

async function darDeBajaProfesor(nid_profesor, nid_asignatura) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".profesor " +
      " set esBaja = 'S', sucio = 'S' " +
      " where nid_persona = " +
      conexion.dbConn.escape(nid_profesor) +
      "   and nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);
    await gestor_base_datos.actualiza(sql);
    return true;
  } catch (error) {
    console.log(
      "profesor.js - darDeBajaProfesor - Error en la consulta: ",
      error
    );
    throw new Error("Error al actualizar profesor");
  }
}

module.exports.esAlumnoProfesor = esAlumnoProfesor;
module.exports.darDeBajaProfesor = darDeBajaProfesor;