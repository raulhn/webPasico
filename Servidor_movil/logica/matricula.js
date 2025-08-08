const conexion = require("../conexion");
const constantes = require("../constantes");
const comun = require("./comun");
const gestorPersonas = require("./persona");

function insertarMaticula(
  nid_matricula,
  nid_persona,
  nid_curso,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    var sql =
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.log("Error al insertar la matricula: " + err);
          conexion.dbConn.rollback();
          reject(new Error("Error al insertar la matricula"));
        } else {
          console.log("Matricula insertada correctamente");
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
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

function actualizarMatricula(
  nid_matricula,
  nid_persona,
  nid_curso,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    var sql =
      "UPDATE matricula SET nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      ", nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " WHERE nid_matricula = " +
      conexion.dbConn.escape(nid_matricula);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.log("Error al actualizar la matricula: " + err);
          conexion.dbConn.rollback();
          reject(new Error("Error al actualizar la matricula"));
        } else {
          console.log("Matricula actualizada correctamente");
          conexion.dbConn.commit();
          resolve(result);
        }
      });
    });
  });
}

function existeMatricula(nid_matricula) {
  return new Promise((resolve, reject) => {
    var sql =
      "SELECT * FROM matricula WHERE nid_matricula = " +
      conexion.dbConn.escape(nid_matricula);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log("Error al verificar la matricula: " + err);
        reject(new Error("Error al verificar la matricula"));
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

async function registrarMatricula(
  nid_matricula,
  nid_persona,
  nid_curso,
  fecha_actualizacion
) {
  try {
    const existe = await existeMatricula(nid_matricula);
    if (existe) {
      return await actualizarMatricula(
        nid_matricula,
        nid_persona,
        nid_curso,
        fecha_actualizacion
      );
    } else {
      return await insertarMaticula(
        nid_matricula,
        nid_persona,
        nid_curso,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar la matricula: ", error);
    throw error;
  }
}

function obtenerMatriculas(nid_persona) {
  return new Promise((resolve, reject) => {
    var sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".matricula WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log("Error al obtener las matriculas: " + err);
        reject(new Error("Error al obtener las matriculas"));
      } else {
        resolve(result);
      }
    });
  });
}

function obtenerMatriculasPersona(nid_persona) {
  return new Promise((resolve, reject) => {
    var sql =
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

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "matricula.js -> obtenerMatriculasPersona: Error al obtener las matriculas de la persona: " +
            err
        );
        reject(new Error("Error al obtener las matriculas de la persona"));
      } else {
        resolve(result);
      }
    });
  });
}

function obtenerMatricula(nid_matricula) {
  return new Promise((resolve, reject) => {
    var sql =
      "SELECT m.nid_matricula, p.nombre, p.primer_apellido, p.segundo_apellido, c.descripcion curso, p.nid_persona FROM " +
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

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.log(
          "matricula.js -> obtenerMatriculasPersona: Error al obtener las matriculas de la persona: " +
            err
        );
        reject(new Error("Error al obtener las matriculas de la persona"));
      } else {
        resolve(result[0]);
      }
    });
  });
}

function obtenerPersonasAlumnos() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.nid_persona, p.nombre, p.primer_apellido, p.segundo_apellido " +
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
      "GROUP BY p.nid_persona, p.nombre, p.primer_apellido, p.segundo_apellido";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener las personas alumnos:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports.registrarMatricula = registrarMatricula;
module.exports.obtenerMatriculas = obtenerMatriculas;
module.exports.esAlumno = esAlumno;
module.exports.esPadreAlumno = esPadreAlumno;
module.exports.obtenerMatriculasPersona = obtenerMatriculasPersona;
module.exports.obtenerMatricula = obtenerMatricula;
module.exports.obtenerPersonasAlumnos = obtenerPersonasAlumnos;
