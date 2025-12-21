const constantes = require("../constantes");
const conexion = require("../conexion");

function obtener_profesor_alumno_matricula(nid_profesor_alumno_matricula) {
  const sql =
    "SELECT pam.nid nid_profesor_alumno_matricula, pam.nid_profesor, pam.nid_matricula_asignatura, " +
    " pam.fecha_alta, pam.fecha_baja, pam.fecha_actualizacion " +
    "FROM " +
    constantes.ESQUEMA_BD +
    ".profesor_alumno_matricula pam " +
    "WHERE nid = " +
    conexion.dbConn.escape(nid_profesor_alumno_matricula);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log(
          "profesor_alumno_matricula.js - obtener_profesor_alumno_matricula - Error en la consulta: " +
            error,
        );
        reject(new Error("Error en la consulta"));
      } else {
        resolve(results[0]);
      }
    });
  });
}

function obtener_nid_profesor_alumno_matricula(
  nid_profesor,
  nid_matricula_asignatura,
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "SELECT pam.nid as nid_profesor_alumno_matricula " +
        " FROM " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam " +
        " WHERE pam.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor) +
        " AND pam.nid_matricula_asignatura = " +
        conexion.dbConn.escape(nid_matricula_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(
            "profesor_alumno_matricula.js - obtener_nid_profesor_alumno_matricula - Error en la consulta: " +
              error,
          );
          reject(new Error("Error en la consulta"));
        } else if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]["nid_profesor_alumno_matricula"]);
        }
      },
    );
  });
}

function actualizar_sucio(nid_profesor_alumno_matricula, sucio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "UPDATE " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula SET sucio = " +
        conexion.dbConn.escape(sucio) +
        " WHERE nid = " +
        conexion.dbConn.escape(nid_profesor_alumno_matricula),
      (error, results, fields) => {
        if (error) {
          console.log(
            "profesor_alumno_matricula.js - actualizar_sucio - Error en la consulta: " +
              error,
          );
          reject(new Error("Error en la consulta"));
        } else {
          resolve();
        }
      },
    );
  });
}

function obtener_sucios() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "SELECT pam.* " +
          " FROM " +
          constantes.ESQUEMA_BD +
          ".profesor_alumno_matricula pam " +
          " WHERE pam.sucio = 'S'",
        (error, results, fields) => {
          if (error) {
            console.log(
              "profesor_alumno_matricula.js - obtener_sucios - Error en la consulta: " +
                error,
            );
            conexion.dbConn.rollback();
            reject(new Error("Error en la consulta"));
          } else {
            conexion.dbConn.commit();
            resolve(results);
          }
        },
      );
    });
  });
}

function cambiar_fecha_baja_profesor_alumno_matricula(
  nid_profesor_alumno_matricula,
  fecha_baja,
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula SET fecha_baja = " +
      conexion.dbConn.escape(fecha_baja) +
      " WHERE nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log(
          "profesor_alumno_matricula.js - cambiar_fecha_baja_profesor_alumno_matricula - Error en la consulta: " +
            error,
        );
        reject(new Error("Error en la consulta"));
      } else {
        resolve();
      }
    });
  });
}

function cambiar_fecha_alta_profesor_alumno_matricula(
  nid_profesor_alumno_matricula,
  fecha_alta,
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula SET fecha_alta = " +
      conexion.dbConn.escape(fecha_alta) +
      " WHERE nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log(
          "profesor_alumno_matricula.js - cambiar_fecha_alta_profesor_alumno_matricula - Error en la consulta: " +
            error,
        );
        reject(new Error("Error en la consulta"));
      } else {
        resolve();
      }
    });
  });
}

module.exports.obtener_profesor_alumno_matricula =
  obtener_profesor_alumno_matricula;

module.exports.obtener_nid_profesor_alumno_matricula =
  obtener_nid_profesor_alumno_matricula;

module.exports.actualizar_sucio = actualizar_sucio;

module.exports.obtener_sucios = obtener_sucios;
module.exports.cambiar_fecha_baja_profesor_alumno_matricula =
  cambiar_fecha_baja_profesor_alumno_matricula;
module.exports.cambiar_fecha_alta_profesor_alumno_matricula =
  cambiar_fecha_alta_profesor_alumno_matricula;
