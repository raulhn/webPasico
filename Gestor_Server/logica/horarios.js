const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const curso = require("./curso.js");
const gestor_base_datos = require("./base_datos.js");

async function registrar_horario_clase(
  hora_inicio,
  minutos_inicio,
  duracion_clase,
  num_clase,
  nid_horario,
  dia,
) {
  try {
    var minutos_totales = Number(minutos_inicio) + Number(hora_inicio) * 60;
    var minutos_comienzo_clase =
      Number(minutos_totales) + Number(duracion_clase) * Number(num_clase);

    var hora_comienzo_clase = Math.trunc(Number(minutos_comienzo_clase) / 60);
    var minuto_comienzo_clase = Math.abs(Number(minutos_comienzo_clase)) % 60;
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".horario_clase(hora_inicio, minutos_inicio, duracion_clase, nid_horario, dia) " +
      " values(" +
      conexion.dbConn.escape(hora_comienzo_clase) +
      ", " +
      conexion.dbConn.escape(minuto_comienzo_clase) +
      ", " +
      conexion.dbConn.escape(duracion_clase) +
      ", " +
      conexion.dbConn.escape(nid_horario) +
      ", " +
      conexion.dbConn.escape(dia) +
      ")";
    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al registrar horario clase: " + error);
    throw new Error("Error al registrar horario clase");
  }
}

async function eliminar_horario_clase(nid_horario_clase) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      ".horario_clase where nid_horario_clase = " +
      conexion.dbConn.escape(nid_horario_clase);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al eliminar horario clase: " + error);
    throw new Error("Error al eliminar horario clase");
  }
}

// Retrieve rows from the `horario_clases` table.
async function obtener_horario_clases(nid_horario) {
  try {
    const sql =
      "select * " +
      "from " +
      constantes.ESQUEMA_BD +
      ".horario_clases " +
      "where nid_horario = " +
      conexion.dbConn.escape(nid_horario);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener horario: " + error);
    throw new Error("Error al obtener horario");
  }
}

async function eliminar_horario_clase_no_commit(nid_horario_clase) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      ".horario_clase where nid_horario_clase = " +
      conexion.dbConn.escape(nid_horario_clase);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al eliminar horario clase: " + error);
    throw new Error("Error al eliminar horario clase");
  }
}

async function eliminar_horario(nid_horario) {
  try {
    let horario_clase = await obtener_horario_clases(nid_horario);

    for (i = 0; i < horario_clase.length; i++) {
      await eliminar_horario_clase_no_commit(
        horario_clase[i]["nid_horario_clase"]
      );
    }
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      "horario where nid_horario = " +
      conexion.dbConn.escape(nid_horario);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al eliminar horario: " + error);
    throw new Error("Error al eliminar horario");
  }
}

async function registrar_horario(nid_profesor, nid_asignatura) {
  try {
    let horario = await obtener_horarios(nid_profesor, nid_asignatura);

    if (horario.length > 0) {
      return horario[0]["nid_horario"];
    } else {
      const nid_curso = await curso.obtener_ultimo_curso();

      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".horario(nid_asignatura, nid_profesor, nid_curso)" +
        " values(" +
        conexion.dbConn.escape(nid_asignatura) +
        ", " +
        conexion.dbConn.escape(nid_profesor) +
        ", " +
        conexion.dbConn.escape(nid_curso) +
        ")";

      const results = await gestor_base_datos.actualiza(sql);
      return results.insertId;
    }
  } catch (error) {
    console.log("registrar_horario ->" + error);
    throw new Error("Error al registrar el horario");
  }
}

