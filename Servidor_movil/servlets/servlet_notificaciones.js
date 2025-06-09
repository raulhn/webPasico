const gestorNotificaciones = require("../logica/notificaciones.js");

async function registrarNotificacion(req, res) {
  try {
    console.log("Iniciando el registro de notificación...");
    const { personas, titulo, mensaje, data } = req.body;

    console.log(
      "Datos recibidos para registrar la notificación:",
      personas,
      titulo,
      mensaje,
      data
    );
    if (!personas || !titulo || !mensaje) {
      return res.status(400).send({
        error: true,
        mensaje: "Faltan datos necesarios para registrar la notificación",
      });
    }

    console.log(
      "Registrando notificación para personas:",
      personas,
      "Título:",
      titulo,
      "Mensaje:",
      mensaje,
      "Data:",
      data
    );
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
