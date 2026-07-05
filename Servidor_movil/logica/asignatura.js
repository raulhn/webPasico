const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("../base_datos");

function formatDateToMySQL(date) {
  try {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    return null;
  }
}

async function insertarAsignatura(
  nid_asignatura,
  descripcion,
  instrumento_banda,
  tipo_asignatura,
  fecha_actualizacion,
) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".asignaturas (nid_asignatura, descripcion, instrumento_banda, tipo_asignatura, fecha_actualizacion)" +
      " values (" +
      conexion.dbConn.escape(nid_asignatura) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(instrumento_banda) +
      ", " +
      conexion.dbConn.escape(tipo_asignatura) +
      ", " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
      ")";

    await gestor_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.log("Error al insertar la asignatura: ", error);
    throw new Error("Error al insertar la asignatura");
  }
}

async function actualizarAsignatura(
  nid_asignatura,
  descripcion,
  instrumento_banda,
  tipo_asignatura,
  fecha_actualizacion,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".asignaturas set descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", instrumento_banda = " +
      conexion.dbConn.escape(instrumento_banda) +
      ", tipo_asignatura = " +
      conexion.dbConn.escape(tipo_asignatura) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
      " where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    await gestor_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.log("Error al actualizar la asignatura: ", error);
    throw new Error("Error al actualizar la asignatura");
  }
}

async function obtenerAsignatura(nid_asignatura) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".asignaturas where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const result = await gestor_base_datos.consulta(sql);
    return result[0];
  } catch (error) {
    console.log("Error al obtener la asignatura: ", error);
    throw new Error("Error al obtener la asignatura");
  }
}

async function existeAsignatura(nid_asignatura) {
  try {
    const sql =
      "select count(*) as existe from " +
      constantes.ESQUEMA +
      ".asignaturas where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);

    return results[0].existe > 0;
  } catch (error) {
    console.log("Error al comprobar la existencia de la asignatura: ", error);
    throw new Error("Error al comprobar la existencia de la asignatura");
  }
}

async function registrarAsignatura(
  nid_asignatura,
  descripcion,
  instrumento_banda,
  tipo_asignatura,
  fecha_actualizacion,
) {
  try {
    let asignatura = await existeAsignatura(nid_asignatura);
    if (asignatura) {
      await actualizarAsignatura(
        nid_asignatura,
        descripcion,
        instrumento_banda,
        tipo_asignatura,
        fecha_actualizacion,
      );
    } else {
      await insertarAsignatura(
        nid_asignatura,
        descripcion,
        instrumento_banda,
        tipo_asignatura,
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al registrar la asignatura: ", error);
    throw error;
  }
}

async function obtenerAsignaturas() {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".asignaturas order by descripcion";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener las asignaturas: ", error);
    throw new Error("Error al obtener las asignaturas");
  }
}

async function obtenerAsignaturasProfesor(nid_profesor) {
  try {
    const sql =
      "select a.* from " +
      constantes.ESQUEMA +
      ".asignaturas a, " +
      constantes.ESQUEMA +
      ".profesor p where a.nid_asignatura = p.nid_asignatura " +
      "and p.nid_persona = " +
      conexion.dbConn.escape(nid_profesor) +
      " and p.esBaja = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener las asignaturas del profesor: ", error);
    throw new Error("Error al obtener las asignaturas del profesor");
  }
}

module.exports.obtenerAsignatura = obtenerAsignatura;
module.exports.registrarAsignatura = registrarAsignatura;
module.exports.obtenerAsignaturas = obtenerAsignaturas;
module.exports.obtenerAsignaturasProfesor = obtenerAsignaturasProfesor;
