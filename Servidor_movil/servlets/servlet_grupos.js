const gestor_grupos = require("../logica/grupos.js");
const servletComun = require("./servlet_comun");
const servletPersona = require("./servlet_persona.js");
const gestor_profesor = require("../logica/profesores.js");
const constantes = require("../constantes.js");

async function crear_grupo(req, res) {
  try {
    const nombre = req.body.nombre;
    const nid_asignatura = req.body.nid_asignatura;
    const nid_curso = req.body.nid_curso;
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);

    const bEsProfesor = await gestor_profesor.esProfesor(
      nid_persona,
      nid_asignatura,
    );
    if (!bEsProfesor) {
      res.status(400).send({
        error: true,
        message: "No está autorizado para crear un grupo en esta asignatura",
      });
      return;
    }

    await gestor_grupos.crear_grupo(
      nombre,
      nid_persona,
      nid_asignatura,
      nid_curso,
    );

    res.status(200).send({ error: false, message: "Grupo creado" });
  } catch (error) {
    console.error(
      "servlet_grupos.js -> crear_grupo: Error al crear el grupo:",
      error,
    );
    res.status(400).send({
      error: true,
      message: error.message,
    });
  }
}

async function eliminar_grupo(req, res) {
  try {
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);
    const nid_grupo = req.body.nid_grupo;

    bEsProfesor = await gestor_grupos.es_profesor(nid_grupo, nid_persona);
    if (bEsProfesor) {
      await gestor_grupos.borrar_grupo(nid_grupo);
    } else {
      res.status(400).send({
        error: true,
        message: "No está autorizado",
      });
      return;
    }

    res.status(200).send({ error: false, message: "Se ha eliminado el grupo" });
  } catch (error) {
    console.log("servlet_grupos -> eliminar_grupo: ", error);
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al eliminar el grupo",
    });
  }
}

async function obtener_grupos(req, res) {
  try {
    const { nid_curso } = req.params;
    if (nid_curso !== undefined && !Number.isInteger(Number(nid_curso))) {
      res.status(400).send({ error: true, message: "Curso no válido" });
      return;
    }

    const nid_profesor = await servletPersona.obtenerNidPersona(req, res);
    const grupos = await gestor_grupos.obtener_grupos(nid_profesor, nid_curso);

    const gruposConAlumnos = [];

    for (let i = 0; i < grupos.length; i++) {
      const grupo = grupos[i];
      const alumnos = await gestor_grupos.obtener_alumnos_grupo(
        grupo.nid_grupo,
      );

      gruposConAlumnos.push({ grupo: grupo, alumnos: alumnos });
    }
    res.status(200).send({ error: false, grupos: gruposConAlumnos });
  } catch (error) {
    console.log("servlet_grupos -> obtener_grupos: ", error);
    res
      .status(400)
      .send({ error: false, message: "Error al obtener los grupos" });
  }
}

async function add_alumno_grupo(req, res) {
  try {
    const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
    const nid_grupo = req.body.nid_grupo;
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);

    const bEsProfesor = await gestor_grupos.es_profesor(nid_grupo, nid_persona);
    if (bEsProfesor) {
      await gestor_grupos.add_alumno(nid_grupo, nid_matricula_asignatura);
      res.status(200).send({ error: false, message: "Alumno añadido" });
      return;
    } else {
      res.status(400).send({ error: true, message: "Acceso no autorizado" });
      return;
    }
  } catch (error) {
    console.log("servlet_grupos -> add_alumno_grupo:", error);
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al añadir el alumno",
    });
  }
}

