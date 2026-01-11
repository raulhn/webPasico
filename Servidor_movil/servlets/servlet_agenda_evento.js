const servlet_comun = require("./servlet_comun.js");
const constantes = require("../constantes.js");
const gestorAgendaEvento = require("../logica/agenda_evento.js");

async function registrarEvento(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    let rolDirector = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para registrar un evento de concierto",
      });
      return;
    }
    const { nombre, descripcion, fecha } = req.body;

    if (!nombre || !descripcion || !fecha) {
      res.status(400).send({ error: "Faltan parámetros obligatorios" });
      return;
    }

    await gestorAgendaEvento.registrarAgendaEvento(nombre, descripcion, fecha);

    res.status(200).send({ mensaje: "Evento registrado correctamente" });
  } catch (error) {
    res.status(500).send({ error: "Error interno del servidor" });
  }
}

async function actualizarEvento(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    let rolDirector = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para actualizar un evento de concierto",
      });
      return;
    }
    const { nid_evento, nombre, descripcion, fecha } = req.body;
    if (!nid_evento || !nombre || !descripcion || !fecha) {
      res.status(400).send({ error: "Faltan parámetros obligatorios" });
      return;
    }

    await gestorAgendaEvento.actualizarAgendaEvento(
      nid_evento,
      nombre,
      descripcion,
      fecha,
    );

    res.status(200).send({ mensaje: "Evento actualizado correctamente" });
  } catch (error) {
    res.status(500).send({ error: "Error interno del servidor" });
  }
}

async function eliminarEvento(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    let rolDirector = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para eliminar un evento de concierto",
      });
      return;
    }
    const { nid_evento } = req.body;
    if (!nid_evento) {
      res.status(400).send({ error: "Faltan parámetros obligatorios" });
      return;
    }

    await gestorAgendaEvento.eliminarAgendaEvento(nid_evento);

    res.status(200).send({ mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ error: "Error interno del servidor" });
  }
}

async function obtenerEventos(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    let rolDirector = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    const bPublicos = !rolDirector;

    const eventos = await gestorAgendaEvento.recuperarEventos(bPublicos);

    res.status(200).send({ eventos: eventos });
  } catch (error) {
    res.status(500).send({ error: "Error interno del servidor" });
  }
}

module.exports.obtenerEventos = obtenerEventos;
module.exports.registrarEvento = registrarEvento;
module.exports.actualizarEvento = actualizarEvento;
module.exports.eliminarEvento = eliminarEvento;
