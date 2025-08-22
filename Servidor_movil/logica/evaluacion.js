const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");
const parametros = require("./parametros");
const ficheros = require("./ficheros");

function insertarEvaluacion(
  nid_evaluacion,
  nid_trimestre,
  nid_asignatura,
  nid_profesor,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".evaluacion (nid_evaluacion, nid_trimestre, nid_asignatura, nid_profesor, fecha_actualizacion, sucio) VALUES (" +
      conexion.dbConn.escape(nid_evaluacion) +
      ", " +
      conexion.dbConn.escape(nid_trimestre) +
      ", " +
      conexion.dbConn.escape(nid_asignatura) +
      ", " +
      conexion.dbConn.escape(nid_profesor) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", 'N' " +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al insertar la evaluación:", err);
          conexion.dbConn.rollback();
          reject(err);
        } else {
          conexion.dbConn.commit();
          resolve(result.insertId);
        }
      });
    });
  });
}

function actualizarEvaluacion(
  nid_evaluacion,
  nid_trimestre,
  nid_asignatura,
  nid_profesor,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evaluacion SET nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre) +
      ", nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      ", nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ", sucio = 'N'" +
      " WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion) +
      " and fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (err, result) => {
        if (err) {
          console.error("Error al actualizar la evaluación:", err);
          conexion.dbConn.rollback();
          reject(err);
        } else {
          conexion.dbConn.commit();
          resolve(result.affectedRows);
        }
      });
    });
  });
}

function existeEvaluacion(nid_evaluacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS count FROM " +
      constantes.ESQUEMA +
      ".evaluacion WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "Error al verificar la existencia de la evaluación:",
          error
        );
        reject(error);
      }
      resolve(results[0].count > 0);
    });
  });
}

function requiereActualizarEvaluacion(nid_evaluacion, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS requiere FROM " +
      constantes.ESQUEMA +
      ".evaluacion WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nid_evaluacion) +
      " AND fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion));

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al verificar si requiere actualización:", error);
        reject(error);
      }
      resolve(results[0].requiere > 0);
    });
  });
}

async function registrarEvaluacion(
  nid_evaluacion,
  nid_trimestre,
  nid_asignatura,
  nid_profesor,
  fecha_actualizacion
) {
  try {
    const existe = await existeEvaluacion(nid_evaluacion);
    if (existe) {
      const requiereActualizar = await requiereActualizarEvaluacion(
        nid_evaluacion,
        fecha_actualizacion
      );
      if (requiereActualizar) {
        return await actualizarEvaluacion(
          nid_evaluacion,
          nid_trimestre,
          nid_asignatura,
          nid_profesor,
          fecha_actualizacion
        );
      } else {
        return "No se requiere actualización";
      }
    } else {
      return await insertarEvaluacion(
        nid_evaluacion,
        nid_trimestre,
        nid_asignatura,
        nid_profesor,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar la evaluación:", error);
    throw error;
  }
}

function obtenerEvaluacionesSucias() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " + constantes.ESQUEMA + ".evaluacion WHERE sucio = 'S'";

    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.error("Error al obtener las evaluaciones sucias:", err);
        reject(err);
      }
      resolve(results);
    });
  });
}

function obtenerEvaluacionTrimestre(nid_matricula, nid_trimestre) {
  return new Promise((resolve, reject) => {
    const sql =
      "select e.nid_evaluacion, e.nid_trimestre, e.nid_asignatura, e.nid_profesor, " +
      "em.nota, em.nid_tipo_progreso, em.comentario," +
      "concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) as profesor, " +
      "t.descripcion as trimestre, c.descripcion as curso, " +
      "concat(p_alumno.nombre, ' ', p_alumno.primer_apellido, ' ', p_alumno.segundo_apellido) as alumno " +
      "from " +
      constantes.ESQUEMA +
      ".evaluacion e, " +
      constantes.ESQUEMA +
      ".evaluacion_matricula em, " +
      constantes.ESQUEMA +
      ".asignaturas a, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".persona p_alumno, " +
      constantes.ESQUEMA +
      ".trimestre t, " +
      constantes.ESQUEMA +
      ".curso c " +
      "where e.nid_evaluacion = em.nid_evaluacion " +
      "and e.nid_trimestre = t.nid_trimestre " +
      "and e.nid_asignatura = a.nid_asignatura " +
      "and p.nid_persona = e.nid_profesor " +
      "and ma.nid_matricula = m.nid_matricula " +
      "and p_alumno.nid_persona = m.nid_persona " +
      "and m.nid_curso = c.nid_curso " +
      "and em.nid_matricula_asignatura = ma.nid_matricula_asignatura " +
      "and ma.nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      " and e.nid_trimestre = " +
      conexion.dbConn.escape(nid_trimestre) +
      " order by  e.nid_evaluacion";

    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.error(
          "evaluacion.js -> obtenerEvaluacionTrimestre: Error al obtener la evaluación del trimestre:",
          err
        );
        reject(err);
      }
      if (results.length == 0) {
        resolve(null);
      }
      resolve(results[0]);
    });
  });
}

