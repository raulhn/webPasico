const gestorNotificaciones = require("../logica/notificaciones.js");

async function registrarNotificacion(req, res) {
  try {
    const { personas, titulo, mensaje, data } = req.body;

    if (!nid_persona || !titulo || !mensaje) {
      return res.status(400).send({
        error: true,
        mensaje: "Faltan datos necesarios para registrar la notificación",
      });
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
    return res.status(500).send({
      error: true,
      mensaje: "Error al registrar la notificación",
    });
  }
}

module.exports.registrarNotificacion = registrarNotificacion;
