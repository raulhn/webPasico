const conexion = require("../conexion");
const constantes = require("../constantes");

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
      conexion.dbConn.escape(fecha_actualizacion) +
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
      conexion.dbConn.escape(fecha_actualizacion) +
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

module.exports.registrarMatricula = registrarMatricula;
module.exports.obtenerMatriculas = obtenerMatriculas;
