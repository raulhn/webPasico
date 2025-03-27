const conexion = require("../conexion.js");
const constantes = require("../constantes.js");

function crear_ficha_asistencia(nombre, fecha, nid_asignatura, nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia(nombre, fecha, nid_asignatura, nid_profesor) values(" +
          conexion.dbConn.escape(nombre) +
          ", " +
          "ifnull(str_to_date(nullif(" +
          conexion.dbConn.escape(fecha) +
          ", '') , '%Y-%m-%d'), sysdate()) " +
          ", " +
          conexion.dbConn.escape(nid_asignatura) +
          ", " +
          conexion.dbConn.escape(nid_profesor) +
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

function copiar_ficha_asistencia_alumno(
  nid_ficha_asistencia,
  nid_nueva_ficha_asistencia
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia_alumno(nid_ficha_asistencia, nid_alumno) " +
          "select " +
          conexion.dbConn.escape(nid_nueva_ficha_asistencia) +
          ", nid_alumno from " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia_alumno " +
          " where nid_ficha_asistencia = " +
          conexion.dbConn.escape(nid_ficha_asistencia),
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

function copiar_ficha_asistencia(
  nombre,
  fecha,
  nid_profesor,
  nid_ficha_asistencia
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia(nombre, fecha, nid_profesor, nid_asignatura) " +
          "select " +
          conexion.dbConn.escape(nombre) +
          ", ifnull(str_to_date(nullif(" +
          conexion.dbConn.escape(fecha) +
          ", '') , '%Y-%m-%d'), sysdate()) " +
          " , nid_profesor, nid_asignatura from " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia " +
          " where nid_ficha_asistencia = " +
          conexion.dbConn.escape(nid_ficha_asistencia) +
          "  and nid_profesor = " +
          conexion.dbConn.escape(nid_profesor),
        async (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(error);
          } else {
            conexion.dbConn.commit();
            let nid_nueva_ficha_asistencia = results.insertId;
            await copiar_ficha_asistencia_alumno(
              nid_ficha_asistencia,
              nid_nueva_ficha_asistencia
            );
            resolve(nid_nueva_ficha_asistencia);
          }
        }
      );
    });
  });
}

function obtener_fichas_asistencias(nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(fa.nombre, ' - ', trim(to_char(fa.fecha, 'dd/mm/yyyy')), ' - ' , a.descripcion) etiqueta, fa.nid_ficha_asistencia " +
        " from " +
        constantes.ESQUEMA_BD +
        ".ficha_asistencia fa, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        " where fa.nid_asignatura = a.nid and fa.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor) +
        " order by fa.fecha desc",
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

function obtener_ficha_asistencia(nid_profesor, nid_ficha_asistencia) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(fa.nombre, ' - ', trim(to_char(fa.fecha, 'dd/mm/yyyy')), ' - ' , a.descripcion) etiqueta, fa.nid_ficha_asistencia " +
        " from " +
        constantes.ESQUEMA_BD +
        ".ficha_asistencia fa, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        " where fa.nid_asignatura = a.nid and fa.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor) +
        " and fa.nid_ficha_asistencia = " +
        conexion.dbConn.escape(nid_ficha_asistencia) +
        " order by fa.fecha desc",
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

function obtener_alumnos_ficha_seleccion(nid_ficha_asistencia, nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) etiqueta, p.nid " +
        " from " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".ficha_asistencia fa, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        " " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam " +
        " where fa.nid_profesor = pam.nid_profesor " +
        " and pam.nid_matricula_asignatura = ma.nid " +
        " and ma.nid_matricula = m.nid " +
        " and ma.nid_asignatura = fa.nid_asignatura " +
        " and m.nid_persona = p.nid " +
        " and (ma.fecha_baja is null or ma.fecha_baja > sysdate()) " +
        " and fa.nid_ficha_asistencia = " +
        conexion.dbConn.escape(nid_ficha_asistencia) +
        " and fa.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor),
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

function registrar_ficha_asistencia_alumno(nid_ficha_asistencia, nid_alumno) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia_alumno(nid_ficha_asistencia, nid_alumno) " +
          "values(" +
          conexion.dbConn.escape(nid_ficha_asistencia) +
          ", " +
          conexion.dbConn.escape(nid_alumno) +
          ")",
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

function eliminar_ficha_asistencia_alumno(nid_ficha_asistencia_alumno) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia_alumno where nid_ficha_asistencia_alumno = " +
          conexion.dbConn.escape(nid_ficha_asistencia_alumno),
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

function obtener_fichas_asistencias_alumno(nid_ficha_asistencia) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      " select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) etiqueta, fam.nid_ficha_asistencia_alumno, " +
        " asistencia, comentario " +
        " from pasico_gestor.persona p, " +
        "      pasico_gestor.ficha_asistencia_alumno fam " +
        " where p.nid = fam.nid_alumno " +
        "   and fam.nid_ficha_asistencia = " +
        conexion.dbConn.escape(nid_ficha_asistencia),
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

function actualizar_ficha_asistencia_alumnos(
  nid_ficha_asistencia_alumno,
  asistencia,
  comentario
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia_alumno set asistencia = " +
          conexion.dbConn.escape(asistencia) +
          ", comentario = " +
          conexion.dbConn.escape(comentario) +
          " where nid_ficha_asistencia_alumno = " +
          conexion.dbConn.escape(nid_ficha_asistencia_alumno),
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

function cancelar_fichas_asistencia_alumnos(nid_ficha_asistencia) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".ficha_asistencia_alumno where nid_ficha_asistencia = " +
          conexion.dbConn.escape(nid_ficha_asistencia),
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

async function async_cancelar_ficha_asisntencia(
  nid_ficha_asistencia,
  resolve,
  reject
) {
  await cancelar_fichas_asistencia_alumnos(nid_ficha_asistencia);

  conexion.dbConn.beginTransaction(() => {
    conexion.dbConn.query(
      "delete from " +
        constantes.ESQUEMA_BD +
        ".ficha_asistencia where nid_ficha_asistencia = " +
        conexion.dbConn.escape(nid_ficha_asistencia),
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
}

function cancelar_ficha_asistencia(nid_ficha_asistencia) {
  return new Promise((resolve, reject) => {
    async_cancelar_ficha_asisntencia(nid_ficha_asistencia, resolve, reject);
  });
}

module.exports.crear_ficha_asistencia = crear_ficha_asistencia;
module.exports.copiar_ficha_asistencia = copiar_ficha_asistencia;
module.exports.obtener_fichas_asistencias = obtener_fichas_asistencias;
module.exports.obtener_ficha_asistencia = obtener_ficha_asistencia;
module.exports.obtener_alumnos_ficha_seleccion =
  obtener_alumnos_ficha_seleccion;
module.exports.registrar_ficha_asistencia_alumno =
  registrar_ficha_asistencia_alumno;
module.exports.eliminar_ficha_asistencia_alumno =
  eliminar_ficha_asistencia_alumno;
module.exports.obtener_fichas_asistencias_alumno =
  obtener_fichas_asistencias_alumno;

module.exports.actualizar_ficha_asistencia_alumnos =
  actualizar_ficha_asistencia_alumnos;

module.exports.cancelar_ficha_asistencia = cancelar_ficha_asistencia;
