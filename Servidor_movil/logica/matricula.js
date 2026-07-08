const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");
const gestorPersonas = require("./persona");
const gestor_base_datos = require("./base_datos.js");

async function insertarMaticula(
  nid_matricula,
  nid_persona,
  nid_curso,
  fecha_actualizacion,
) {
  try {
    const sql =
      "INSERT INTO matricula (nid_matricula, nid_persona, nid_curso, fecha_actualizacion) " +
      "values (" +
      conexion.dbConn.escape(nid_matricula) +
      "," +
      conexion.dbConn.escape(nid_persona) +
      "," +
      conexion.dbConn.escape(nid_curso) +
      "," +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ")";

    const result = await gestor_base_datos.actualiza(sql);
    return result.insertId;
  } catch (error) {
    console.error("Error al insertar la matricula: ", error);
    throw new Error("Error al insertar la matricula");
  }
}

async function esAlumno(nid_persona) {
  try {
    let matriculas = await obtenerMatriculas(nid_persona);
    return matriculas.length > 0;
  } catch (error) {
    console.log("matricula.js -> esAlumno: " + error);
    throw new Error("Error al comprobar si es alumno");
  }
}

async function esPadreAlumno(nid_persona, bSocio = true) {
  try {
    const hijos = await gestorPersonas.obtenerHijos(nid_persona, bSocio);

    for (let i = 0; i < hijos.length; i++) {
      let bEsAlumno = await esAlumno(hijos[i].nid_persona);

      if (bEsAlumno) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log("matricula.js -> esPadreAlumno: " + error);
    throw new Error("Error al comprobar si es padre de alumno");
  }
}

async function actualizarMatricula(
  nid_matricula,
  nid_persona,
  nid_curso,
  fecha_actualizacion,
) {
  try {
    const sql =
      "UPDATE matricula SET nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      ", nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " WHERE nid_matricula = " +
      conexion.dbConn.escape(nid_matricula);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al actualizar la matricula: ", error);
    throw new Error("Error al actualizar la matricula");
  }
}

async function existeMatricula(nid_matricula) {
  try {
    const sql =
      "SELECT * FROM matricula WHERE nid_matricula = " +
      conexion.dbConn.escape(nid_matricula);

    const result = await gestor_base_datos.consulta(sql);
    return result.length > 0;
  } catch (error) {
    console.error("Error al verificar la matricula: ", error);
    throw new Error("Error al verificar la matricula");
  }
}

async function registrarMatricula(
  nid_matricula,
  nid_persona,
  nid_curso,
  fecha_actualizacion,
) {
  try {
    const existe = await existeMatricula(nid_matricula);
    if (existe) {
      return await actualizarMatricula(
        nid_matricula,
        nid_persona,
        nid_curso,
        fecha_actualizacion,
      );
    } else {
      return await insertarMaticula(
        nid_matricula,
        nid_persona,
        nid_curso,
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al registrar la matricula: ", error);
    throw error;
  }
}

async function obtenerMatriculas(nid_persona) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".matricula WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);
    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener las matriculas: ", error);
    throw new Error("Error al obtener las matriculas");
  }
}

async function obtenerMatriculasPersona(nid_persona) {
  try {
    const sql =
      "SELECT m.nid_matricula, p.nombre, p.primer_apellido, p.segundo_apellido, c.descripcion curso, c.nid_curso FROM " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".curso c, " +
      constantes.ESQUEMA +
      ".persona p" +
      " WHERE c.nid_curso = m.nid_curso " +
      " and p.nid_persona = m.nid_persona" +
      " and p.nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " order by c.ano desc";

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener las matriculas de la persona: ", error);
    throw new Error("Error al obtener las matriculas de la persona");
  }
}

async function obtenerMatricula(nid_matricula) {
  try {
    const sql =
      "SELECT m.nid_matricula, p.nombre, p.primer_apellido, p.segundo_apellido, c.nid_curso, c.descripcion curso, p.nid_persona FROM " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".curso c, " +
      constantes.ESQUEMA +
      ".persona p" +
      " WHERE c.nid_curso = m.nid_curso " +
      " and p.nid_persona = m.nid_persona" +
      " and m.nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      " order by c.ano desc";

    const result = await gestor_base_datos.consulta(sql);
    return result[0];
  } catch (error) {
    console.error("Error al obtener la matricula: ", error);
    throw new Error("Error al obtener la matricula");
  }
}

async function obtenerPersonasAlumnos(nid_curso) {
  try {
    const sql =
      "SELECT p.nid_persona, p.nombre, p.primer_apellido, p.segundo_apellido, ma.nid_asignatura " +
      "FROM " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma " +
      "WHERE p.nid_persona = m.nid_persona " +
      "AND m.nid_matricula = ma.nid_matricula " +
      "AND (ma.fecha_baja IS NULL OR ma.fecha_baja > NOW()) " +
      " and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " GROUP BY p.nid_persona, p.nombre, p.primer_apellido, p.segundo_apellido, ma.nid_asignatura";

    const result = await gestor_base_datos.consulta(sql);
    return result;
  } catch (error) {
    console.error("Error al obtener las personas alumnos:", error);
    throw new Error("Error al obtener las personas alumnos");
  }
}

module.exports.registrarMatricula = registrarMatricula;
module.exports.obtenerMatriculas = obtenerMatriculas;
module.exports.esAlumno = esAlumno;
module.exports.esPadreAlumno = esPadreAlumno;
module.exports.obtenerMatriculasPersona = obtenerMatriculasPersona;
module.exports.obtenerMatricula = obtenerMatricula;
module.exports.obtenerPersonasAlumnos = obtenerPersonasAlumnos;
