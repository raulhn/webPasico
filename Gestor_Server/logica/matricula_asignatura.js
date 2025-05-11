const constantes = require("../constantes");
const conexion = require("../conexion");
const gestorProfesorMatricula = require("./profesor_matricula.js");

function obtener_matriculas_asignaturas_alumno(nid_alumno, nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select m.nid as nid_matricula, " +
        "       ma.nid as nid_matricula_asignatura, " +
        "       ma.nid_asignatura, " +
        "       m.nid_curso, " +
        "       ma.nid_matricula, " +
        "       concat(p.nombr, ' ', p.apellido1, ' ', p.apellido2) as nombre_profesor " +
        "       a.descripcion as nombre_asignatura " +
        "       ma.fecha_alta, " +
        "       ma.fecha_baja, " +
        " from " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        " where m.nid = ma.nid_matricula " +
        "   and ma.nid_asignatura = a.nid " +
        "   and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        "   and m.nid_persona = " +
        conexion.dbConn.escape(nid_alumno) +
        "   and ma.nid = pam.nid_matricula_asignatura ",
      (error, results, fields) => {
        if (error) {
          console.log(
            "matricula_asignatura.js - obtener_matriculas_asignaturas_alumno - Error en la consulta: " +
              error
          );
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_matricula_asignatura(nid_matricula_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select ma.nid as nid_matricula_asignatura, " +
        "       ma.nid_matricula, " +
        "       ma.nid_asignatura, " +
        "       ma.fecha_alta, " +
        "       ma.fecha_baja, " +
        " ma.fecha_actualizacion " +
        " from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma " +
        " where ma.nid = " +
        conexion.dbConn.escape(nid_matricula_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(
            "matricula_asignatura.js - obtener_matricula_asignatura - Error en la consulta: " +
              error
          );
          reject(new Error("Error en la consulta"));
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function obtener_nid_matricula_asignatura(nid_matricula, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select ma.nid as nid_matricula_asignatura " +
        " from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma " +
        " where ma.nid_matricula = " +
        conexion.dbConn.escape(nid_matricula) +
        " and ma.nid_asignatura = " +
        conexion.dbConn.escape(nid_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(
            "matricula_asignatura.js - obtener_nid_matricula_asignatura - Error en la consulta: " +
              error
          );
          reject(new Error("Error en la consulta"));
        } else {
          resolve(results[0]["nid_matricula_asignatura"]);
        }
      }
    );
  });
}

function actualizar_fecha_alta_matricula_asignatura(
  nid_matricula_asignatura,
  fecha_alta
) {
  return new Promise((resolve, reject) => {
    try {
      conexion.dbConn.beginTransaction(
        "update " +
          constantes.ESQUEMA_BD +
          ".matricula_asignatura set fecha_alta = " +
          "str_to_date(nullif(" +
          conexion.dbConn.escape(fecha_alta) +
          ", '') , '%Y-%m-%d') " +
          " where nid = " +
          conexion.dbConn.escape(nid_matricula_asignatura),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject("Error al actualizar la fecha de alta");
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

function actualizar_fecha_baja_matricula_asignatura(
  nid_matricula_asignatura,
  fecha_baja
) {
  return new Promise((resolve, reject) => {
    try {
      conexion.dbConn.beginTransaction(
        "update " +
          constantes.ESQUEMA_BD +
          ".matricula_asignatura set fecha_baja = " +
          "str_to_date(nullif(" +
          conexion.dbConn.escape(fecha_baja) +
          ", '') , '%Y-%m-%d') " +
          " where nid = " +
          conexion.dbConn.escape(nid_matricula_asignatura),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject("Error al actualizar la fecha de baja");
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

function add_asignatura(nid_matricula, nid_asignatura, nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".matricula_asignatura(nid_matricula, nid_asignatura, fecha_alta) values(" +
          conexion.dbConn.escape(nid_matricula) +
          ", " +
          conexion.dbConn.escape(nid_asignatura) +
          ", sysdate())",
        async (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            try {
              const nid_profesor_alumno_matricula =
                await gestorProfesorMatricula.alta_profesor_matricula(
                  results.insertId,
                  nid_profesor
                );
            } catch (error) {
              console.log(error);
              conexion.dbConn.rollback();
              reject("Error al registrar el profesor-alumno-matricula");
            }

            conexion.dbConn.commit();
            resolve(results.insertId);
          }
        }
      );
    });
  });
}

function eliminar_asignatura(nid_matricula, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".matricula_asignatura where nid_matricula = " +
          conexion.dbConn.escape(nid_matricula) +
          ", " +
          conexion.dbConn.escape(nid_asignatura),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function dar_baja_asignatura(nid, nid_matricula, nid_asignatura, fecha_baja) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".matricula_asignatura set fecha_baja = " +
          "str_to_date(nullif(" +
          conexion.dbConn.escape(fecha_baja) +
          ", '') , '%Y-%m-%d') where nid_matricula = " +
          conexion.dbConn.escape(nid_matricula) +
          " and nid_asignatura = " +
          conexion.dbConn.escape(nid_asignatura) +
          " and nid = " +
          conexion.dbConn.escape(nid),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function modificar_sucio(nid_matricula_asignatura, sucio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".matricula_asignatura set sucio = " +
          conexion.dbConn.escape(sucio) +
          " where nid = " +
          conexion.dbConn.escape(nid_matricula_asignatura),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function obtener_matriculas_asignaturas_sucias() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "select ma.*  " +
          "from  " +
          constantes.ESQUEMA_BD +
          ".matricula_asignatura ma " +
          "where ma.sucio = 'S'",
        (error, results, fields) => {
          if (error) {
            console.log(
              "matricula_asignatura.js - obtener_matriculas_asignaturas_sucias - Error en la consulta: " +
                error
            );
            conexion.dbConn.rollback();
            reject(error);
          } else {
            conexion.dbConn.commit();
            resolve(results);
          }
        }
      );
    });
  });
}

module.exports.obtener_matriculas_asignaturas_alumno =
  obtener_matriculas_asignaturas_alumno;

module.exports.obtener_matricula_asignatura = obtener_matricula_asignatura;
module.exports.obtener_nid_matricula_asignatura =
  obtener_nid_matricula_asignatura;

module.exports.actualizar_fecha_alta_matricula_asignatura =
  actualizar_fecha_alta_matricula_asignatura;
module.exports.actualizar_fecha_baja_matricula_asignatura =
  actualizar_fecha_baja_matricula_asignatura;

module.exports.add_asignatura = add_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.dar_baja_asignatura = dar_baja_asignatura;

module.exports.modificar_sucio = modificar_sucio;

module.exports.obtener_matriculas_asignaturas_sucias =
  obtener_matriculas_asignaturas_sucias;
