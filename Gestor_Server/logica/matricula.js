const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const logica_asignatura = require("./asignatura.js");
const curso = require("./curso.js");
const gestorProfesorAlumnoMatricula = require("./profesor_alumno_matricula.js");
const gestorProfesorMatricula = require("./profesor_matricula.js");
const gestor_base_datos = require("./base_datos.js");

async function existe_matricula(nid_persona, nid_curso) {
  try {
    const sql =
      "select count(*) cont from " +
      constantes.ESQUEMA_BD +
      ".matricula where nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and nid_curso = " +
      conexion.dbConn.escape(nid_curso);

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["cont"] > 0;
  } catch (error) {
    console.log("Error en existe_matricula: " + error);
    throw new Error("Error al comprobar si existe la matricula");
  }
}

async function obtener_nid_matricula(nid_persona, nid_curso) {
  try {
    const sql =
      "select nid from " +
      constantes.ESQUEMA_BD +
      ".matricula where nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and nid_curso = " +
      conexion.dbConn.escape(nid_curso);

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["nid"];
  } catch (error) {
    console.log("Error en obtener_nid_matricula: " + error);
    throw new Error("Error al obtener el nid de la matricula");
  }
}

async function registrar_matricula(nid_persona, nid_curso) {
  try {
    let bExiste = await existe_matricula(nid_persona, nid_curso);
    if (!bExiste) {
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".matricula(nid_persona, nid_curso) values(" +
        conexion.dbConn.escape(nid_persona) +
        ", " +
        conexion.dbConn.escape(nid_curso) +
        ")";

      const results = await gestor_base_datos.actualiza(sql);
      return results.insertId;
    }
    return;
  } catch (error) {
    console.log("matricula.js - registrar_matricula: " + error);
    throw new Error("Error al registrar la matricula");
  }
}

async function actualizar_matricula(nid_matricula, nid_persona, nid_curso) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".matricula set nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " where nid = " +
      conexion.dbConn.escape(nid_matricula);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("matricula.js - actualizar_matricula: " + error);
    throw new Error("Error al actualizar la matricula");
  }
}

async function obtener_matriculas(nid_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".matricula where nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("matricula.js - obtener_matriculas: " + error);
    throw new Error("Error al obtener las matriculas");
  }
}

async function obtener_alumnos_asignaturas(nid_curso, nid_asignatura) {
  try {
    const sql =
      "select  p.*, ma.nid_matricula, ma.nid nid_matricula_asignatura from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " and ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos asignaturas: " + error);
    throw new Error("Error al obtener alumnos asignaturas");
  }
}

async function obtener_alumnos_asignaturas_alta(nid_curso, nid_asignatura) {
  try {
    const sql =
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
      " and (fecha_baja is null or fecha_baja >= sysdate())";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos asignaturas alta: " + error);
    throw new Error("Error al obtener alumnos asignaturas alta");
  }
}

async function obtener_alumnos_asignaturas_baja(nid_curso, nid_asignatura) {
  try {
    const sql =
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
      " and  fecha_baja < sysdate()";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos asignaturas baja: " + error);
    throw new Error("Error al obtener alumnos asignaturas baja");
  }
}

async function obtener_alumnos_cursos_alta(nid_curso) {
  try {
    const sql =
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
      "and (ma.fecha_baja is null or ma.fecha_baja > sysdate()))";

    const results = await gestor_base_datos.consulta(sql);
    return restults;
  } catch (error) {
    console.log("Error al obtener alumnos cursos alta: " + error);
    throw new Error("Error al obtener alumnos cursos alta");
  }
}

async function obtener_alumnos_cursos_baja(nid_curso) {
  try {
    const sql =
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
      "and (ma.fecha_baja is null or ma.fecha_baja > sysdate()))";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos cursos baja: " + error);
    throw new Error("Error al obtener alumnos cursos baja");
  }
}

async function obtener_alumnos_cursos(nid_curso) {
  try {
    const sql =
      "select distinct p.*from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos cursos: " + error);
    throw new Error("Error al obtener alumnos cursos");
  }
}

