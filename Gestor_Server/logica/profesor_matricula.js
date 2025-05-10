const conexion = require("../conexion");
const constantes = require("../constantes");

function alta_profesor_matricula(nid_matricula_asignatura, nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula(nid_profesor, nid_matricula_asignatura, fecha_alta) values(" +
        conexion.dbConn.escape(nid_profesor) +
        ", " +
        conexion.dbConn.escape(nid_matricula_asignatura) +
        ", sysdate())",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject();
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
}

module.exports.alta_profesor_matricula = alta_profesor_matricula;