async function eliminar_alumno_grupo(req, res) {
  try {
    const nid_matricula_asignatura = req.body.nid_matricula_asignatura;
    const nid_grupo = req.body.nid_grupo;
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);

    const bEsProfesor = await gestor_grupos.es_profesor(nid_grupo, nid_persona);
    if (bEsProfesor) {
      await gestor_grupos.eliminar_alumno(nid_grupo, nid_matricula_asignatura);
      res.status(200).send({ error: false, message: "Alumno eliminado" });
      return;
    } else {
      res.status(400).send({ error: true, message: "Acceso no autorizado" });
      return;
    }
  } catch (error) {
    console.log("servlet_grupos -> eliminar_alumno_grupo:", error);
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al eliminar el alumno",
    });
  }
}

async function actualizar_horario_grupo(req, res) {
  try {
    const nid_grupo = req.body.nid_grupo;
    const { horario: horarioRecibido } = req.body;
    const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];

    if (
      typeof horarioRecibido !== "string" ||
      horarioRecibido.length > 13 ||
      !/^(|[LMXJVSD](?:-[LMXJVSD])*)$/.test(horarioRecibido)
    ) {
      res.status(400).send({ error: true, message: "Horario no válido" });
      return;
    }

    const dias = horarioRecibido === "" ? [] : horarioRecibido.split("-");
    if (
      dias.some((dia) => !diasSemana.includes(dia)) ||
      new Set(dias).size !== dias.length
    ) {
      res.status(400).send({ error: true, message: "Horario no válido" });
      return;
    }

    const horario = diasSemana.filter((dia) => dias.includes(dia)).join("-");
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);
    const bEsProfesor = await gestor_grupos.es_profesor(nid_grupo, nid_persona);

    if (!bEsProfesor) {
      res.status(400).send({ error: true, message: "Acceso no autorizado" });
      return;
    }

    await gestor_grupos.actualizar_horario(nid_grupo, horario);
    res.status(200).send({ error: false, message: "Horario actualizado" });
  } catch (error) {
    console.log("servlet_grupos -> actualizar_horario_grupo:", error);
    res.status(400).send({
      error: true,
      message: "Se ha producido un error al actualizar el horario",
    });
  }
}

async function obtener_alumnos_grupo(req, res) {
  try {
    const nid_grupo = req.params.nid_grupo;
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);

    const bEsProfesor = await gestor_grupos.es_profesor(nid_grupo, nid_persona);
    if (bEsProfesor) {
      const alumnos = await gestor_grupos.obtener_alumnos_grupo(nid_grupo);
      res.status(200).send({ error: false, alumnos: alumnos });
      return;
    } else {
      res.status(400).send({ error: false, message: "Acceso no autorizado" });
      return;
    }
  } catch (error) {
    console.log("servlet_grupos -> obtener_alumnos_grupo:", error);
    res.status(400).send({
      error: false,
      message: "Se ha producido un error al obtener los alumnos del grupo",
    });
  }
}

function esFechaValida(fecha) {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    fechaParseada.getUTCFullYear() === anio &&
    fechaParseada.getUTCMonth() === mes - 1 &&
    fechaParseada.getUTCDate() === dia
  );
}

function esDiaDeClase(horario, fecha) {
  const diasSemana = ["D", "L", "M", "X", "J", "V", "S"];
  return (horario || "")
    .split("-")
    .includes(diasSemana[new Date(fecha + "T00:00:00Z").getUTCDay()]);
}

async function obtener_asistencia_grupo(req, res) {
  try {
    const { nid_grupo, fecha } = req.params;
    if (!esFechaValida(fecha)) {
      res.status(400).send({ error: true, message: "Fecha no válida" });
      return;
    }

    const nid_persona = await servletPersona.obtenerNidPersona(req, res);
    if (!(await gestor_grupos.es_profesor(nid_grupo, nid_persona))) {
      res.status(403).send({ error: true, message: "Acceso no autorizado" });
      return;
    }

    const grupo = (await gestor_grupos.obtener_grupos(nid_persona)).find(
      (elementoGrupo) => String(elementoGrupo.nid_grupo) === String(nid_grupo),
    );
    if (!grupo || !esDiaDeClase(grupo.horario, fecha)) {
      res.status(400).send({
        error: true,
        message: "El grupo no tiene clase el día seleccionado",
      });
      return;
    }

    const alumnos = await gestor_grupos.obtener_asistencia_grupo(
      nid_grupo,
      fecha,
    );
    res.status(200).send({ error: false, alumnos });
  } catch (error) {
    console.log("servlet_grupos -> obtener_asistencia_grupo:", error);
    res.status(400).send({
      error: true,
      message: "No se ha podido obtener la asistencia del grupo",
    });
  }
}