async function crear_horario(
  dia,
  hora_inicio,
  minutos_inicio,
  hora_fin,
  minutos_fin,
  nid_asignatura,
  nid_profesor,
  duracion_clase
) {
  try {
    const nid_horario = await registrar_horario(nid_profesor, nid_asignatura);

    let total_minutos_inicio =
      Number(minutos_inicio) + Number(hora_inicio) * 60;
    let total_minutos_fin =
      Number(minutos_fin) + Number(hora_fin) * 60;

    const total = Math.abs(total_minutos_fin - total_minutos_inicio);
    const num_clases = total / Number(duracion_clase);

    if (total % Number(duracion_clase) > 0) {
      throw new Error(
        "No coincide la duración de la clase con el rango de tiempo dado"
      );
    }

    console.log("Número de clases " + num_clases);
    for (let i = 0; i < num_clases; i++) {
      await registrar_horario_clase(
        hora_inicio,
        minutos_inicio,
        duracion_clase,
        i,
        nid_horario,
        dia
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear el horario");
  }
}

async function asignar_horario_clase(nid_horario_clase, nid_matricula_asignatura) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".horario_matricula_asignatura(nid_matricula_asignatura, nid_horario_clase)" +
      " values(" +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ", " +
      conexion.dbConn.escape(nid_horario_clase) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("asignar_horario_clase ->" + error);
    throw new Error("Error al asignar horario clase");
  }
}

async function liberar_horario_clase(nid_horario_clase, nid_matricula_asignatura) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      ".horario_matricula_asignatura where nid_horario_clase = " +
      conexion.dbConn.escape(nid_horario_clase) +
      " and nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("liberar_horario_clase ->" + error);
    throw new Error("Error al liberar horario clase");
  }
}

