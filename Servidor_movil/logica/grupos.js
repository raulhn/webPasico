const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const gestor_base_datos = require("./base_datos.js");

async function crear_grupo(nombre, nid_profesor, nid_asignatura, nid_curso) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".grupos(nombre, nid_profesor, nid_asignatura, nid_curso) values(" +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(nid_profesor) +
      ", " +
      conexion.dbConn.escape(nid_asignatura) +
      ", " +
      conexion.dbConn.escape(nid_curso) +
      ")";
    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (err) {
    console.log("grupos.js -> crear_grupo: Error al crear grupo: " + err);
    throw new Error("Se ha producido un error al insertar el grupo");
  }
}

async function borrar_grupo(nid_grupo) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".grupos set borrado = 'S' where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (err) {
    console.log("grupos.js -> borrar_grupo: Error al borrar grupo: " + err);
    throw new Error("Se ha producido un error al borrar el grupo");
  }
}

async function add_alumno(nid_grupo, nid_matricula_asignatura) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".grupos_matricula_asignatura(nid_grupo, nid_matricula_asignatura) values(" +
      conexion.dbConn.escape(nid_grupo) +
      ", " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (err) {
    console.log(
      "grupos.js -> add_alumno: Error al añadir alumno al grupo: " + err,
    );
    throw new Error("Se ha producido un error al añadir el alumno al grupo");
  }
}

async function eliminar_alumno(nid_grupo, nid_matricula_asignatura) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA +
      ".grupos_matricula_asignatura where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo) +
      " and nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (err) {
    console.log(
      "grupos.js -> eliminar_alumno: Error al eliminar alumno del grupo: " +
        err,
    );
    throw new Error("Se ha producido un error al eliminar el alumno del grupo");
  }
}

async function actualizar_horario(nid_grupo, horario) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".grupos set horario = " +
      conexion.dbConn.escape(horario) +
      " where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo);

    return await gestor_base_datos.actualiza(sql);
  } catch (err) {
    console.log(
      "grupos.js -> actualizar_horario: Error al actualizar el horario: " + err,
    );
    throw new Error("Se ha producido un error al actualizar el horario");
  }
}

async function es_profesor(nid_grupo, nid_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".grupos where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo) +
      " and nid_profesor = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (err) {
    console.log(
      "grupos.js -> es_profesor: Error al comprobar si la persona es profesor del grupo: " +
        err,
    );
    throw new Error(
      "Se ha producido un error al comprobar si la persona es profesor del grupo",
    );
  }
}

async function obtener_alumnos_grupo(nid_grupo) {
  try {
    const sql =
      "select gma.nid_grupo, gma.nid_matricula_asignatura, p.nid_persona, p.nombre, p.primer_apellido, p.segundo_apellido" +
      ", (select count(*) from asistencia_grupo ag where ag.nid_grupo = gma.nid_grupo and ag.nid_matricula_asignatura = gma.nid_matricula_asignatura and ag.falta = 'S') as faltas" +
      " from " +
      constantes.ESQUEMA +
      ".grupos_matricula_asignatura gma, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".persona p where gma.nid_matricula_asignatura = ma.nid_matricula_asignatura " +
      "and ma.nid_matricula = m.nid_matricula " +
      "and m.nid_persona = p.nid_persona " +
      "and gma.nid_grupo = " +
      conexion.dbConn.escape(nid_grupo);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (err) {
    console.log(
      "grupos.js -> obtener_alumnos_grupo: Error al obtener alumnos del grupo: " +
        err,
    );
    throw new Error(
      "Se ha producido un error al obtener los alumnos del grupo",
    );
  }
}

async function obtener_grupos(nid_profesor, nid_curso) {
  try {
    const filtroCurso = nid_curso
      ? " and g.nid_curso = " + conexion.dbConn.escape(nid_curso)
      : "";
    const sql =
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) as profesor, g.* from " +
      constantes.ESQUEMA +
      ".grupos g, " +
      constantes.ESQUEMA +
      ".persona p where nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " and g.nid_profesor = p.nid_persona " +
      filtroCurso +
      " and borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (err) {
    console.log(
      "grupos.js -> obtener_grupos: Error al obtener grupos del profesor: " +
        err,
    );
    throw new Error(
      "Se ha producido un error al obtener los grupos del profesor",
    );
  }
}

