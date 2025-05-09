const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function registrar_asignatura(descripcion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".asignatura(descripcion) values(" +
          conexion.dbConn.escape(descripcion) +
          ")",
        async (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve(results.insertId);
          }
        }
      );
    });
  });
}

function actualizar_asignatura(nid_asignatura, descripcion, tipo_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".asignatura set descripcion = " +
          conexion.dbConn.escape(descripcion) +
          ", tipo_asignatura = " +
          conexion.dbConn.escape(tipo_asignatura) +
          ", fecha_actualizacion = sysdate()" +
          " where nid = " +
          conexion.dbConn.escape(nid_asignatura),
        async (error, results, fields) => {
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

function eliminar_asignatura(nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".asignatura where nid = " +
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

function existe_asignatura(nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".asignatura where nid = " +
        conexion.dbConn.escape(nid_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]["cont"]);
        }
      }
    );
  });
}

function obtener_asignaturas() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid, descripcion from " +
        constantes.ESQUEMA_BD +
        ".asignatura order by descripcion",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_asignaturas_profesor(nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct a.* " +
        "from " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam, " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        "where pam.nid_matricula_asignatura = ma.nid " +
        " and ma.nid_asignatura = a.nid " +
        " and pam.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_asignatura(nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid, descripcion, tipo_asignatura as tipo_asignatura, instrumento_banda, fecha_actualizacion from " +
        constantes.ESQUEMA_BD +
        ".asignatura where nid = " +
        conexion.dbConn.escape(nid_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else if (results.length < 1) {
          reject();
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function add_profesor(nid_asignatura, nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".profesor(nid_asignatura, nid_persona) values(" +
          conexion.dbConn.escape(nid_asignatura) +
          ", " +
          conexion.dbConn.escape(nid_persona) +
          ")",
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

function eliminar_profesor(nid_asignatura, nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".profesor where nid_asignatura = " +
          conexion.dbConn.escape(nid_asignatura) +
          " and nid_persona = " +
          conexion.dbConn.escape(nid_persona),
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

function obtener_profesores() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.*, a.nid nid_asignatura, a.descripcion from " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".asignatura a, " +
        constantes.ESQUEMA_BD +
        ".profesor pr where p.nid = pr.nid_persona and pr.nid_asignatura = a.nid",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_profesores_distinct() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct p.* from " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".asignatura a, " +
        constantes.ESQUEMA_BD +
        ".profesor pr where p.nid = pr.nid_persona and pr.nid_asignatura = a.nid",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_profesores_asignatura(nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.*, p.nid nid_persona, concat(ifnull(p.nif, ' '), ' ',  p.nombre, ' ', ifnull(p.primer_apellido, ' '), ' ' , ifnull(p.segundo_apellido, ' ')) etiqueta, a.nid nid_asignatura, a.descripcion from " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".asignatura a, " +
        constantes.ESQUEMA_BD +
        ".profesor pr where p.nid = pr.nid_persona and pr.nid_asignatura = a.nid and " +
        "a.nid = " +
        conexion.dbConn.escape(nid_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_profesores_asignatura_curso(nid_asignatura, nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.nid, concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) etiqueta " +
        "from pasico_gestor.persona p,                                                                " +
        "	 pasico_gestor.matricula m,                                                               " +
        "	 pasico_gestor.matricula_asignatura ma,                                                   " +
        "	 pasico_gestor.profesor_alumno_matricula pam                                              " +
        "where p.nid = pam.nid_profesor                                                               " +
        "  and m.nid = ma.nid_matricula                                                               " +
        "  and pam.nid_matricula_asignatura = ma.nid                                                  " +
        "  and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " " +
        "  and ma.nid_asignatura = " +
        conexion.dbConn.escape(nid_asignatura) +
        "   " +
        "group by p.nid, concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido)        ",

      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

module.exports.registrar_asignatura = registrar_asignatura;
module.exports.actualizar_asignatura = actualizar_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.existe_asignatura = existe_asignatura;

module.exports.obtener_asignaturas_profesor = obtener_asignaturas_profesor;
module.exports.obtener_asignaturas = obtener_asignaturas;
module.exports.obtener_asignatura = obtener_asignatura;

module.exports.add_profesor = add_profesor;
module.exports.eliminar_profesor = eliminar_profesor;

module.exports.obtener_profesores = obtener_profesores;
module.exports.obtener_profesores_distinct = obtener_profesores_distinct;
module.exports.obtener_profesores_asignatura = obtener_profesores_asignatura;

module.exports.obtener_profesores_asignatura_curso =
  obtener_profesores_asignatura_curso;
