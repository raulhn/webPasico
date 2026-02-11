const gestorEventos = require("../logica/eventoConcierto.js");
const servlet_comun = require("./servlet_comun.js");
const gestor_tipo_evento_musico = require("../logica/tipo_evento_musico.js");
const constantes = require("../constantes.js");

async function insertarEventoConcierto(req, res) {
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
    } else {
      let nombre = req.body.nombre;
      let descripcion = req.body.descripcion;
      let fecha_evento = req.body.fecha_evento;
      let tipo_evento = req.body.tipo_evento;
      let publicado = req.body.publicado;
      let vestimenta = req.body.vestimenta;
      let lugar = req.body.lugar;
      let hora = req.body.hora;

      let tiposEvento = req.body.tiposEvento;

      console.log(
        "Registrar Evento Concierto: ",
        nombre,
        descripcion,
        fecha_evento,
        hora,
        tipo_evento,
        publicado,
        vestimenta,
        lugar,
      );

      const nidEventoConcierto = await gestorEventos.insertarEventoConcierto(
        nombre,
        descripcion,
        fecha_evento,
        hora,
        tipo_evento,
        publicado,
        vestimenta,
        lugar,
      );

      if (tiposEvento !== null && tiposEvento.length > 0) {
        for (let i = 0; i < tiposEvento.length; i++) {
          await gestor_tipo_evento_musico.registrar_tipo_evento_musico(
            nidEventoConcierto,
            tiposEvento[i],
          );
        }
      }
      res.status(200).send({
        error: false,
        mensaje: "Evento de concierto registrado correctamente",
      });
    }
  } catch (error) {
    console.error(
      "servletEventoConcierto.js -> insertarEventoConcierto: Error al registrar el evento de concierto:" +
        error.message,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al registrar el evento de concierto",
    });
  }
}

async function actualizarEventoConcierto(req, res) {
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
    } else {
      let nid_evento = req.body.nid_evento_concierto;
      let nombre = req.body.nombre;
      let descripcion = req.body.descripcion;
      let fecha_evento = req.body.fecha_evento;
      let tipo_evento = req.body.tipo_evento;
      let publicado = req.body.publicado;
      let vestimenta = req.body.vestimenta;
      let lugar = req.body.lugar;
      let hora = req.body.hora;

      let tiposEvento = req.body.tiposEvento;

      await gestorEventos.actualizarEventoConcierto(
        nid_evento,
        nombre,
        descripcion,
        fecha_evento,
        hora,
        tipo_evento,
        publicado,
        vestimenta,
        lugar,
      );

      await gestor_tipo_evento_musico.eliminar_tipos_evento_musico(nid_evento);

      for (let i = 0; i < tiposEvento.length; i++) {
        await gestor_tipo_evento_musico.registrar_tipo_evento_musico(
          nid_evento,
          tiposEvento[i],
        );
      }

      res.status(200).send({
        error: false,
        mensaje: "Evento de concierto actualizado correctamente",
      });
    }
  } catch (error) {
    console.error(
      "Error al actualizar el evento de concierto:" + error.message,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al actualizar el evento de concierto",
    });
  }
}

async function obtenerEventosConcierto(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];

    let rolPermitido = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolPermitido) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los eventos de concierto",
      });
    } else {
      let eventos = await gestorEventos.obtenerEventosConcierto();

      for (let i = 0; i < eventos.length; i++) {
        let tiposEvento = await gestor_tipo_evento_musico.obtener_tipos_evento(
          eventos[i].nid_evento_concierto,
        );
        eventos[i].tipos_evento = tiposEvento;
      }

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

async function registrar_partitura_evento(req, res) {
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
        mensaje:
          "No tienes permisos para registrar una partitura en un evento de concierto",
      });
    } else {
      let nid_evento_concierto = req.body.nid_evento_concierto;
      let nid_partitura = req.body.nid_partitura;

      console.log(
        "Registrar Partitura Evento Concierto: ",
        nid_evento_concierto,
        nid_partitura,
      );

      let existe = await gestorEventos.existePartituraEvento(
        nid_evento_concierto,
        nid_partitura,
      );

      if (existe) {
        res.status(400).send({
          error: true,
          mensaje: "La partitura ya está registrada en el evento",
        });
      } else {
        await gestorEventos.registrar_partitura_evento(
          nid_evento_concierto,
          nid_partitura,
        );

        res.status(200).send({
          error: false,
          mensaje: "Partitura registrada correctamente en el evento",
        });
      }
    }
  } catch (error) {
    console.error(
      "Error al registrar la partitura en el evento:" + error.message,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al registrar la partitura en el evento",
    });
  }
}

async function eliminar_partitura_evento(req, res) {
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
        mensaje:
          "No tienes permisos para eliminar una partitura de un evento de concierto",
      });
    } else {
      let nid_evento_concierto = req.body.nid_evento_concierto;
      let nid_partitura = req.body.nid_partitura;

      console.log(
        "Eliminar Partitura Evento Concierto: ",
        nid_evento_concierto,
        nid_partitura,
      );

      await gestorEventos.eliminar_partitura_evento(
        nid_evento_concierto,
        nid_partitura,
      );

      res.status(200).send({
        error: false,
        mensaje: "Partitura eliminada correctamente del evento de concierto",
      });
    }
  } catch (error) {
    console.error(
      "Error al eliminar la partitura del evento de concierto:" + error.message,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al eliminar la partitura del evento de concierto",
    });
  }
}

async function obtenerPartiturasEvento(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    let rolPermitido = await servlet_comun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolPermitido) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener las partituras del evento",
      });
    } else {
      let nid_evento_concierto = req.params.nid_evento_concierto;
      let evento_concierto =
        await gestorEventos.obtenerEventoConcierto(nid_evento_concierto);
      let partituras =
        await gestorEventos.obtenerPartiturasEvento(nid_evento_concierto);
      let tipos_evento =
        await gestor_tipo_evento_musico.obtener_tipos_evento(
          nid_evento_concierto,
        );
      if (evento_concierto) {
        res.status(200).send({
          error: false,
          mensaje: "Partituras obtenidas correctamente",
          partituras: partituras,
          evento_concierto: evento_concierto,
          tipos_evento: tipos_evento,
        });
      } else {
        res.status(404).send({
          error: true,
          mensaje: "No se encontraron partituras para el evento de concierto",
        });
      }
    }
  } catch (error) {
    console.error(
      "servletEventoConcierto.js -> obtenerPartiturasEvento: Error al obtener las partituras del evento de concierto:" +
        error,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener las partituras del evento de concierto",
    });
  }
}

async function eliminar_evento(req, res) {
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
    } else {
      let nid_evento_concierto = req.body.nid_evento_concierto;

      await gestorEventos.eliminarEvento(nid_evento_concierto);

      res.status(200).send({
        error: false,
        mensaje: "Evento de concierto eliminado correctamente",
      });
    }
  } catch (error) {
    console.error("Error al eliminar el evento de concierto:" + error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al eliminar el evento de concierto",
    });
  }
}

module.exports.insertarEventoConcierto = insertarEventoConcierto;
module.exports.actualizarEventoConcierto = actualizarEventoConcierto;
module.exports.obtenerEventosConcierto = obtenerEventosConcierto;
module.exports.registrar_partitura_evento = registrar_partitura_evento;
module.exports.eliminar_partitura_evento = eliminar_partitura_evento;
module.exports.obtenerPartiturasEvento = obtenerPartiturasEvento;
module.exports.eliminar_evento = eliminar_evento;
