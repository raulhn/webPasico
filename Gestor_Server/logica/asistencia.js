const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function registrar_asistencia(nid_evento_asistencia, nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".asistentes(nid_evento_asistencia, nid_persona) values(" +
          conexion.dbConn.escape(nid_evento_asistencia) +
          ", " +
          conexion.dbConn.escape(nid_persona) +
          ")",
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(error);
          } else {
            conexion.dbConn.commit();
            resolve(results.insertId);
          }
        }
      );
    });
  });
}

function registrar_evento_asistencia(descripcion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".evento_asistencia(descripcion, fecha) values(" +
          conexion.dbConn.escape(descripcion) +
          ", sysdate())",
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(error);
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

async function async_registrar_asistencias(
  descripcion,
  personas,
  resolve,
  reject
) {
  let nid_evento_asistencia = await registrar_evento_asistencia(descripcion);

  for (let i = 0; i < personas.length; i++) {
    await registrar_asistencia(nid_evento_asistencia, personas[i]);
  }

  resolve();
}
function registrar_asistencias(descripcion, personas) {
  return new Promise((resolve, reject) => {
    async_registrar_asistencias(descripcion, personas, resolve, reject);
  });
}

module.exports.registrar_asistencias = registrar_asistencias;
module.exports.registrar_evento_asistencia = registrar_evento_asistencia;
