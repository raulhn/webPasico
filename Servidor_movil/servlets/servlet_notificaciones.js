const gestorNotificaciones = require("../logica/notificaciones.js");

async function registrarNotificacion(req, res) {
  try {
    const { personas, titulo, mensaje, data } = req.body;

    if (!personas || !titulo || !mensaje) {
      res.status(400).send({
        error: true,
        mensaje: "Faltan datos necesarios para registrar la notificación",
      });
      return;
    }

    await gestorNotificaciones.enviarNotificaciones(
      personas,
      titulo,
      mensaje,
      data
    );

    res.status(200).send({
      error: false,
      mensaje: "Notificación registrada correctamente",
    });
  } catch (error) {
    console.error("Error al registrar la notificación:", error);
    res.status(500).send({
      error: true,
      mensaje: "Error al registrar la notificación",
    });
  }
}

async function registrarNotificacionGrupo(req, res) {
  try {
    const { nid_grupo, grupos, titulo, mensaje, data } = req.body;

    if (!grupos || !titulo || !mensaje) {
      res.status(400).send({
        error: true,
        mensaje:
          "Faltan datos necesarios para registrar la notificación de grupo",
      });
      return;
    }

    await gestorNotificaciones.registrarNotificacionGrupo(
      nid_grupo,
      grupos,
      titulo,
      mensaje,
      data
    );

    res.status(200).send({
      error: false,
      mensaje: "Notificación de grupo registrada correctamente",
    });
  } catch (error) {
    console.error("Error al registrar la notificación de grupo:", error);
    res.status(500).send({
      error: true,
      mensaje: "Error al registrar la notificación de grupo",
    });
  }
}

module.exports.registrarNotificacion = registrarNotificacion;
module.exports.registrarNotificacionGrupo = registrarNotificacionGrupo;