async function obtener_horarios(nid_profesor, nid_asignatura, nid_curso) {
  try {
    const nid_ultimo_curso = await curso.obtener_ultimo_curso();

    const sql =
      "select h.* from " +
      constantes.ESQUEMA_BD +
      ".horario h " +
      "where (h.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " or nullif(" +
      conexion.dbConn.escape(nid_profesor) +
      ", '') is null) " +
      " and (h.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " or nullif(" +
      conexion.dbConn.escape(nid_asignatura) +
      ", '') is null) " +
      " and (h.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " or nullif(" +
      conexion.dbConn.escape(nid_curso) +
      ", " +
      conexion.dbConn.escape(nid_ultimo_curso) +
      ") is null) ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener horarios");
  }
}

async function obtener_horarios_clase(
  nid_profesor,
  nid_asignatura,
  nid_curso
) {
  try {
    const nid_ultimo_curso = await curso.obtener_ultimo_curso();

    const sql =
      "select hc.*, " +
      "(select count(*) from " +
      constantes.ESQUEMA_BD +
      ".horario_matricula_asignatura hma where hma.nid_horario_clase = hc.nid_horario_clase) num_alumnos " +
      " from " +
      constantes.ESQUEMA_BD +
      ".horario h, " +
      constantes.ESQUEMA_BD +
      ".horario_clase hc " +
      "where h.nid_horario = hc.nid_horario " +
      " and (h.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " or nullif(" +
      conexion.dbConn.escape(nid_profesor) +
      ", '') is null) " +
      " and (h.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " or nullif(" +
      conexion.dbConn.escape(nid_asignatura) +
      ", '') is null) " +
      " and (h.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " or nullif(" +
      conexion.dbConn.escape(nid_curso) +
      ", " +
      conexion.dbConn.escape(nid_ultimo_curso) +
      ") is null) ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener horarios");
  }
}

async function obtener_horarios_profesor(nid_profesor) {
  try {
    const sql =
      "select hc.* from " +
      constantes.ESQUEMA_BD +
      ".horario h, " +
      constantes.ESQUEMA_BD +
      ".horario_clase hc " +
      "where h.nid_horario = hc.nid_horario " +
      " and h.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener horarios");
  }
}

async function obtener_horario_clase_alumno(nid_matricula) {
  try {
    const sql =
      "select hc.*, a.descripcion asignatura " +
      "from " +
      constantes.ESQUEMA_BD +
      ".horario_clase hc, " +
      constantes.ESQUEMA_BD +
      ".horario h, " +
      constantes.ESQUEMA_BD +
      ".asignatura a " +
      "where hc.nid_horario = h.nid_horario " +
      " and h.nid_asignatura = a.nid " +
      " and nid_horario_clase in  " +
      "   (  " +
      "   select hma.nid_horario_clase " +
      "   from " +
      constantes.ESQUEMA_BD +
      ".horario_matricula_asignatura hma, " +
      "        " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma " +
      "   where hma.nid_matricula_asignatura = ma.nid  " +
      "   and ma.nid_matricula =  " +
      conexion.dbConn.escape(nid_matricula) +
      "   )";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener horario clase alumno");
  }
}

// Retrieve a single `horario` record.
async function obtener_horario(nid_horario) {
  try {
    const sql =
      "select h.* from " +
      constantes.ESQUEMA_BD +
      ".horario h " +
      "where h.nid_horario = " +
      conexion.dbConn.escape(nid_horario);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener horario");
  }
}

async function obtener_horario_clase(nid_horario) {
  try {
    const sql =
      "select hc.*, " +
      "(select count(*) from " +
      constantes.ESQUEMA_BD +
      ".horario_matricula_asignatura hma where hma.nid_horario_clase = hc.nid_horario_clase) num_alumnos " +
      " from " +
      constantes.ESQUEMA_BD +
      ".horario h, " +
      constantes.ESQUEMA_BD +
      ".horario_clase hc " +
      "where h.nid_horario = hc.nid_horario " +
      " and h.nid_horario = " +
      conexion.dbConn.escape(nid_horario);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener horario");
  }
}

async function obtener_horario_asignado(nid_horario) {
  try {
    const sql =
      "select ma.* " +
      "from " +
      constantes.ESQUEMA_BD +
      ".horario h, " +
      constantes.ESQUEMA_BD +
      ".horario_clase hc, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma " +
      "where h.nid_horario = hc.nid_horario " +
      " and h.nid_profesor = " +
      conexion.dbConn.escape(nid_horario) +
      " and ma.nid_horario_clase = hc.nid_horario_clase";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener horario");
  }
}

async function obtener_alumnos_horario_clase(nid_horario_clase) {
  try {
    const sql =
      "select concat(ifnull(p.nif, ''), ' ', ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ', ifnull(p.segundo_apellido, '')) etiqueta, p.*, " +
      " ma.nid nid_matricula_asignatura " +
      " from " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      "     " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      "     " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      "     " +
      constantes.ESQUEMA_BD +
      ".horario_matricula_asignatura hma" +
      " where p.nid = m.nid_persona " +
      "  and m.nid = ma.nid_matricula " +
      "  and ma.nid = hma.nid_matricula_asignatura " +
      "  and hma.nid_horario_clase = " +
      conexion.dbConn.escape(nid_horario_clase);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener alumnos horario clase");
  }
}

async function obtener_alumnos_sin_asignar(nid_horario_clase) {
  try {
    const sql =
      "select concat(ifnull(p.nif, ''), ' ', ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ', ifnull(p.segundo_apellido, '')) etiqueta, " +
      " ma.nid nid_matricula_asignatura " +
      " from " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      "      " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      "      " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      "      " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam " +
      " where ma.nid_matricula = m.nid " +
      "   and m.nid_persona = p.nid " +
      "   and pam.nid_matricula_asignatura = ma.nid " +
      "   and (ma.nid_asignatura, pam.nid_profesor, m.nid_curso) " +
      "       in (select h.nid_asignatura, h.nid_profesor, h.nid_curso " +
      "           from " +
      constantes.ESQUEMA_BD +
      ".horario_clase hc, " +
      "                " +
      constantes.ESQUEMA_BD +
      ".horario h " +
      "           where hc.nid_horario = h.nid_horario " +
      "             and hc.nid_horario_clase = " +
      conexion.dbConn.escape(nid_horario_clase) +
      " ) ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener alumnos sin asignar");
  }
}

module.exports.registrar_horario_clase = registrar_horario_clase;
module.exports.crear_horario = crear_horario;

module.exports.asignar_horario_clase = asignar_horario_clase;
module.exports.liberar_horario_clase = liberar_horario_clase;
module.exports.eliminar_horario_clase = eliminar_horario_clase;
module.exports.eliminar_horario = eliminar_horario;

module.exports.obtener_horarios = obtener_horarios;
module.exports.obtener_horarios_clase = obtener_horarios_clase;

module.exports.obtener_horarios_profesor = obtener_horarios_profesor;
module.exports.obtener_horario_clase_alumno = obtener_horario_clase_alumno;
module.exports.obtener_horario = obtener_horario;
module.exports.obtener_horario_clase = obtener_horario_clase;
module.exports.obtener_horario_asignado = obtener_horario_asignado;

module.exports.obtener_alumnos_horario_clase = obtener_alumnos_horario_clase;
module.exports.obtener_alumnos_sin_asignar = obtener_alumnos_sin_asignar;