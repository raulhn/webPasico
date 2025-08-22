const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const ficheros = require("../logica/ficheros.js");
const parametros = require("./parametros.js");
const comun = require("./comun.js");

function obtener_trimestres() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " + constantes.ESQUEMA_BD + ".trimestre",
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

function existe_evaluacion(nid_trimestre, nid_asignatura, nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".evaluacion " +
        " where nid_trimestre = " +
        conexion.dbConn.escape(nid_trimestre) +
        " and nid_asignatura = " +
        conexion.dbConn.escape(nid_asignatura) +
        " and nid_profesor = " +
        conexion.dbConn.escape(nid_profesor),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]["num"] > 0);
        }
      }
    );
  });
}

function existe_evaluacion_nid(nid_evaluacion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".evaluacion " +
        " where nid_evaluacion = " +
        conexion.dbConn.escape(nid_evaluacion),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]["num"] > 0);
        }
      }
    );
  });
}

function obtener_evaluacion(nid_trimestre, nid_asignatura, nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".evaluacion " +
        " where nid_trimestre = " +
        conexion.dbConn.escape(nid_trimestre) +
        " and nid_asignatura = " +
        conexion.dbConn.escape(nid_asignatura) +
        " and nid_profesor = " +
        conexion.dbConn.escape(nid_profesor),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function crear_evaluacion(nid_trimestre, nid_asignatura, nid_profesor) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".evaluacion" +
          "(nid_trimestre, nid_asignatura, nid_profesor) values(" +
          conexion.dbConn.escape(nid_trimestre) +
          ", " +
          conexion.dbConn.escape(nid_asignatura) +
          ", " +
          conexion.dbConn.escape(nid_profesor) +
          ")",
        (error, results, fields) => {
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

async function registrar_evaluacion(
  nid_trimestre,
  nid_asignatura,
  nid_profesor
) {
  try {
    let bExiste_evaluacion = await existe_evaluacion(
      nid_trimestre,
      nid_asignatura,
      nid_profesor
    );

    if (bExiste_evaluacion) {
      let evaluacion = await obtener_evaluacion(
        nid_trimestre,
        nid_asignatura,
        nid_profesor
      );
      return evaluacion["nid_evaluacion"];
    } else {
      let nid_evaluacion = await crear_evaluacion(
        nid_trimestre,
        nid_asignatura,
        nid_profesor
      );
      return nid_evaluacion;
    }
  } catch (error) {
    console.log("evaluacion.js - registrar_evaluacion ->" + error);
    throw new Error("Error al registrar la evaluación");
  }
}

function existe_evaluacion_matricula_nid(nid_evaluacion_matricula) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula " +
        " where nid_evaluacion_matricula = " +
        conexion.dbConn.escape(nid_evaluacion_matricula),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]["num"] > 0);
        }
      }
    );
  });
}

function insertar_evaluacion_matricula_servicio(
  nid_evaluacion_matricula,
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  comentario,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula" +
        "(nid_evaluacion_matricula, nid_evaluacion, nota, nid_tipo_progreso, comentario, fecha_actualizacion, sucio, nid_curso) " +
        "values(" +
        conexion.dbConn.escape(nid_evaluacion_matricula) +
        ", " +
        conexion.dbConn.escape(nid_evaluacion) +
        ", " +
        conexion.dbConn.escape(nota) +
        ", " +
        conexion.dbConn.escape(nid_tipo_progreso) +
        ", " +
        conexion.dbConn.escape(comentario) +
        ", " +
        conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
        ", " +
        conexion.dbConn.escape('N') +
        ", " +
        conexion.dbConn.escape(nid_curso) +
        ")";
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

function actualizar_evaluacion_matricula_servicio(
  nid_evaluacion_matricula,
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  comentario,
  fecha_actualizacion,
  nid_curso
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula set " +
        " nid_evaluacion = " +
        conexion.dbConn.escape(nid_evaluacion) +
        ", nota = " +
        conexion.dbConn.escape(nota) +
        ", nid_tipo_progreso = " +
        conexion.dbConn.escape(nid_tipo_progreso) +
        ", comentario = " +
        conexion.dbConn.escape(comentario) +
        ", fecha_actualizacion = " +
        conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
        ", sucio = 'N'" +
        ", nid_curso = " +
        conexion.dbConn.escape(nid_curso) +
        " where nid_evaluacion_matricula = " +
        conexion.dbConn.escape(nid_evaluacion_matricula) +
        " and fecha_actualizacion = " +
        conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

async function registrar_evaluacion_servicio(
  nid_evaluacion_matricula,
  nid_evaluacion,
  nota,
  nid_tipo_progreso,
  comentario,
  fecha_actualizacion,
  nid_curso
) {
  try {
    const bExiste_evaluacion_matricula = await existe_evaluacion_matricula_nid(
      nid_evaluacion_matricula
    );

    if (!bExiste_evaluacion_matricula) {
      await insertar_evaluacion_matricula_servicio(
        nid_evaluacion_matricula,
        nid_evaluacion,
        nota,
        nid_tipo_progreso,
        comentario,
        fecha_actualizacion,
        nid_curso
      );
    } else {
      await actualizar_evaluacion_matricula_servicio(
        nid_evaluacion_matricula,
        nid_evaluacion,
        nota,
        nid_tipo_progreso,
        comentario,
        fecha_actualizacion,
        nid_curso
      );
    }
  } catch (error) {
    console.log("evaluacion.js - registrar_evaluacion_servicio ->" + error);
    throw new Error("Error al registrar la evaluación de matrícula");
  }
}

function existe_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula " +
        " where nid_evaluacion = " +
        conexion.dbConn.escape(nid_evaluacion) +
        " and nid_matricula_asignatura = " +
        conexion.dbConn.escape(nid_matricula_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]["num"] > 0);
        }
      }
    );
  });
}

