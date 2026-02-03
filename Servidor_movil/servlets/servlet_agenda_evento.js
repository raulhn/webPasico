const servlet_comun = require("./servlet_comun.js");
const constantes = require("../constantes.js");
const gestorAgendaEvento = require("../logica/agenda_evento.js");
const gestorEventoConcierto = require("../logica/eventoConcierto.js");
const gestorComun = require("../logica/comun.js");

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

    if (!nombre) {
      res
        .status(400)
        .send({ error: true, mensaje: "Faltan parámetros obligatorios" });
      return;
    }

    let fecha_evento = gestorComun.formatDateToMySQL(fecha);
    await gestorAgendaEvento.registrarAgendaEvento(
      nombre,
      descripcion,
      fecha_evento,
    );

    res
      .status(200)
      .send({ error: false, mensaje: "Evento registrado correctamente" });
  } catch (error) {
    res
      .status(500)
      .send({ error: true, mensaje: "Error interno del servidor" });
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

    let fecha_evento = gestorComun.formatDateToMySQL(fecha);

    await gestorAgendaEvento.actualizarAgendaEvento(
      nid_evento,
      nombre,
      descripcion,
      fecha_evento,
    );

    res
      .status(200)
      .send({ error: false, mensaje: "Evento actualizado correctamente" });
  } catch (error) {
    res
      .status(500)
      .send({ error: true, mensaje: "Error interno del servidor" });
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
      res
        .status(400)
        .send({ error: true, mennsaje: "Faltan parámetros obligatorios" });
      return;
    }

    await gestorAgendaEvento.eliminarAgendaEvento(nid_evento);

    res
      .status(200)
      .send({ error: false, mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .send({ error: true, mensaje: "Error interno del servidor" });
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

    res.status(200).send({ error: false, eventos: eventos });
  } catch (error) {
    res
      .status(500)
      .send({ error: true, mensaje: "Error interno del servidor" });
  }
}

async function obtenerEventosFecha(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    let rolDirector = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    const bPublicos = !rolDirector;

    const fecha = req.params.fecha;

    const eventos = await gestorAgendaEvento.recuperarEventosFecha(
      bPublicos,
      fecha,
    );

    res.status(200).send({ error: false, eventos: eventos });
  } catch (error) {
    res
      .status(500)
      .send({ error: true, mensaje: "Error interno del servidor" });
  }
}

async function obtenerEventosRangoFechas(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    let rolDirector = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    const bPublicos = !rolDirector;

    const fechaInicio = req.params.fecha_inicio;
    const fechaFin = req.params.fecha_fin;

    const fechaInicioFormateada = gestorComun.formatDateToMySQL(fechaInicio);
    const fechaFinFormateada = gestorComun.formatDateToMySQL(fechaFin);

    const eventos = await gestorAgendaEvento.recuperarEventosRangoFecha(
      bPublicos,
      fechaInicioFormateada,
      fechaFinFormateada,
    );

    const eventosConcertos =
      await gestorEventoConcierto.obtenerEventosConciertoRangoFecha(
        fechaInicioFormateada,
        fechaFinFormateada,
        bPublicos,
      );

    const eventosCombinados = eventos.concat(eventosConcertos);

    res.status(200).send({ error: false, eventos: eventosCombinados });
  } catch (error) {
    res
      .status(500)
      .send({ error: true, mensaje: "Error interno del servidor" });
  }
}

async function obtenerEventosMes(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    let rolDirector = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    const bPublicos = !rolDirector;

    const mes = req.params.mes;
    const anio = req.params.anio;

    const eventos = await gestorAgendaEvento.recuperarEventosMes(
      bPublicos,
      mes,
      anio,
    );

    res.status(200).send({ error: false, eventos: eventos });
  } catch (error) {
    res
      .status(500)
      .send({ error: true, mensaje: "Error interno del servidor" });
  }
}

module.exports.obtenerEventos = obtenerEventos;
module.exports.obtenerEventosFecha = obtenerEventosFecha;
module.exports.registrarEvento = registrarEvento;
module.exports.actualizarEvento = actualizarEvento;
module.exports.eliminarEvento = eliminarEvento;
module.exports.obtenerEventosRangoFechas = obtenerEventosRangoFechas;
module.exports.obtenerEventosMes = obtenerEventosMes;
