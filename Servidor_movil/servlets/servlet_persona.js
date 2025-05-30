const servletComun = require("./servlet_comun.js");
const gestorPersona = require("../logica/persona.js");

function registrarPersona(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nombre = req.body.nombre;
      let nid_persona = req.body.nid_persona;
      let primerApellido = req.body.primer_apellido;
      let segundoApellido = req.body.segundo_apellido;
      let fechaNacimiento = req.body.fecha_nacimiento;
      let nif = req.body.nif;
      let telefono = req.body.telefono;
      let email = req.body.correo_electronico;
      let nid_madre = req.body.nid_madre;
      let nid_padre = req.body.nid_padre;
      let nid_socio = req.body.nid_socio;

      let fecha_actualizacion = req.body.fecha_actualizacion;

      await gestorPersona.registrarPersona(
        nid_persona,
        nombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        nif,
        telefono,
        email,
        nid_madre,
        nid_padre,
        nid_socio,
        fecha_actualizacion
      );

      res.status(200).send({
        error: false,
        mensaje: "Persona registrada correctamente",
      });
    } catch (error) {
      console.error("Error al registrar la persona:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al registrar la persona",
      });
    }
  });
}

function obtenerPersona(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.params.nid_persona;
      let persona = await gestorPersona.obtenerPersona(nid_persona);
      if (persona) {
        res.status(200).send({
          error: false,
          mensaje: "Persona obtenida correctamente",
          persona: persona,
        });
      } else {
        res.status(404).send({
          error: true,
          mensaje: "Persona no encontrada",
        });
      }
    } catch (error) {
      console.error("Error al obtener la persona:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al obtener la persona",
      });
    }
  });
}

function obtenerPersonasSucias(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let personasSucias = await gestorPersona.obtenerPersonasSucias();
      res.status(200).send({
        error: false,
        mensaje: "Personas sucias obtenidas correctamente",
        personas: personasSucias,
      });
    } catch (error) {
      console.error("Error al obtener las personas sucias:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al obtener las personas sucias",
      });
    }
  });
}

function limpiarPersona(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      await gestorPersona.limpiarPersona(nid_persona);
      res.status(200).send({
        error: false,
        mensaje: "Persona limpiada correctamente",
      });
    } catch (error) {
      console.error("Error al limpiar la persona:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al limpiar la persona",
      });
    }
  });
}

module.exports.obtenerPersona = obtenerPersona;
module.exports.registrarPersona = registrarPersona;
module.exports.obtenerPersonasSucias = obtenerPersonasSucias;
module.exports.limpiarPersona = limpiarPersona;