function obtenerEvaluaciones(nid_matricula) {
  return new Promise((resolve, reject) => {
    const sql =
      "select e.nid_evaluacion, em.nid_evaluacion_matricula, e.nid_trimestre, e.nid_asignatura, e.nid_profesor, " +
      "em.nota, em.nid_tipo_progreso, em.comentario, t.nid_trimestre, t.descripcion nombre_trimestre, tp.descripcion tipo_progreso, " +
      "a.nid_asignatura, a.descripcion nombre_asignatura, concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) nombre_profesor " +
      "from " +
      constantes.ESQUEMA +
      ".evaluacion e, " +
      constantes.ESQUEMA +
      ".evaluacion_matricula em, " +
      constantes.ESQUEMA +
      ".trimestre t, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA +
      ".tipo_progreso tp, " +
      constantes.ESQUEMA +
      ".asignaturas a, " +
      constantes.ESQUEMA +
      ".persona p " +
      "where e.nid_evaluacion = em.nid_evaluacion " +
      "and e.nid_asignatura = a.nid_asignatura " +
      "and e.nid_trimestre = t.nid_trimestre " +
      "and em.nid_matricula_asignatura = ma.nid_matricula_asignatura " +
      "and em.nid_tipo_progreso = tp.nid_tipo_progreso " +
      "and p.nid_persona = e.nid_profesor " +
      "and ma.nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      " order by t.nid_trimestre, e.nid_evaluacion";

    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.error(
          "evaluacion.js -> obtenerEvaluaciones: Error al obtener las evaluaciones:",
          err
        );
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
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
        "em.nota, em.nid_tipo_progreso, em.comentario, t.nid_trimestre, t.descripcion nombre_trimestre, tp.descripcion tipo_progreso, " +
        "  tp.descripcion progreso,  c.descripcion curso,  concat(p2.nombre, ' ' , p2.primer_apellido, ' ', p2.segundo_apellido) alumno " +
        "from " +
        constantes.ESQUEMA +
        ".evaluacion e, " +
        "      " +
        constantes.ESQUEMA +
        ".evaluacion_matricula em, " +
        "      " +
        constantes.ESQUEMA +
        ".matricula m, " +
        "      " +
        constantes.ESQUEMA +
        ".matricula_asignatura ma, " +
        "      " +
        constantes.ESQUEMA +
        ".asignaturas a, " +
        "      " +
        constantes.ESQUEMA +
        ".trimestre t, " +
        "      " +
        constantes.ESQUEMA +
        ".persona p, " +
        "      " +
        constantes.ESQUEMA +
        ".persona p2, " +
        "      " +
        constantes.ESQUEMA +
        ".tipo_progreso tp, " +
        "      " +
        constantes.ESQUEMA +
        ".curso c " +
        "where e.nid_evaluacion = em.nid_evaluacion  " +
        "  and a.nid_asignatura = e.nid_asignatura " +
        "  and c.nid_curso = m.nid_curso " +
        "  and t.nid_trimestre = e.nid_trimestre " +
        "  and p.nid_persona = e.nid_profesor " +
        "  and ma.nid_matricula_asignatura = em.nid_matricula_asignatura " +
        "  and p2.nid_persona = m.nid_persona " +
        "  and m.nid_matricula = ma.nid_matricula " +
        "  and em.nid_tipo_progreso = tp.nid_tipo_progreso " +
        "  and m.nid_matricula = " +
        conexion.dbConn.escape(nid_matricula) +
        filtro_tipo_asignatura +
        filtro_trimestre +
        " order by t.nid_trimestre, a.nid_asignatura",
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

function textoAcentosARtf(texto) {
  const mapa = {
    á: "\\'e1",
    é: "\\'e9",
    í: "\\'ed",
    ó: "\\'f3",
    ú: "\\'fa",
    Á: "\\'c1",
    É: "\\'c9",
    Í: "\\'cd",
    Ó: "\\'d3",
    Ú: "\\'da",
    ñ: "\\'f1",
    Ñ: "\\'d1",
    ü: "\\'fc",
    Ü: "\\'dc",
    º: "\\'ba",
    ª: "\\'aa",
  };
  // Incluye º y ª en la expresión regular:
  return texto.replace(/[áéíóúÁÉÍÓÚñÑüÜºª]/g, (c) => mapa[c] || c);
}

async function generar_boletin(nid_matricula, nid_trimestre) {
  try {
    // Se recupera la plantilla //
    let ruta_plantilla = await parametros.obtener_valor("PLANTILLA_NOTAS");
    let texto = await ficheros.readFile(ruta_plantilla["valor"]);

    // Se obtiene la evaluación de tutor //
    let evaluacion_tutor = null;
    evaluacion_tutor = await obtenerEvaluacionTrimestre(
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

      texto = texto.replace("||PROGRESO_LENGUAJE||", progreso_lenguaje);
      texto = texto.replace("||COMENTARIO_LENGUAJE||", comentario_lenguaje);
      texto = texto.replace(
        "||NIVEL_SOLFEO||",
        textoAcentosARtf(asignatura_lenguaje)
      );
      texto = texto.replace("||ASIGNATURA_SOLFEO||", "Lenguaje Musical");

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

      texto_instrumento =
        texto_instrumento +
        "\\cell\\row\\pard\\plain \\s86\\sl1\\slmult0{\\*\\hyphen2\\hyphlead2\\hyphtrail2\\hyphmax0}\\fahang\\li0\\ri0\\lin0\\rin0\\fi-2\\cf0\\hich\\af0\\langfe2052\\dbch\\af0\\loch\\f0\\fs24\\lang3082\\li0\\ri0\\lin0\\rin0\\fi-2{\\rtlch \\ltrch\\loch\n\r";

      texto = texto
        .toString()
        .replace("||PLANTILLA_INSTRUMENTO||", texto_instrumento);

      return textoAcentosARtf(texto);
    } else {
      throw new Error("No se han encontrado evaluaciones");
    }
  } catch (error) {
    console.log("evaluacion.js - generar_boletin ->" + error);
    throw new Error("Error al generar el boletín");
  }
}

function obtenerEvaluacionesAsignaturas(nidAsignatura, nidCurso, nidTrimestre, nidProfesor)
{
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT e.nid_evaluacion, e.nid_trimestre, e.nid_asignatura, e.nid_profesor, " +
      "em.nota, em.nid_tipo_progreso, em.comentario, m.nid_persona as nid_alumno, " +
      "ma.nid_matricula_asignatura, " +
      "concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) as profesor, " +
      "concat(pa.nombre, ' ', pa.primer_apellido, ' ', pa.segundo_apellido) as alumno " +
      "FROM " + constantes.ESQUEMA + ".evaluacion e " +
      "JOIN " + constantes.ESQUEMA + ".evaluacion_matricula em ON e.nid_evaluacion = em.nid_evaluacion " +
      "JOIN " + constantes.ESQUEMA + ".matricula_asignatura ma ON ma.nid_matricula_asignatura = em.nid_matricula_asignatura " +
      "JOIN " + constantes.ESQUEMA + ".matricula m ON m.nid_matricula = ma.nid_matricula " +
      "JOIN " + constantes.ESQUEMA + ".persona p ON p.nid_persona = e.nid_profesor " +
      "JOIN " + constantes.ESQUEMA + ".persona pa ON pa.nid_persona = m.nid_persona " +
      "JOIN " + constantes.ESQUEMA + ".profesor_alumno_matricula pam on pam.nid_matricula_asignatura = em.nid_matricula_asignatura " +
      "WHERE e.nid_asignatura = " + conexion.dbConn.escape(nidAsignatura) + " AND e.nid_trimestre = " +
      conexion.dbConn.escape(nidTrimestre) + " AND m.nid_curso = " + conexion.dbConn.escape(nidCurso) +
       " AND e.nid_profesor = " + conexion.dbConn.escape(nidProfesor);

    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.error("Error al obtener las evaluaciones de asignaturas:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}


function obtenerEvaluacion(nidCurso, nidAsignatura, nidTrimestre)
{
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT e.* FROM " +
      constantes.ESQUEMA +
      ".evaluacion e, " +
      constantes.ESQUEMA +
      ".asignaturas a " +
      "WHERE e.nid_asignatura = a.nid_asignatura " +
      " AND e.nid_curso = " +
      conexion.dbConn.escape(nidCurso) +
      " AND e.nid_asignatura = " +
      conexion.dbConn.escape(nidAsignatura) +
      " AND e.nid_trimestre = " +
      conexion.dbConn.escape(nidTrimestre);

    
    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener la evaluacion:", err);
        reject(err);
      } else {
        resolve(result.length > 0 ? result[0] : null);
      }
    });
  });
}

