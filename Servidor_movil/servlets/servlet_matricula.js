const gestorMaticulas = require("../logica/matricula");
const servletComun = require("./servlet_comun");
const gestorPersonas = require("../logica/persona");
const constantes = require("../constantes");

function registrarMatricula(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const nid_matricula = req.body.nid_matricula;
      const nid_persona = req.body.nid_persona;
      const nid_curso = req.body.nid_curso;
      const fecha_actualizacion = req.body.fecha_actualizacion;

      await gestorMaticulas.registrarMatricula(
        nid_matricula,
        nid_persona,
        nid_curso,
        fecha_actualizacion
      );

      res.status(200).send({
        error: false,
        mensaje: "Matricula registrada correctamente",
      });
    } catch (error) {
      console.error("Error al registrar la matricula:", error);
      res.status(400).send({
        error: true,
        message: "Error al registrar la matricula",
      });
    }
  });
}

async function obtenerMatriculasPersona(req, res) {
  try {
    const tokenDecoded = await servletComun.obtenerTokenDecoded(req);

    const nid_usuario = tokenDecoded.nid_usuario;

    const persona = await gestorPersonas.obtenerPersonaUsuario(nid_usuario);

    // Se recuperan los hijos que no son socios
    const hijos = await gestorPersonas.obtenerHijos(persona.nid_persona, false);

    let matriculas = [];

    const matriculasPersona = await gestorMaticulas.obtenerMatriculasPersona(
      persona.nid_persona
    );

    matriculas = matriculasPersona;

    for (let i = 0; i < hijos.length; i++) {
      const matriculasHijo = await gestorMaticulas.obtenerMatriculasPersona(
        hijos[i].nid_persona
      );
      matriculas = [...matriculas, ...matriculasHijo];
    }

    res.status(200).send({
      error: false,
      mensaje: "Matriculas obtenidas correctamente",
      matriculas: matriculas,
    });
  } catch (error) {
    console.error("Error al obtener las matriculas de la persona:", error);
    res.status(500).send({
      error: true,
      message: "Error al obtener las matriculas de la persona",
    });
  }
}

module.exports.registrarMatricula = registrarMatricula;
module.exports.obtenerMatriculasPersona = obtenerMatriculasPersona;