async function obtener_alumnos_curso_actual() {
  try {
    const sql =
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
      " and (fecha_baja is null or fecha_baja >= sysdate())";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos curso actual: " + error);
    throw new Error("Error al obtener alumnos curso actual");
  }
}

async function obtener_alumnos_profesor(
  nid_profesor,
  nid_curso,
  nid_asignatura,
) {
  try {
    const sql =
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
      " = 0) ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos profesor: " + error);
    throw new Error("Error al obtener alumnos profesor");
  }
}

async function obtener_alumnos_profesor_alta(
  nid_profesor,
  nid_curso,
  nid_asignatura,
) {
  try {
    const sql =
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
      " = 0) " +
      "and (pam.fecha_baja is null or pam.fecha_baja >= sysdate()) ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos profesor alta: " + error);
    throw new Error("Error al obtener alumnos profesor alta");
  }
}

async function obtener_alumnos_profesor_baja(
  nid_profesor,
  nid_curso,
  nid_asignatura,
) {
  try {
    const sql =
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
      " = 0) " +
      "and pam.fecha_baja < sysdate() ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener alumnos profesor baja: " + error);
    throw new Error("Error al obtener alumnos profesor baja");
  }
}

async function obtener_matriculas_alumno(nid_alumno) {
  try {
    const sql =
      "select c.descripcion descripcion_curso, m.* from " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".curso c where m.nid_curso = c.nid and m.nid_persona = " +
      conexion.dbConn.escape(nid_alumno) +
      " order by ano desc";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener matriculas alumno: " + error);
    throw new Error("Error al obtener matriculas alumno");
  }
}

async function obtener_matricula(nid_matricula) {
  try {
    const sql =
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
      " and p.nid = m.nid_persona";

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      console.log("No se ha encontrado la matricula");
      throw new Error("No se ha encontrado la matricula");
    }

    return results[0];
  } catch (error) {
    console.log("Error al obtener matricula: " + error);
    throw new Error("Error al obtener matricula");
  }
}

async function obtener_objeto_matricula(nid_matricula) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".matricula where nid = " +
      conexion.dbConn.escape(nid_matricula);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      console.log("No se ha encontrado la matricula");
      throw new Error("No se ha encontrado la matricula");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("Error al obtener objeto matricula: " + error);
    throw new Error("Error al obtener objeto matricula");
  }
}

async function obtener_asignaturas_matricula(nid_matricula) {
  try {
    const sql =
      "select a.*, m.nid_persona nid_alumno, date_format(ma.fecha_alta, '%Y-%m-%d') fecha_alta, " +
      " date_format(ma.fecha_alta, '%d-%m-%Y') fecha_alta_local, date_format(ma.fecha_baja, '%d-%m-%Y') fecha_baja_local, " +
      " date_format(ma.fecha_baja, '%Y-%m-%d') fecha_baja, ma.nid nid_matricula_asignatura, a.descripcion nombre_asignatura, p.*, p.nid nid_profesor, " +
      "concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) nombre_profesor, " +
      " ifnull(date_format(ma.fecha_baja, '%d-%m-%Y'), date_format(pam.fecha_baja, '%d-%m-%Y')) fecha_hasta, " +
      " ifnull(date_format(pam.fecha_alta, '%d-%m-%Y'), date_format(ma.fecha_alta, '%d-%m-%Y')) fecha_desde " +
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
      " and ma.nid = pam.nid_matricula_asignatura and pam.nid_profesor = p.nid";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener asignaturas matricula: " + error);
    throw new Error("Error al obtener asignaturas matricula");
  }
}

async function obtener_asignaturas_matricula_activas(nid_matricula) {
  try {
    const sql =
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
      " (ma.fecha_baja is null or ma.fecha_baja > sysdate()) ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener asignaturas matricula activas: " + error);
    throw new Error("Error al obtener asignaturas matricula activas");
  }
}

