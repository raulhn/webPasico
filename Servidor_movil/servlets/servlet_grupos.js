const gestor_grupos = require("../logica/grupos.js");
const servletComun = require("./servlet_comun");
const servletPersona = require("./servlet_persona.js");

async function crear_grupo(req, res) {
  try {
    const nombre = req.body.nombre;
    const nid_asignatura = req.body.nid_asignatura;
    const nid_persona = await servletPersona.obtenerNidPersona(req, res);

    await gestor_grupos.crear_grupo(nombre, nid_persona, nid_asignatura);

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
    const nid_profesor = await servletPersona.obtenerNidPersona(req, res);
    const grupos = await gestor_grupos.obtener_grupos(nid_profesor);

    res.status(200).send({ error: false, grupos: grupos });
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
      res.status(200).send({ error: true, message: "Alumno eliminado" });
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

module.exports.crear_grupo = crear_grupo;
module.exports.eliminar_grupo = eliminar_grupo;
module.exports.obtener_grupos = obtener_grupos;
module.exports.add_alumno_grupo = add_alumno_grupo;
module.exports.eliminar_alumno_grupo = eliminar_alumno_grupo;
module.exports.obtener_alumnos_grupo = obtener_alumnos_grupo;