async function obtener_asistencia_grupo(nid_grupo, fecha) {
  try {
    const sql =
      "select gma.nid_matricula_asignatura, p.nid_persona, p.nombre, p.primer_apellido, p.segundo_apellido, " +
      "coalesce(ag.falta, 'N') as falta, coalesce(ag.justificada, 'N') as justificada, coalesce(ag.causa, '') as causa " +
      "from " +
      constantes.ESQUEMA +
      ".grupos_matricula_asignatura gma " +
      "inner join " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma on ma.nid_matricula_asignatura = gma.nid_matricula_asignatura " +
      "inner join " +
      constantes.ESQUEMA +
      ".matricula m on m.nid_matricula = ma.nid_matricula " +
      "inner join " +
      constantes.ESQUEMA +
      ".persona p on p.nid_persona = m.nid_persona " +
      "left join " +
      constantes.ESQUEMA +
      ".asistencia_grupo ag on ag.nid_grupo = gma.nid_grupo " +
      "and ag.nid_matricula_asignatura = gma.nid_matricula_asignatura " +
      "and ag.fecha = " +
      conexion.dbConn.escape(fecha) +
      " where gma.nid_grupo = " +
      conexion.dbConn.escape(nid_grupo) +
      " order by p.primer_apellido, p.segundo_apellido, p.nombre";

    return await gestor_base_datos.consulta(sql);
  } catch (err) {
    console.log(
      "grupos.js -> obtener_asistencia_grupo: Error al obtener la asistencia: " +
        err,
    );
    throw new Error("Se ha producido un error al obtener la asistencia");
  }
}

async function guardar_asistencia_grupo(nid_grupo, fecha, asistencias) {
  try {
    const alumnosGrupo = await obtener_alumnos_grupo(nid_grupo);
    const matriculasGrupo = new Set(
      alumnosGrupo.map((alumno) => String(alumno.nid_matricula_asignatura)),
    );

    if (
      asistencias.some(
        (asistencia) =>
          !matriculasGrupo.has(String(asistencia.nid_matricula_asignatura)),
      )
    ) {
      throw new Error("Hay alumnos que no pertenecen al grupo");
    }

    if (asistencias.length === 0) {
      return;
    }

    const valores = asistencias.map((asistencia) => {
      const falta = asistencia.falta ? "S" : "N";
      const justificada =
        asistencia.falta && asistencia.justificada ? "S" : "N";
      const causa =
        asistencia.falta && asistencia.justificada ? asistencia.causa : "";
      return (
        "(" +
        conexion.dbConn.escape(nid_grupo) +
        ", " +
        conexion.dbConn.escape(asistencia.nid_matricula_asignatura) +
        ", " +
        conexion.dbConn.escape(fecha) +
        ", " +
        conexion.dbConn.escape(falta) +
        ", " +
        conexion.dbConn.escape(justificada) +
        ", " +
        conexion.dbConn.escape(causa) +
        ")"
      );
    });
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".asistencia_grupo (nid_grupo, nid_matricula_asignatura, fecha, falta, justificada, causa) values " +
      valores.join(", ") +
      " on duplicate key update falta = values(falta), justificada = values(justificada), causa = values(causa)";

    return await gestor_base_datos.actualiza(sql);
  } catch (err) {
    console.log(
      "grupos.js -> guardar_asistencia_grupo: Error al guardar la asistencia: " +
        err,
    );
    throw err;
  }
}

module.exports.crear_grupo = crear_grupo;
module.exports.borrar_grupo = borrar_grupo;
module.exports.obtener_grupos = obtener_grupos;
module.exports.add_alumno = add_alumno;
module.exports.eliminar_alumno = eliminar_alumno;
module.exports.actualizar_horario = actualizar_horario;
module.exports.es_profesor = es_profesor;
module.exports.obtener_alumnos_grupo = obtener_alumnos_grupo;
module.exports.obtener_asistencia_grupo = obtener_asistencia_grupo;
module.exports.guardar_asistencia_grupo = guardar_asistencia_grupo;
