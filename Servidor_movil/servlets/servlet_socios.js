const servletComun = require("./servlet_comun");
const gestorSocios = require("../logica/socios.js");
const gestorPersona = require("../logica/persona.js");

function registrarSocio(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      let fecha_alta = req.body.fecha_alta;
      let fecha_baja = req.body.fecha_baja;
      let num_socio = req.body.num_socio;
      let fecha_actualizacion = req.body.fecha_actualizacion;

      console.log(
        "Registrar Socio: ",
        nid_persona,
        fecha_alta,
        fecha_baja,
        num_socio,
        fecha_actualizacion
      );

      await gestorSocios.registrarSocio(
        nid_persona,
        fecha_alta,
        fecha_baja,
        num_socio,
        fecha_actualizacion
      );

      res.status(200).send({
        error: false,
        mensaje: "Socio registrado correctamente",
      });
    } catch (error) {
      console.error("Error al registrar el socio:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al registrar el socio",
      });
    }
  });
}

async function obtenerSocio(req, res) {
  try {
    let tokenDecode = await servletComun.obtenerTokenDecoded(req, res);

    const persona = await gestorPersona.obtenerPersonaUsuario(
      tokenDecode.nid_usuario
    );
    let socio = await gestorSocios.obtenerSocio(persona.nid_persona);
    if (socio) {
      res.status(200).send({
        error: false,
        mensaje: "Socio obtenido correctamente",
        socio: socio,
        persona: persona,
      });
    } else {
      res.status(404).send({
        error: true,
        mensaje: "Socio no encontrado",
      });
    }
  } catch (error) {
    console.error("Error al obtener el socio:" + error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener el socio",
    });
  }
}

module.exports.registrarSocio = registrarSocio;
module.exports.obtenerSocio = obtenerSocio;