function insertarEvaluacion(nidTrimestre, nidAsignatura, nidProfesor, nidCurso)
{
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".evaluacion (nid_trimestre, nid_asignatura, nid_profesor, nid_curso, sucio) VALUES (" +
      conexion.dbConn.escape(nidTrimestre) +
      ", " +
      conexion.dbConn.escape(nidAsignatura) +
      ", " +
      conexion.dbConn.escape(nidProfesor) +
      ", " +
      conexion.dbConn.escape(nidCurso) +
      ", 'S'" +
      ")";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al registrar la evaluacion:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function insertarEvaluacionMatricula(nidEvaluacion, nota, nid_tipo_progreso, nid_matricula_asignatura, comentario)
{
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".evaluacion_matricula (nid_evaluacion, nota, nid_tipo_progreso, nid_matricula_asignatura, comentario) VALUES (" +
      conexion.dbConn.escape(nidEvaluacion) +
      ", nullif(" +
      conexion.dbConn.escape(nota) + ", '')" +
      ", " +
      conexion.dbConn.escape(nid_tipo_progreso) +
      ", " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", trim(" +
      conexion.dbConn.escape(comentario) +
      "))";

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al registrar la evaluacion matricula:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function actualizarEvaluacionMatricula(nidEvaluacionMatricula, nidEvaluacion, nota, nid_tipo_progreso, nid_matricula_asignatura, comentario)
{
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".evaluacion_matricula SET nota = nullif(" + conexion.dbConn.escape(nota) + ", ''" +
      "), nid_tipo_progreso = " + conexion.dbConn.escape(nid_tipo_progreso) +
      ", comentario = trim(" + conexion.dbConn.escape(comentario) + ")" +
      ", nid_evaluacion = " + conexion.dbConn.escape(nidEvaluacion) +
      ", nid_matricula_asignatura = " + conexion.dbConn.escape(nid_matricula_asignatura) +
      ", sucio =  'S'" +
      ", fecha_actualizacion = NOW()" +
      " WHERE nid_evaluacion_matricula = " + conexion.dbConn.escape(nidEvaluacionMatricula);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al actualizar la evaluacion matricula:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function existeEvaluacionMatricula(nidEvaluacion, nidMatriculaAsignatura)
{
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nidEvaluacion) +
      " AND nid_matricula_asignatura = " +
      conexion.dbConn.escape(nidMatriculaAsignatura);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al verificar la existencia de la matricula:", err);
        reject(err);
      } else {
        resolve(result[0].existe > 0);
      }
    });
  });
}