function obtener_evaluacion_matricula(
  nid_evaluacion,
  nid_matricula_asignatura
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula " +
        " where nid_evaluacion = " +
        conexion.dbConn.escape(nid_evaluacion) +
        " and nid_matricula_asignatura = " +
        conexion.dbConn.escape(nid_matricula_asignatura),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function obtener_evaluaciones_matricula(nid_evaluacion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select em.*, m.nid_persona nid_alumno from " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula em, " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m " +
        " where em.nid_evaluacion = " +
        conexion.dbConn.escape(nid_evaluacion) +
        " and ma.nid = em.nid_matricula_asignatura " +
        " and m.nid = ma.nid_matricula",
      (error, results, fields) => {
        if (error) {
          console.log(error, reject(error));
        } else {
          resolve(results);
        }
      }
    );
  });
}

function actualizar_evaluacion_matricula(
  nid_evaluacion_matricula,
  nota,
  nid_tipo_progreso,
  comentario
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".evaluacion_matricula set " +
          " nota = " +
          conexion.dbConn.escape(nota) +
          ", nid_tipo_progreso = " +
          conexion.dbConn.escape(nid_tipo_progreso) +
          ", comentario = " +
          conexion.dbConn.escape(comentario) +
          ", fecha_actualizacion = now()" +
          ", sucio = 'S'" +
          " where nid_evaluacion_matricula = " +
          conexion.dbConn.escape(nid_evaluacion_matricula),
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

function insertar_evaluacion_matricula(
  nid_evaluacion,
  nid_matricula_asignatura,
  nota,
  nid_tipo_progreso,
  comentario
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".evaluacion_matricula" +
          "(nid_evaluacion, nid_matricula_asignatura, nota, nid_tipo_progreso, comentario) " +
          "values(" +
          conexion.dbConn.escape(nid_evaluacion) +
          ", " +
          conexion.dbConn.escape(nid_matricula_asignatura) +
          ", " +
          conexion.dbConn.escape(nota) +
          ", " +
          conexion.dbConn.escape(nid_tipo_progreso) +
          ", " +
          conexion.dbConn.escape(comentario) +
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

async function registrar_evaluacion_matricula(
  nid_evaluacion,
  nid_matricula_asignatura,
  nota,
  nid_tipo_progreso,
  comentario
) {
  try {
    console.log("evaluacion.js - registrar_evaluacion_matricula");
    console.log("nid_evaluacion", nid_evaluacion);
    console.log("nid_matricula_asignatura", nid_matricula_asignatura);
    console.log("nota", nota);
    console.log("nid_tipo_progreso", nid_tipo_progreso);
    console.log("comentario", comentario);
    if (nid_tipo_progreso == 0) {
      console.log(
        "evaluacion.js - registrar_evaluacion_matricula - nid_tipo_progreso es 0, No se registra la evaluación"
      );
      return;
    }
    let bExiste_evaluacion_matricula = await existe_evaluacion_matricula(
      nid_evaluacion,
      nid_matricula_asignatura
    );

    if (bExiste_evaluacion_matricula) {
      let evaluacion_matricula = await obtener_evaluacion_matricula(
        nid_evaluacion,
        nid_matricula_asignatura
      );
      await actualizar_evaluacion_matricula(
        evaluacion_matricula["nid_evaluacion_matricula"],
        nota,
        nid_tipo_progreso,
        comentario
      );
      return;
    } else {
      await insertar_evaluacion_matricula(
        nid_evaluacion,
        nid_matricula_asignatura,
        nota,
        nid_tipo_progreso,
        comentario
      );
      return;
    }
  } catch (error) {
    console.log("evaluacion.js - registrar_evaluacion_matricula ->" + error);
    throw new Error("Error al registrar la evaluación de matrícula");
  }
}

function obtener_evaluacion_matricula_asginatura_tipo(
  nid_matricula,
  tipo_asignatura,
  nid_trimestre
) {
  return new Promise((resolve, reject) => {
    let filtro_tipo_asignatura = "";
    let filtro_trimestre = "";

    if (tipo_asignatura >= 0) {
      filtro_tipo_asignatura =
        " and a.tipo_asignatura = " + conexion.dbConn.escape(tipo_asignatura);
    }

    if (nid_trimestre > 0) {
      filtro_trimestre =
        " and e.nid_trimestre = " + conexion.dbConn.escape(nid_trimestre);
    }

    conexion.dbConn.query(
      "select a.descripcion asignatura, t.descripcion trimestre, concat(p.nombre, ' ' , p.primer_apellido, ' ', p.segundo_apellido) profesor, " +
        " em.*, tp.descripcion progreso,  c.descripcion curso,  concat(p2.nombre, ' ' , p2.primer_apellido, ' ', p2.segundo_apellido) alumno " +
        "from " +
        constantes.ESQUEMA_BD +
        ".evaluacion e, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula em, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".asignatura a, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".trimestre t, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".persona p2, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".tipo_progreso tp, " +
        "      " +
        constantes.ESQUEMA_BD +
        ".curso c " +
        "where e.nid_evaluacion = em.nid_evaluacion  " +
        "  and a.nid = e.nid_asignatura " +
        "  and c.nid = m.nid_curso " +
        "  and t.nid_trimestre = e.nid_trimestre " +
        "  and p.nid = e.nid_profesor " +
        "  and ma.nid = em.nid_matricula_asignatura " +
        "  and p2.nid = m.nid_persona " +
        "  and m.nid = ma.nid_matricula " +
        "  and em.nid_tipo_progreso = tp.nid_tipo_progreso " +
        "  and m.nid = " +
        conexion.dbConn.escape(nid_matricula) +
        filtro_tipo_asignatura +
        filtro_trimestre +
        " order by t.nid_trimestre, a.nid",
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

async function obtener_evaluacion_matricula_asginatura(nid_matricula) {
  try {
    return await obtener_evaluacion_matricula_asginatura_tipo(
      nid_matricula,
      -1,
      0
    );
  } catch (error) {
    console.log(
      "evaluacion.js - obtener_evaluacion_matricula_asginatura ->" + error
    );
    throw new Error("Error al obtener la evaluación de matrícula");
  }
}

async function obtener_evaluacion_tutor(nid_matricula, nid_trimestre) {
  try {
    let array_evaluacion_matricula =
      await obtener_evaluacion_matricula_asginatura_tipo(
        nid_matricula,
        constantes.ASIGNATURA_INSTRUMENTO_BANDA,
        nid_trimestre
      );

    if (array_evaluacion_matricula.length > 0) {
      return array_evaluacion_matricula[0];
    } else {
      array_evaluacion_matricula =
        await obtener_evaluacion_matricula_asginatura_tipo(
          nid_matricula,
          constantes.ASIGNATURA_INSTRUMENTO_NO_BANDA,
          nid_trimestre
        );
      if (array_evaluacion_matricula.length > 0) {
        return array_evaluacion_matricula[0];
      } else {
        array_evaluacion_matricula =
          await obtener_evaluacion_matricula_asginatura_tipo(
            nid_matricula,
            constantes.ASIGNATURA_LENGUAJE,
            nid_trimestre
          );
        if (array_evaluacion_matricula.length > 0) {
          return array_evaluacion_matricula[0];
        } else {
          return null;
        }
      }
    }
  } catch (error) {
    console.log("evaluacion.js - obtener_evaluacion_tutor ->" + error);
    throw new Error("Error al obtener la evaluación de tutor");
  }
}

async function generar_boletin(nid_matricula, nid_trimestre) {
  try {
    // Se recupera la plantilla //
    let ruta_plantilla = await parametros.obtener_valor("PLANTILLA_NOTAS");
    console.log("ruta_plantilla", ruta_plantilla);
    let texto = await ficheros.readFile(ruta_plantilla["valor"]);

    // Se obtiene la evaluación de tutor //
    let evaluacion_tutor = null;
    evaluacion_tutor = await obtener_evaluacion_tutor(
      nid_matricula,
      nid_trimestre
    );

    let profesor = "";
    let curso = "";
    let trimestre = "";

    if (evaluacion_tutor !== null) {
      profesor = evaluacion_tutor["profesor"];
      curso = evaluacion_tutor["curso"];
      trimestre = evaluacion_tutor["trimestre"];
      alumno = evaluacion_tutor["alumno"];

      texto = texto.toString().replace("||NOMBRE_PROFESOR||", profesor);
      texto = texto.toString().replace("||EVALUACION_REALIZADA||", trimestre);
      texto = texto.toString().replace("||NOMBRE_ALUMNO||", alumno);
      texto = texto.toString().replace("||CURSO_BOLETIN||", curso);

      let array_evaluacion_lenguaje =
        await obtener_evaluacion_matricula_asginatura_tipo(
          nid_matricula,
          constantes.ASIGNATURA_LENGUAJE,
          nid_trimestre
        );

      let asignatura_lenguaje = "";

      let nota_lenguaje = "";
      let progreso_lenguaje = "";
      let comentario_lenguaje = "";

      if (array_evaluacion_lenguaje.length > 0) {
        let evaluacion_lenguaje = array_evaluacion_lenguaje[0];

        asignatura_lenguaje = evaluacion_lenguaje["asignatura"];

        nota_lenguaje = "(" + evaluacion_lenguaje["nota"] + ")";
        progreso_lenguaje = evaluacion_lenguaje["progreso"];
        comentario_lenguaje = evaluacion_lenguaje["comentario"];
      }

      texto = texto.toString().replace("||NOTA_LENGUAJE||", nota_lenguaje);
      texto = texto
        .toString()
        .replace("||ASIGNATURA_LENGUAJE||", asignatura_lenguaje);
      texto = texto
        .toString()
        .replace("||PROGRESO_LENGUAJE||", progreso_lenguaje);
      texto = texto
        .toString()
        .replace("||COMENTARIO_LENGUAJE||", comentario_lenguaje);

      let texto_instrumento = "";

      let array_evaluacion_instrumento_banda =
        await obtener_evaluacion_matricula_asginatura_tipo(
          nid_matricula,
          constantes.ASIGNATURA_INSTRUMENTO_BANDA,
          nid_trimestre
        );

      for (let i = 0; i < array_evaluacion_instrumento_banda.length; i++) {
        let evaluacion_instrumento = array_evaluacion_instrumento_banda[i];
        let texto_instrumento_parametro = await parametros.obtener_valor(
          "PLANTILLA_NOTAS_INSTRUMENTO"
        );
        let texto_instrumento_aux = texto_instrumento_parametro["valor"];

        if (evaluacion_instrumento["nota"] == 0) {
          texto_instrumento_aux = texto_instrumento_aux
            .toString()
            .replace("||NOTA_INSTRUMENTO||", "");
        }

        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||NOTA_INSTRUMENTO||",
            "(" + evaluacion_instrumento["nota"] + ")"
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||ASIGNATURA_INSTRUMENTO||",
            evaluacion_instrumento["asignatura"]
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||PROGRESO_INSTRUMENTO||",
            evaluacion_instrumento["progreso"]
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||COMENTARIO_INSTRUMENTO||",
            evaluacion_instrumento["comentario"]
          );

        texto_instrumento = texto_instrumento + texto_instrumento_aux;
      }

      let array_evaluacion_instrumento_no_banda =
        await obtener_evaluacion_matricula_asginatura_tipo(
          nid_matricula,
          constantes.ASIGNATURA_INSTRUMENTO_NO_BANDA,
          nid_trimestre
        );

      for (let i = 0; i < array_evaluacion_instrumento_no_banda.length; i++) {
        let evaluacion_instrumento = array_evaluacion_instrumento_no_banda[i];
        let texto_instrumento_parametro = await parametros.obtener_valor(
          "PLANTILLA_NOTAS_INSTRUMENTO"
        );
        let texto_instrumento_aux = texto_instrumento_parametro["valor"];

        if (evaluacion_instrumento["nota"] == 0) {
          texto_instrumento_aux = texto_instrumento_aux
            .toString()
            .replace("||NOTA_INSTRUMENTO||", "");
        }

        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||NOTA_INSTRUMENTO||",
            "(" + evaluacion_instrumento["nota"] + ")"
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||ASIGNATURA_INSTRUMENTO||",
            evaluacion_instrumento["asignatura"]
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||PROGRESO_INSTRUMENTO||",
            evaluacion_instrumento["progreso"]
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||COMENTARIO_INSTRUMENTO||",
            evaluacion_instrumento["comentario"]
          );

        texto_instrumento = texto_instrumento + texto_instrumento_aux;
      }

      let array_evaluacion_banda =
        await obtener_evaluacion_matricula_asginatura_tipo(
          nid_matricula,
          constantes.ASIGNATURA_BANDA,
          nid_trimestre
        );

      for (let i = 0; i < array_evaluacion_banda.length; i++) {
        let evaluacion_instrumento = array_evaluacion_banda[i];
        let texto_instrumento_parametro = await parametros.obtener_valor(
          "PLANTILLA_NOTAS_INSTRUMENTO"
        );
        let texto_instrumento_aux = texto_instrumento_parametro["valor"];

        if (evaluacion_instrumento["nota"] == 0) {
          texto_instrumento_aux = texto_instrumento_aux
            .toString()
            .replace("||NOTA_INSTRUMENTO||", "");
        }

        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||NOTA_INSTRUMENTO||",
            "(" + evaluacion_instrumento["nota"] + ")"
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||ASIGNATURA_INSTRUMENTO||",
            evaluacion_instrumento["asignatura"]
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||PROGRESO_INSTRUMENTO||",
            evaluacion_instrumento["progreso"]
          );
        texto_instrumento_aux = texto_instrumento_aux
          .toString()
          .replace(
            "||COMENTARIO_INSTRUMENTO||",
            evaluacion_instrumento["comentario"]
          );

        texto_instrumento = texto_instrumento + texto_instrumento_aux;
      }

      texto = texto
        .toString()
        .replace("||PLANTILLA_INSTRUMENTO||", texto_instrumento);
      return texto;
    } else {
      throw new Error("No se han encontrado evaluaciones");
    }
  } catch (error) {
    console.log("evaluacion.js - genrar_boletin ->" + error);
    throw new Error("Error al generar el boletín");
  }
}

function obtener_evaluaciones_sucias() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".evaluacion where sucio = 'S'",
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

function actualizar_evaluacion_sucio(nid_evaluacion, sucio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".evaluacion set sucio = " +
          conexion.dbConn.escape(sucio) +
          " where nid_evaluacion = " +
          conexion.dbConn.escape(nid_evaluacion),
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

function obtener_evaluacion_matriculas_sucias() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".evaluacion_matricula where sucio = 'S'",
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

function actualizar_evaluacion_matricula_sucio(
  nid_evaluacion_matricula,
  sucio
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".evaluacion_matricula set sucio = " +
          conexion.dbConn.escape(sucio) +
          " where nid_evaluacion_matricula = " +
          conexion.dbConn.escape(nid_evaluacion_matricula),
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

module.exports.obtener_trimestres = obtener_trimestres;
module.exports.registrar_evaluacion = registrar_evaluacion;
module.exports.registrar_evaluacion_matricula = registrar_evaluacion_matricula;

module.exports.obtener_evaluacion = obtener_evaluacion;
module.exports.obtener_evaluacion_matricula = obtener_evaluacion_matricula;
module.exports.obtener_evaluaciones_matricula = obtener_evaluaciones_matricula;

module.exports.existe_evaluacion = existe_evaluacion;

module.exports.obtener_evaluacion_matricula_asginatura =
  obtener_evaluacion_matricula_asginatura;

module.exports.generar_boletin = generar_boletin;

module.exports.obtener_evaluaciones_sucias = obtener_evaluaciones_sucias;
module.exports.actualizar_evaluacion_sucio = actualizar_evaluacion_sucio;

module.exports.obtener_evaluacion_matriculas_sucias =
  obtener_evaluacion_matriculas_sucias;
module.exports.actualizar_evaluacion_matricula_sucio =
  actualizar_evaluacion_matricula_sucio;
module.exports.existe_evaluacion_nid = existe_evaluacion_nid;
module.exports.registrar_evaluacion = registrar_evaluacion;
module.exports.registrar_evaluacion_servicio = registrar_evaluacion_servicio;