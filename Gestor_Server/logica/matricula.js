const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const logica_asignatura = require("./asignatura.js");
const curso = require("./curso.js");

function existe_matricula(nid_persona, nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".matricula where nid_persona = " +
        conexion.dbConn.escape(nid_persona) +
        " and nid_curso = " +
        conexion.dbConn.escape(nid_curso),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]["cont"] > 0);
        }
      }
    );
  });
}

function obtener_nid_matricula(nid_persona, nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid from " +
        constantes.ESQUEMA_BD +
        ".matricula where nid_persona = " +
        conexion.dbConn.escape(nid_persona) +
        " and nid_curso = " +
        conexion.dbConn.escape(nid_curso),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else if (results.length < 1) {
          console.log("Matricula no encontrada");
          reject("Matricula no encontrada");
        } else {
          resolve(results[0]["nid"]);
        }
      }
    );
  });
}

async function async_registrar_matricula(
  nid_persona,
  nid_curso,
  resolve,
  reject
) {
  let bExiste = await existe_matricula(nid_persona, nid_curso);
  if (!bExiste) {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".matricula(nid_persona, nid_curso) values(" +
          conexion.dbConn.escape(nid_persona) +
          ", " +
          conexion.dbConn.escape(nid_curso) +
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
  }
}

function registrar_matricula(nid_persona, nid_curso) {
  return new Promise((resolve, reject) => {
    async_registrar_matricula(nid_persona, nid_curso, resolve, reject);
  });
}