async function guardar_asistencia_grupo(req, res) {
  try {
    const { nid_grupo, fecha, asistencias } = req.body;
    if (
      !esFechaValida(fecha) ||
      !Array.isArray(asistencias) ||
      asistencias.some(
        (asistencia) =>
          !asistencia ||
          !Number.isInteger(Number(asistencia.nid_matricula_asignatura)) ||
          typeof asistencia.falta !== "boolean" ||
          typeof asistencia.justificada !== "boolean" ||
          typeof asistencia.causa !== "string" ||
          asistencia.causa.length > 500,
      )
    ) {
      res
        .status(400)
        .send({ error: true, message: "Datos de asistencia no válidos" });
      return;
    }

    const nid_persona = await servletPersona.obtenerNidPersona(req, res);
    if (!(await gestor_grupos.es_profesor(nid_grupo, nid_persona))) {
      res.status(403).send({ error: true, message: "Acceso no autorizado" });
      return;
    }

    const grupo = (await gestor_grupos.obtener_grupos(nid_persona)).find(
      (elementoGrupo) => String(elementoGrupo.nid_grupo) === String(nid_grupo),
    );
    if (!grupo || !esDiaDeClase(grupo.horario, fecha)) {
      res.status(400).send({
        error: true,
        message: "El grupo no tiene clase el día seleccionado",
      });
      return;
    }

    await gestor_grupos.guardar_asistencia_grupo(nid_grupo, fecha, asistencias);
    res.status(200).send({ error: false, message: "Asistencia guardada" });
  } catch (error) {
    console.log("servlet_grupos -> guardar_asistencia_grupo:", error);
    res.status(400).send({
      error: true,
      message: error.message || "No se ha podido guardar la asistencia",
    });
  }
}

async function obtener_asistencias_asignatura(req, res) {
  try {
    const roles_permitidos = [constantes.ADMINISTRADOR, constantes.DIRECTIVO];
    const bPermisos = await servletComun.comprobarPermisos(
      req,
      res,
      roles_permitidos,
    );
    if (!bPermisos) {
      res.status(403).send({
        error: true,
        mensaje: "No tiene permisos para acceder a este recurso",
      });
      return;
    }
    const nid_asignatura = req.params.nid_asignatura;
    const nid_curso = req.params.nid_curso;

    const asistencias = await gestor_grupos.obtener_asistencias_asignatura(
      nid_asignatura,
      nid_curso,
    );
    res.status(200).send({
      error: false,
      asistencias: asistencias,
    });
  } catch (error) {
    console.error(
      "Error al obtener las asistencias de la asignatura:" + error.message,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener las asistencias de la asignatura",
    });
  }
}

module.exports.crear_grupo = crear_grupo;
module.exports.eliminar_grupo = eliminar_grupo;
module.exports.obtener_grupos = obtener_grupos;
module.exports.add_alumno_grupo = add_alumno_grupo;
module.exports.eliminar_alumno_grupo = eliminar_alumno_grupo;
module.exports.actualizar_horario_grupo = actualizar_horario_grupo;
module.exports.obtener_alumnos_grupo = obtener_alumnos_grupo;
module.exports.obtener_asistencia_grupo = obtener_asistencia_grupo;
module.exports.guardar_asistencia_grupo = guardar_asistencia_grupo;
module.exports.obtener_asistencias_asignatura = obtener_asistencias_asignatura;
