const gestorEventos = require("../logica/eventoConcierto.js");
const gestorUsuarios = require("../logica/usuario.js");
const servlet_comun = require("./servlet_comun.js");


async function insertarEventoConcierto(req, res) {
  try {
    const rolesPermitidos = ["DIRECTOR", "ADMINISTRADOR"];
    let rolDirector = await servlet_comun.comprobarRol(req, res, rolesPermitidos);
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para registrar un evento de concierto",
      });
    } else {
      let nombre = req.body.nombre;
      let descripcion = req.body.descripcion;
      let fecha_evento = req.body.fecha_evento;
      let tipo_evento = req.body.tipo_evento;
      let publicado = req.body.publicado;

      console.log(
        "Registrar Evento Concierto: ",
        nombre,
        descripcion,
        fecha_evento,
        tipo_evento,
        publicado
      );

      await gestorEventos.insertarEventoConcierto(
        nombre,
        descripcion,
        fecha_evento,
        tipo_evento,
        publicado
      );

      res.status(200).send({
        error: false,
        mensaje: "Evento de concierto registrado correctamente",
      });
    }
  } catch (error) {
    console.error("Error al registrar el evento de concierto:" + error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al registrar el evento de concierto",
    });
  }
}

async function actualizarEventoConcierto(req, res) {
  try {
    const rolesPermitidos = ["DIRECTOR", "ADMINISTRADOR"];
    let rolDirector = await servlet_comun.comprobarRol(req, res, rolesPermitidos);
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para actualizar un evento de concierto",
      });
    } else {
      let nid_evento = req.body.nid_evento;
      let nombre = req.body.nombre;
      let descripcion = req.body.descripcion;
      let fecha_evento = req.body.fecha_evento;
      let tipo_evento = req.body.tipo_evento;
      let publicado = req.body.publicado;

      await gestorEventos.actualizarEventoConcierto(
        nid_evento,
        nombre,
        descripcion,
        fecha_evento,
        tipo_evento,
        publicado
      );

      res.status(200).send({
        error: false,
        mensaje: "Evento de concierto actualizado correctamente",
      });
    }
  } catch (error) {
    console.error(
      "Error al actualizar el evento de concierto:" + error.message
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al actualizar el evento de concierto",
    });
  }
}

async function obtenerEventosConcierto(req, res) {
  try {
    const rolesPermitidos = ["DIRECTOR", "ADMINISTRADOR", "MUSICO"];
    let rolDirector = await servlet_comun.comprobarRol(req, res, rolesPermitidos);
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los eventos de concierto",
      });
    } else {
      let eventos = await gestorEventos.obtenerEventosConcierto();
      if (eventos) {
        res.status(200).send({
          error: false,
          mensaje: "Eventos de concierto obtenidos correctamente",
          eventos: eventos,
        });
      } else {
        res.status(404).send({
          error: true,
          mensaje: "No se encontraron eventos de concierto",
        });
      }
    }
  } catch (error) {
    console.error("Error al obtener los eventos de concierto:" + error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los eventos de concierto",
    });
  }
}

module.exports.insertarEventoConcierto = insertarEventoConcierto;
module.exports.actualizarEventoConcierto = actualizarEventoConcierto;
module.exports.obtenerEventosConcierto = obtenerEventosConcierto;