async function obtener_asignaturas_matricula_activas_fecha(
  nid_matricula,
  fecha_desde,
  fecha_hasta,
) {
  try {
    const sql =
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
      ", '') , '%Y-%m-%d')";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(
      "Error al obtener asignaturas matricula activas fecha: " + error,
    );
    throw new Error("Error al obtener asignaturas matricula activas fecha");
  }
}

async function obtener_cursos_profesor(nid_profesor) {
  try {
    const sql =
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
      conexion.dbConn.escape(nid_profesor);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener cursos profesor: " + error);
    throw new Error("Error al obtener cursos profesor");
  }
}

async function registrar_precio_manual(
  nid_matricula,
  precio,
  comentario_precio,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".matricula set precio_manual = " +
      conexion.dbConn.escape(precio) +
      ", comentario_precio_manual = " +
      conexion.dbConn.escape(comentario_precio) +
      " where nid = " +
      conexion.dbConn.escape(nid_matricula);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al registrar precio manual: " + error);
    throw new Error("Error al registrar precio manual");
  }
}

// Funciones para dar de baja en matriculas a un profesor //
async function obtener_matriculas_activas_profesor(
  nid_profesor,
  nid_asignatura,
  nid_curso,
) {
  try {
    const sql =
      " select pam.* from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".matricula m " +
      "where pam.nid_matricula_asignatura = ma.nid and " +
      "ma.nid_matricula = m.nid and " +
      " m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " and " +
      " pam.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " and " +
      " ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener matriculas activas profesor: " + error);
    throw new Error("Error al obtener matriculas activas profesor");
  }
}

async function obtener_matriculas_activas_asignatura(
  nid_profesor,
  nid_asignatura,
) {
  try {
    nid_ultimo_curso = await curso.obtener_ultimo_curso();
    const sql =
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
      conexion.dbConn.escape(nid_ultimo_curso);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener matriculas activas asignatura: " + error);
    throw new Error("Error al obtener matriculas activas asignatura");
  }
}

async function obtener_matricula_asignatura(nid_matricula, nid_asignatura) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura where nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      ", nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);

    if (results.length < 1) {
      console.log("No se ha encontrado la matricula asignatura");
      throw new Error("No se ha encontrado la matricula asignatura");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("Error al obtener matricula asignatura: " + error);
    throw new Error("Error al obtener matricula asignatura");
  }
}

async function obtener_matriculas_activas() {
  try {
    nid_ultimo_curso = await curso.obtener_ultimo_curso();
    const sql =
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
      conexion.dbConn.escape(nid_ultimo_curso);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener matriculas activas");
  }
}

async function obtener_personas_con_matricula_activa() {
  try {
    nid_ultimo_curso = await curso.obtener_ultimo_curso();
    const sql =
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
      "group by p.nid, ma.nid_matricula ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener personas con matricula activa");
  }
}

async function obtener_personas_matricula_activa_fecha(
  fecha_desde,
  fecha_hasta,
) {
  try {
    nid_ultimo_curso = await curso.obtener_ultimo_curso();
    const sql =
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
      "group by p.nid, ma.nid_matricula ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener personas con matricula activa");
  }
}

async function baja_profesor_alumno_matricula(nid_profesor_alumno_matricula) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula set fecha_baja = sysdate() where nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al dar de baja profesor alumno matricula: " + error);
    throw new Error("Error al dar de baja profesor alumno matricula");
  }
}

async function alta_profesor_alumno_matricula_baja(
  nid_profesor_sustituto,
  nid_profesor_alumno_matricula,
) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula(nid_profesor, nid_matricula_asignatura, fecha_alta)" +
      " select " +
      conexion.dbConn.escape(nid_profesor_sustituto) +
      ", nid_matricula_asignatura, sysdate() from pasico_gestor.profesor_alumno_matricula where nid = " +
      conexion.dbConn.escape(nid_profesor_alumno_matricula);

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("Error al dar de alta profesor alumno matricula: " + error);
    throw new Error("Error al dar de alta profesor alumno matricula");
  }
}