function obtenerEvaluacionMatricula(nidEvaluacion, nidMatriculaAsignatura)
{
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".evaluacion_matricula WHERE nid_evaluacion = " +
      conexion.dbConn.escape(nidEvaluacion) +
      " AND nid_matricula_asignatura = " +
      conexion.dbConn.escape(nidMatriculaAsignatura);

    conexion.dbConn.query(sql, (err, result) => {
      if (err) {
        console.error("Error al obtener la evaluacion matricula:", err);
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

module.exports.insertarEvaluacion = insertarEvaluacion;
module.exports.obtenerEvaluacionesSucias = obtenerEvaluacionesSucias;
module.exports.obtenerEvaluacionTrimestre = obtenerEvaluacionTrimestre;
module.exports.obtenerEvaluaciones = obtenerEvaluaciones;
module.exports.generar_boletin = generar_boletin;
module.exports.obtenerEvaluacionesAsignaturas = obtenerEvaluacionesAsignaturas;
module.exports.obtenerEvaluacion = obtenerEvaluacion;
module.exports.insertarEvaluacionMatricula = insertarEvaluacionMatricula;
module.exports.insertarEvaluacion = insertarEvaluacion;
module.exports.actualizarEvaluacionMatricula = actualizarEvaluacionMatricula;
module.exports.existeEvaluacionMatricula = existeEvaluacionMatricula;
module.exports.obtenerEvaluacionMatricula = obtenerEvaluacionMatricula;
module.exports.registrarEvaluacion = registrarEvaluacion;