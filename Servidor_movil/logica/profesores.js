const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");
const gestor_base_datos = require("./base_datos.js");

async function insertarProfesor(
  nid_persona,
  nid_asignatura,
  esBaja,
  fecha_actualizacion,
) {
  try {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".profesor (nid_persona, nid_asignatura, fecha_actualizacion, esBaja)" +
      "values(" +
      conexion.dbConn.escape(nid_persona) +
      "," +
      conexion.dbConn.escape(nid_asignatura) +
      "," +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      "," +
      conexion.dbConn.escape(esBaja) +
      ")";

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al insertar el profesor: " + error.message);
    throw new Error("Error al insertar el profesor");
  }
}

async function actualizarProfesor(
  nid_persona,
  nid_asignatura,
  esBaja,
  fecha_actualizacion,
) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".profesor SET  fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", esBaja = " +
      conexion.dbConn.escape(esBaja) +
      " WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al actualizar el profesor: " + error.message);
    throw new Error("Error al actualizar el profesor");
  }
}

async function existeProfesor(nid_persona, nid_asignatura) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".profesor WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const result = await gestor_base_datos.consulta(sql);
    return result.length > 0;
  } catch (error) {
    console.error("Error al verificar el profesor: " + error.message);
    throw new Error("Error al verificar el profesor");
  }
}

async function registrarProfesor(
  nid_persona,
  nid_asignatura,
  esBaja,
  fecha_actualizacion,
) {
  try {
    const existe = await existeProfesor(nid_persona, nid_asignatura);
    if (existe) {
      return await actualizarProfesor(
        nid_persona,
        nid_asignatura,
        esBaja,
        fecha_actualizacion,
      );
    } else {
      return await insertarProfesor(
        nid_persona,
        nid_asignatura,
        esBaja,
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al registrar el profesor: " + error.message);
    throw new Error("Error al registrar el profesor");
  }
}

async function eliminarProfesor(nid_persona, nid_asignatura) {
  try {
    const sql =
      "DELETE FROM " +
      constantes.ESQUEMA +
      ".profesor WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al eliminar el profesor: " + error.message);
    throw new Error("Error al eliminar el profesor");
  }
}

async function obtenerProfesor(nid_persona) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".profesor WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener el profesor: " + error.message);
    throw new Error("Error al obtener el profesor");
  }
}

async function esProfesor(nid_persona, nid_asignatura) {
  try {
    const sql =
      "select count(*) num " +
      " from " +
      constantes.ESQUEMA +
      ".profesor " +
      "where nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const result = await gestor_base_datos.consulta(sql);
    return result[0]["num"] > 0;
  } catch (error) {
    console.error("Error al comprobar si es profesor: " + error.message);
    throw new Error("Error al comprobar si es profesor");
  }
}

async function obtenerProfesores() {
  try {
    const sql =
      "SELECT pr.*, pe.nombre, pe.primer_apellido, pe.segundo_apellido FROM " +
      constantes.ESQUEMA +
      ".profesor pr, " +
      constantes.ESQUEMA +
      ".persona pe " +
      " where pr.nid_persona = pe.nid_persona" +
      " and esBaja = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los profesores: " + error.message);
    throw new Error("Error al obtener los profesores");
  }
}

async function obtenerProfesoresAsignatura(nid_asignatura) {
  try {
    const sql =
      "SELECT pr.*, pe.nombre, pe.primer_apellido, pe.segundo_apellido FROM " +
      constantes.ESQUEMA +
      ".profesor pr, " +
      constantes.ESQUEMA +
      ".persona pe " +
      " where pr.nid_persona = pe.nid_persona" +
      " and pr.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " and pr.esBaja = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los profesores: " + error.message);
    throw new Error("Error al obtener los profesores");
  }
}

async function obtenerAsignaturasProfesor(nid_persona) {
  try {
    const sql =
      "select a.nid_asignatura, a.descripcion from " +
      constantes.ESQUEMA +
      ".profesor p, " +
      constantes.ESQUEMA +
      ".asignaturas a " +
      " where p.nid_asignatura = a.nid_asignatura " +
      " and p.nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and p.esBaja = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error(
      "Error al obtener las asignaturas del profesor: " + error.message,
    );
    throw new Error("Error al obtener las asignaturas del profesor");
  }
}

module.exports.obtenerProfesoresAsignatura = obtenerProfesoresAsignatura;
module.exports.obtenerProfesores = obtenerProfesores;
module.exports.registrarProfesor = registrarProfesor;
module.exports.eliminarProfesor = eliminarProfesor;
module.exports.obtenerProfesor = obtenerProfesor;
module.exports.esProfesor = esProfesor;
module.exports.obtenerAsignaturasProfesor = obtenerAsignaturasProfesor;