async function obtener_profesor_alumno_matricula(nid_matricula_asignatura) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula where nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      " and fecha_baja is null";

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      return null;
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("Error al obtener profesor alumno matricula: " + error);
    throw new Error("Error al obtener profesor alumno matricula");
  }
}

async function sustituir_profesor_curso_actual(
  nid_profesor,
  nid_profesor_sustituto,
  nid_asignatura,
) {
  try {
    nid_curso_actual = await curso.obtener_ultimo_curso();
    let matriculas_a_susituir = await obtener_matriculas_activas_profesor(
      nid_profesor,
      nid_asignatura,
      nid_curso_actual,
    );

    for (let i = 0; i < matriculas_a_susituir.length; i++) {
      const nid_profesor_alumno_matricula =
        await alta_profesor_alumno_matricula_baja(
          nid_profesor_sustituto,
          matriculas_a_susituir[i]["nid"],
        );

      await gestorProfesorAlumnoMatricula.actualizar_sucio(
        nid_profesor_alumno_matricula,
        "S",
      );
      await baja_profesor_alumno_matricula(matriculas_a_susituir[i]["nid"]);

      await gestorProfesorAlumnoMatricula.actualizar_sucio(
        matriculas_a_susituir[i]["nid"],
        "S",
      );
    }

    console.log(
      "Se han dado de baja los profesores de la asignatura " +
        nid_asignatura +
        " y se han dado de alta los profesores sustitutos",
    );
    await logica_asignatura.eliminar_profesor(nid_asignatura, nid_profesor);
    await logica_asignatura.modificar_sucio_profesor(
      nid_profesor,
      nid_asignatura,
      "S",
    );
    return;
  } catch (e) {
    console.log("Error al sustituir profesor curso actual: " + e.message);
    throw new Error("Error al sustituir profesor curso actual: " + e.message);
  }
}

async function sustituir_profesor_alumno(
  nid_profesor,
  nid_matricula_asignatura,
) {
  try {
    let profesor_alumno_matricula = await obtener_profesor_alumno_matricula(
      nid_matricula_asignatura,
    );
    if (!profesor_alumno_matricula) {
      console.log(
        "Se registra nueva matricula a profesor: ",
        nid_profesor,
        nid_matricula_asignatura,
      );
      await gestorProfesorMatricula.alta_profesor_matricula(
        nid_matricula_asignatura,
        nid_profesor,
      );
    } else {
      await baja_profesor_alumno_matricula(profesor_alumno_matricula["nid"]);

      await gestorProfesorAlumnoMatricula.actualizar_sucio(
        profesor_alumno_matricula["nid"],
        "S",
      );
      const nid_profesor_alumno_matricula =
        await alta_profesor_alumno_matricula_baja(
          nid_profesor,
          profesor_alumno_matricula["nid"],
        );

      await gestorProfesorAlumnoMatricula.actualizar_sucio(
        nid_profesor_alumno_matricula,
        "S",
      );
    }
    return;
  } catch (error) {
    console.log("Error al sustituir profesor_alumno_matricula", error);
    throw new Error("Error al sustituir profesor alumno: " + error.message);
  }
}

async function actualizar_sucio(nid_matricula, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".matricula set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid = " +
      conexion.dbConn.escape(nid_matricula);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("Error al actualizar sucio matricula: " + error);
    throw new Error("Error al actualizar sucio matricula");
  }
}

async function obtener_matriculas_sucias() {
  try {
    const sql =
      "select * from " + constantes.ESQUEMA_BD + ".matricula where sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener matriculas sucias: " + error);
    throw new Error("Error al obtener matriculas sucias");
  }
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

module.exports.obtener_objeto_matricula = obtener_objeto_matricula;
module.exports.actualizar_sucio = actualizar_sucio;

module.exports.obtener_matriculas_sucias = obtener_matriculas_sucias;