function actualizar_matricula(nid_matricula, nid_persona, nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".matricula set nid_curso = " +
          conexion.dbConn.escape(nid_curso) +
          " where nid = " +
          conexion.dbConn.escape(nid_matricula),
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

function obtener_matriculas(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".matricula where nid_persona = " +
        conexion.dbConn.escape(nid_persona),
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

function obtener_alumnos_asignaturas(nid_curso, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select  p.*, ma.nid_matricula, ma.nid nid_matricula_asignatura from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " and ma.nid_asignatura = " +
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

function obtener_alumnos_asignaturas_alta(nid_curso, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select  p.*, ma.nid_matricula, ma.nid nid_matricula_asignatura from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " and ma.nid_asignatura = " +
        conexion.dbConn.escape(nid_asignatura) +
        " and (fecha_baja is null or fecha_baja >= sysdate())",
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

function obtener_alumnos_asignaturas_baja(nid_curso, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select  p.*, ma.nid_matricula, ma.nid nid_matricula_asignatura from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " and ma.nid_asignatura = " +
        conexion.dbConn.escape(nid_asignatura) +
        " and  fecha_baja < sysdate()",
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

function obtener_alumnos_cursos_alta(nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.* " +
        "from " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula m " +
        "where p.nid = m.nid_persona " +
        "and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " and exists (select ma.* " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma " +
        "where ma.nid_matricula = m.nid " +
        "and (ma.fecha_baja is null or ma.fecha_baja > sysdate()))",
      (error, results, fields) => {
        if (error) {
          console.log(error), reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_alumnos_cursos_baja(nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.* " +
        "from " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula m " +
        "where p.nid = m.nid_persona " +
        "and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " and not exists (select ma.* " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma " +
        "where ma.nid_matricula = m.nid " +
        "and (ma.fecha_baja is null or ma.fecha_baja > sysdate()))",
      (error, results, fields) => {
        if (error) {
          console.log(error), reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_alumnos_cursos(nid_curso) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct p.*from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso),
      (error, results, fields) => {
        if (error) {
          console.log(error), reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_alumnos_curso_actual() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct p.* from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = " +
        "(select nid from " +
        constantes.ESQUEMA_BD +
        ".curso where ano = (select max(ano) from " +
        constantes.ESQUEMA_BD +
        ".curso))" +
        " and (fecha_baja is null or fecha_baja >= sysdate())",
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

function obtener_alumnos_profesor(nid_profesor, nid_curso, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct p.*, a.nid nid_asignatura, a.descripcion descripcion_asignatura, m.nid nid_matricula " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        "where m.nid = ma.nid_matricula " +
        "and p.nid = m.nid_persona " +
        "and ma.nid = pam.nid_matricula_asignatura " +
        "and ma.nid_asignatura = a.nid " +
        "and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " " +
        "and pam.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor) +
        " " +
        "and (a.nid = " +
        conexion.dbConn.escape(nid_asignatura) +
        " or " +
        conexion.dbConn.escape(nid_asignatura) +
        " = 0) ",
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

function obtener_alumnos_profesor_alta(
  nid_profesor,
  nid_curso,
  nid_asignatura
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct p.*, a.nid nid_asignatura, a.descripcion descripcion_asignatura, m.nid nid_matricula " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        "where m.nid = ma.nid_matricula " +
        "and p.nid = m.nid_persona " +
        "and ma.nid = pam.nid_matricula_asignatura " +
        "and (ma.fecha_baja is null or ma.fecha_baja >= sysdate()) " +
        "and ma.nid_asignatura = a.nid " +
        "and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " " +
        "and pam.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor) +
        " " +
        "and (a.nid = " +
        conexion.dbConn.escape(nid_asignatura) +
        " or " +
        conexion.dbConn.escape(nid_asignatura) +
        " = 0) ",
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

function obtener_alumnos_profesor_baja(
  nid_profesor,
  nid_curso,
  nid_asignatura
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct p.*, a.nid nid_asignatura, a.descripcion descripcion_asignatura, m.nid_matricula " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        "where m.nid = ma.nid_matricula " +
        "and p.nid = m.nid_persona " +
        "and ma.nid = pam.nid_matricula_asignatura " +
        "and ma.fecha_baja < sysdate() " +
        "and ma.nid_asignatura = a.nid " +
        "and m.nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " " +
        "and pam.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor) +
        " " +
        "and (a.nid = " +
        conexion.dbConn.escape(nid_asignatura) +
        " or " +
        conexion.dbConn.escape(nid_asignatura) +
        " = 0) ",
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

function obtener_matriculas_alumno(nid_alumno) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select c.descripcion descripcion_curso, m.* from " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".curso c where m.nid_curso = c.nid and m.nid_persona = " +
        conexion.dbConn.escape(nid_alumno) +
        " order by ano desc",
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

function obtener_matricula(nid_matricula) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select c.descripcion descripcion_curso, m.*, concat(nombre,  ' ', primer_apellido, ' ', segundo_apellido) nombre_alumno " +
        " from " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".curso c " +
        "where m.nid_curso = c.nid and m.nid = " +
        conexion.dbConn.escape(nid_matricula) +
        " and p.nid = m.nid_persona",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else if (results.length < 1) {
          console.log("No se ha encontrado la matricula");
          reject();
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function obtener_asignaturas_matricula(nid_matricula) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select a.*, m.nid_persona nid_alumno, date_format(ma.fecha_alta, '%Y-%m-%d') fecha_alta, " +
        " date_format(ma.fecha_alta, '%d-%m-%Y') fecha_alta_local, date_format(ma.fecha_baja, '%d-%m-%Y') fecha_baja_local, " +
        " date_format(ma.fecha_baja, '%Y-%m-%d') fecha_baja, ma.nid nid_matricula_asignatura, a.descripcion nombre_asignatura, p.*, p.nid nid_profesor, " +
        "concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) nombre_profesor " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".asignatura a, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam " +
        "where ma.nid_asignatura = a.nid and " +
        "m.nid = ma.nid_matricula and " +
        "nid_matricula = " +
        conexion.dbConn.escape(nid_matricula) +
        " and ma.nid = pam.nid_matricula_asignatura and pam.nid_profesor = p.nid",
      (error, results, fields) => {
        if (error) {
          console.log(
            "matricula.js - obtenerr_asignaturas_matricula ->" + error
          );
          reject("Se ha producido un error al recuperar las matriculas");
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_asignaturas_matricula_activas(nid_matricula) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select a.*, m.nid_persona nid_alumno, ma.*, a.descripcion nombre_asignatura, p.*, p.nid nid_profesor " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".asignatura a, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam " +
        "where ma.nid_asignatura = a.nid and " +
        "m.nid = ma.nid_matricula and " +
        "nid_matricula = " +
        conexion.dbConn.escape(nid_matricula) +
        " and ma.nid = pam.nid_matricula_asignatura and pam.nid_profesor = p.nid and " +
        " (ma.fecha_baja is null or ma.fecha_baja > sysdate()) ",
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

function obtener_asignaturas_matricula_activas_fecha(
  nid_matricula,
  fecha_desde,
  fecha_hasta
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select a.*, m.nid_persona nid_alumno, date_format(ma.fecha_alta, '%Y-%m-%d') fecha_alta, " +
        " date_format(ma.fecha_baja, '%Y-%m-%d') fecha_baja, ma.nid nid_matricula_asignatura, a.descripcion nombre_asignatura, p.*, p.nid nid_profesor " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".asignatura a, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam " +
        "where ma.nid_asignatura = a.nid and " +
        "m.nid = ma.nid_matricula and " +
        "nid_matricula = " +
        conexion.dbConn.escape(nid_matricula) +
        " and ma.nid = pam.nid_matricula_asignatura and pam.nid_profesor = p.nid and " +
        " (ma.fecha_baja is null or ma.fecha_baja >= " +
        "str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_desde) +
        ", '') , '%Y-%m-%d')) " +
        " and " +
        " ma.fecha_alta <= " +
        "str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_hasta) +
        ", '') , '%Y-%m-%d')",
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
          resolve();
        }
      }
    );
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
            await alta_profesor_matricula(results.insertId, nid_profesor);
            conexion.dbConn.commit();
            resolve();
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

function obtener_cursos_profesor(nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select distinct c.* " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".curso c " +
        "where ma.nid = pam.nid_matricula_asignatura " +
        " and m.nid = ma.nid_matricula " +
        " and m.nid_curso = c.nid " +
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

function registrar_precio_manual(nid_matricula, precio, comentario_precio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "update " +
        constantes.ESQUEMA_BD +
        ".matricula set precio_manual = " +
        conexion.dbConn.escape(precio) +
        ", comentario_precio_manual = " +
        conexion.dbConn.escape(comentario_precio) +
        " where nid = " +
        conexion.dbConn.escape(nid_matricula),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

// Funciones para dar de baja en matriculas a un profesor //
function obtener_matriculas_activas_profesor(nid_profesor, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      " select pam.* from " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula pam, " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m " +
        "where pam.nid_matricula_asignatura = ma.nid and " +
        "ma.nid_matricula = m.nid and " +
        " m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and " +
        " pam.nid_profesor = " +
        conexion.dbConn.escape(nid_profesor) +
        " and " +
        " ma.nid_asignatura = " +
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

async function async_obtener_matricula_activas_asignatura(
  nid_profesor,
  nid_asignatura,
  resolve,
  reject
) {
  let nid_ultimo_curso = await curso.obtener_ultimo_curso();
  conexion.dbConn.query(
    " select pam.nid_matricula_asignatura, p.* from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where pam.nid_matricula_asignatura = ma.nid and " +
      "m.nid_persona = p.nid and " +
      "ma.nid_matricula = m.nid and " +
      " m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and " +
      " pam.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " and " +
      " ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " and " +
      " (ma.fecha_baja is null or ma.fecha_baja > sysdate()) " +
      " and " +
      " m.nid_curso = " +
      conexion.dbConn.escape(nid_ultimo_curso),
    (error, results, fields) => {
      if (error) {
        console.log(error);
        reject();
      } else {
        resolve(results);
      }
    }
  );
}

function obtener_matriculas_activas_asignatura(nid_profesor, nid_asignatura) {
  return new Promise((resolve, reject) => {
    async_obtener_matricula_activas_asignatura(
      nid_profesor,
      nid_asignatura,
      resolve,
      reject
    );
  });
}

function obtener_matricula_asignatura(nid_matricula, nid_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura where nid_matricula = " +
        conexion.dbConn.escape(nid_matricula) +
        ", nid_asignatura = " +
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

async function async_obtener_matriculas_activas(resolve, reject) {
  let nid_ultimo_curso = await curso.obtener_ultimo_curso();
  conexion.dbConn.query(
    " select pam.nid_matricula_asignatura, p.* from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where pam.nid_matricula_asignatura = ma.nid and " +
      "m.nid_persona = p.nid and " +
      "ma.nid_matricula = m.nid and " +
      " m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and " +
      " (ma.fecha_baja is null or ma.fecha_baja > sysdate()) " +
      " and " +
      " m.nid_curso = " +
      conexion.dbConn.escape(nid_ultimo_curso),
    (error, results, fields) => {
      if (error) {
        console.log(error);
        reject();
      } else {
        resolve(results);
      }
    }
  );
}

function obtener_matriculas_activas() {
  return new Promise((resolve, reject) => {
    async_obtener_matriculas_activas(resolve, reject);
  });
}

async function async_obtener_personas_con_matricula_activa(resolve, reject) {
  let nid_ultimo_curso = await curso.obtener_ultimo_curso();
  conexion.dbConn.query(
    " select p.nid, ma.nid_matricula from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where pam.nid_matricula_asignatura = ma.nid and " +
      "m.nid_persona = p.nid and " +
      "ma.nid_matricula = m.nid and " +
      " m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and " +
      " (ma.fecha_baja is null or ma.fecha_baja > sysdate()) " +
      " and " +
      " m.nid_curso = " +
      conexion.dbConn.escape(nid_ultimo_curso) +
      " " +
      "group by p.nid, ma.nid_matricula ",
    (error, results, fields) => {
      if (error) {
        console.log(error);
        reject();
      } else {
        resolve(results);
      }
    }
  );
}

function obtener_personas_con_matricula_activa() {
  return new Promise((resolve, reject) => {
    async_obtener_personas_con_matricula_activa(resolve, reject);
  });
}

async function async_obtener_personas_matricula_activa_fecha(
  fecha_desde,
  fecha_hasta,
  resolve,
  reject
) {
  let nid_ultimo_curso = await curso.obtener_ultimo_curso();
  conexion.dbConn.query(
    "select p.nid, ma.nid_matricula from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where pam.nid_matricula_asignatura = ma.nid and " +
      "m.nid_persona = p.nid and " +
      "ma.nid_matricula = m.nid and " +
      " m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and " +
      " (ma.fecha_baja is null or ma.fecha_baja >= " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_desde) +
      ", '') , '%Y-%m-%d')) " +
      " and " +
      " ma.fecha_alta <= " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_hasta) +
      ", '') , '%Y-%m-%d') and " +
      " m.nid_curso = " +
      conexion.dbConn.escape(nid_ultimo_curso) +
      " " +
      "group by p.nid, ma.nid_matricula ",
    (error, results, fields) => {
      if (error) {
        console.log(error);
        reject();
      } else {
        resolve(results);
      }
    }
  );
}

function obtener_personas_matricula_activa_fecha(fecha_desde, fecha_hasta) {
  return new Promise((resolve, reject) => {
    async_obtener_personas_matricula_activa_fecha(
      fecha_desde,
      fecha_hasta,
      resolve,
      reject
    );
  });
}

function baja_profesor_alumno_matricula(nid_profesor_alumno_matricula) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "update " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula set fecha_baja = sysdate() where nid = " +
        conexion.dbConn.escape(nid_profesor_alumno_matricula),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

function alta_profesor_alumno_matricula_baja(
  nid_profesor_sustituto,
  nid_profesor_alumno_matricula
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula(nid_profesor, nid_matricula_asignatura, fecha_alta)" +
        " select " +
        conexion.dbConn.escape(nid_profesor_sustituto) +
        ", nid_matricula_asignatura, sysdate() from pasico_gestor.profesor_alumno_matricula where nid = " +
        conexion.dbConn.escape(nid_profesor_alumno_matricula),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

function obtener_profesor_alumno_matricula(nid_matricula_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".profesor_alumno_matricula where nid_matricula_asignatura = " +
        conexion.dbConn.escape(nid_matricula_asignatura) +
        " and fecha_baja is null",
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

function sustituir_profesor_curso_actual(
  nid_profesor,
  nid_profesor_sustituto,
  nid_asignatura
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      try {
        let matriculas_a_susituir = await obtener_matriculas_activas_profesor(
          nid_profesor,
          nid_asignatura
        );

        for (let i = 0; i < matriculas_a_susituir.length; i++) {
          await alta_profesor_alumno_matricula_baja(
            nid_profesor_sustituto,
            matriculas_a_susituir[i]["nid"]
          );
          await baja_profesor_alumno_matricula(matriculas_a_susituir[i]["nid"]);
        }

        await logica_asignatura.eliminar_profesor(nid_asignatura, nid_profesor);

        conexion.dbConn.commit();
        resolve();
      } catch (e) {
        console.log(e);
        conexion.dbConn.rollback();
        reject();
      }
    });
  });
}

async function async_sustituir_profesor_alumno(
  nid_profesor,
  nid_matricula_asignatura,
  nid_asignatura,
  resolve,
  reject
) {
  try {
    conexion.dbConn.beginTransaction(async () => {
      try {
        let profesor_alumno_matricula = await obtener_profesor_alumno_matricula(
          nid_matricula_asignatura
        );
        await baja_profesor_alumno_matricula(profesor_alumno_matricula["nid"]);
        await alta_profesor_alumno_matricula_baja(
          nid_profesor,
          profesor_alumno_matricula["nid"]
        );

        conexion.dbConn.commit();
        resolve();
      } catch (error) {
        console.log(error);
        conexion.dbConn.rollback();
        reject();
      }
    });
  } catch (error) {
    console.log(error);
    reject();
  }
}

function sustituir_profesor_alumno(
  nid_profesor,
  nid_matricula_asignatura,
  nid_asignatura
) {
  return new Promise((resolve, reject) => {
    async_sustituir_profesor_alumno(
      nid_profesor,
      nid_matricula_asignatura,
      nid_asignatura,
      resolve,
      reject
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

module.exports.existe_matricula = existe_matricula;
module.exports.obtener_nid_matricula = obtener_nid_matricula;

module.exports.registrar_matricula = registrar_matricula;
module.exports.actualizar_matricula = actualizar_matricula;
module.exports.obtener_matriculas = obtener_matriculas;

module.exports.obtener_alumnos_asignaturas = obtener_alumnos_asignaturas;
module.exports.obtener_alumnos_asignaturas_alta =
  obtener_alumnos_asignaturas_alta;
module.exports.obtener_alumnos_asignaturas_baja =
  obtener_alumnos_asignaturas_baja;

module.exports.obtener_alumnos_cursos = obtener_alumnos_cursos;
module.exports.obtener_alumnos_cursos_alta = obtener_alumnos_cursos_alta;
module.exports.obtener_alumnos_cursos_baja = obtener_alumnos_cursos_baja;

module.exports.obtener_alumnos_curso_actual = obtener_alumnos_curso_actual;

module.exports.obtener_alumnos_profesor = obtener_alumnos_profesor;
module.exports.obtener_alumnos_profesor_alta = obtener_alumnos_profesor_alta;
module.exports.obtener_alumnos_profesor_baja = obtener_alumnos_profesor_baja;

module.exports.obtener_matriculas_alumno = obtener_matriculas_alumno;
module.exports.obtener_matricula = obtener_matricula;
module.exports.obtener_asignaturas_matricula = obtener_asignaturas_matricula;

module.exports.add_asignatura = add_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.dar_baja_asignatura = dar_baja_asignatura;

module.exports.obtener_cursos_profesor = obtener_cursos_profesor;

module.exports.registrar_precio_manual = registrar_precio_manual;

module.exports.sustituir_profesor_curso_actual =
  sustituir_profesor_curso_actual;

module.exports.obtener_matriculas_activas_asignatura =
  obtener_matriculas_activas_asignatura;

module.exports.obtener_matriculas_activas = obtener_matriculas_activas;
module.exports.obtener_personas_con_matricula_activa =
  obtener_personas_con_matricula_activa;
module.exports.obtener_personas_matricula_activa_fecha =
  obtener_personas_matricula_activa_fecha;

module.exports.obtener_asignaturas_matricula_activas =
  obtener_asignaturas_matricula_activas;
module.exports.obtener_asignaturas_matricula_activas_fecha =
  obtener_asignaturas_matricula_activas_fecha;

module.exports.sustituir_profesor_alumno = sustituir_profesor_alumno;

module.exports.actualizar_fecha_alta_matricula_asignatura =
  actualizar_fecha_alta_matricula_asignatura;
module.exports.actualizar_fecha_baja_matricula_asignatura =
  actualizar_fecha_baja_matricula_asignatura;
