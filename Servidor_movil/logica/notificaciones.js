const gestorPersonas = require("./persona.js");
const gestorConexiones = require("./gestorConexiones.js");
const conexion = require("../conexion.js");
const gestorUsuario = require("./usuario.js");
const constantes = require("../constantes.js");
const cron = require("node-cron");
const gestorMusicos = require("./musicos.js");

const Expo = require("expo-server-sdk");

function insertarNotificacion(pushToken, titulo, body, data) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      const sql =
        "INSERT INTO " +
        constantes.ESQUEMA +
        ".notificaciones (push_token, titulo, body, data, estado) VALUES (" +
        conexion.dbConn.escape(pushToken) +
        ", " +
        conexion.dbConn.escape(titulo) +
        ", " +
        conexion.dbConn.escape(body) +
        ", " +
        conexion.dbConn.escape(JSON.stringify(data)) +
        ", " +
        conexion.dbConn.escape("PENDIENTE") +
        ")";

      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al insertar la notificación:", error);
          conexion.dbConn.rollback();
          reject("Error al insertar la notificación");
        } else {
          conexion.dbConn.commit();
          resolve(result.insertId);
        }
      });
    });
  });
}

async function registrarNotificacion(nid_persona, titulo, body, data) {
  try {
    const usuario = await gestorPersonas.obtenerUsuarioPersona(nid_persona);

    if (!usuario) {
      console.log(
        "No se encontró un usuario asociado a la persona con nid_persona:",
        nid_persona
      );
      return null;
    }
    const pushToken = await gestorConexiones.obtenerTokenUsuario(
      usuario.nid_usuario
    );
    if (!pushToken) {
      throw new Error(
        "No se encontró un token de notificación para el usuario."
      );
    } else {
      const nid_notificacion = await insertarNotificacion(
        pushToken,
        titulo,
        body,
        data
      );
      return nid_notificacion; // Retorna el ID de la notificación insertada
    }
  } catch (error) {
    console.error("Error al registrar la notificación:", error);
    throw error;
  }
}

async function enviarNotificaciones(personas, titulo, body, data) {
  try {
    let personasANotificar = [...personas];
    for (const nid_persona of personas) {
      const esSocio = await gestorPersonas.esSocio(nid_persona);
      if (!esSocio) {
        //Si no es socio se comprueba si tiene padres a los que enviar la notificación
        const nid_padre = await gestorPersonas.obtenerPadre(nid_persona);
        const nid_madre = await gestorPersonas.obtenerMadre(nid_persona);
        const nid_socio = await gestorPersonas.obtenerSocio(nid_persona);

        personasANotificar.push(nid_padre);
        personasANotificar.push(nid_madre);
        personasANotificar.push(nid_socio);
      }
    }

    let personasUnicas = [...new Set(personasANotificar)];
    for (const nid_persona of personasUnicas) {
      const nid_notificacion = await registrarNotificacion(
        nid_persona,
        titulo,
        body,
        data
      );
    }
  } catch (error) {
    console.error("Error al enviar notificaciones:", error);
    throw error;
  }
}

async function enviarNotificacionesTodos(titulo, body, data) {
  try {
    const usuarios = await gestorUsuario.obtenerUsuarios();

    for (const usuario of usuarios) {
      const nid_notificacion = await insertarNotificacion(
        pushToken,
        titulo,
        body,
        data
      );
    }
  } catch (error) {
    console.error("No se han podido enviar todas las notificaciones:", error);
    throw new Error("No se han podido enviar todas las notificaciones ");
  }
}

function obtenerNotificacionesEstado(estado) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".notificaciones WHERE estado = " +
      conexion.dbConn.escape(estado);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener notificaciones pendientes:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function actualizarIdEnvioNotificacion(nid_notificacion, id_envio) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".notificaciones SET id_envio_notificacion = " +
      conexion.dbConn.escape(id_envio) +
      " WHERE nid_notificacion = " +
      conexion.dbConn.escape(nid_notificacion);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error(
            "Error al actualizar el ID de envío de la notificación:",
            error
          );
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(result.affectedRows > 0);
        }
      });
    });
  });
}

async function enviarChunk(chunks, expo) {
  let tickets = [];
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

      tickets.push(...ticketChunk);

      for (let i = 0; i < ticketChunk.length; i++) {
        const notificacion = chunk[i];
        const ticket = ticketChunk[i];

        await actualizarIdEnvioNotificacion(
          notificacion.nid_notificacion,
          ticket.id
        );
      }

      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
}

function actualizarEstadoNotificacion(nid_notificacion, estado) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".notificaciones SET estado = " +
      conexion.dbConn.escape(estado) +
      " WHERE nid_notificacion = " +
      conexion.dbConn.escape(nid_notificacion);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error(
            "Error al actualizar el estado de la notificación:",
            error
          );
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(result.affectedRows > 0);
        }
      });
    });
  });
}

async function enviarNotificacionesPendientes() {
  try {
    let expo = new Expo.Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN,
      useFcmV1: true,
    });

    let notificacionesPendientes =
      await obtenerNotificacionesEstado("PENDIENTE");

    let messages = [];
    for (const notificacion of notificacionesPendientes) {
      messages.push({
        to: notificacion.push_token,
        sound: "default",
        body: notificacion.body,
        data: {},
        nid_notificacion: notificacion.nid_notificacion,
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    await enviarChunk(chunks, expo);

    for (const notificacion of notificacionesPendientes) {
      await actualizarEstadoNotificacion(
        notificacion.nid_notificacion,
        "ENVIADA"
      );
    }
  } catch (error) {
    console.error("Error al enviar notificaciones:", error);
    throw new Error("Error al enviar notificaciones");
  }
}

function procesoEnviarNotificaciones() {
  console.log("Iniciando el proceso de envío de notificaciones...");
  cron.schedule("*/1 * * * *", async () => {
    try {
      await enviarNotificacionesPendientes();
      await procesoObtenerRecibos();
      await eliminarErrorRecibos();
    } catch (error) {
      console.error("Error en el proceso de envío de notificaciones:", error);
    }
  });
}

async function obtenerRecibos() {
  try {
    const notificaciones = await obtenerNotificacionesEstado("ENVIADA");
    return new Promise((resolve, reject) => {
      let idsEnvio = [];

      for (const notificacion of notificaciones) {
        if (notificacion.id_envio_notificacion) {
          idsEnvio.push(notificacion.id_envio_notificacion);
        }
      }

      const data = {
        ids: idsEnvio,
      };

      const urlRecibo = "https://exp.host/--/api/v2/push/getReceipts";

      fetch(urlRecibo, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error("Error al obtener el recibo de envío:", error);
          reject(new Error("Error al obtener el recibo de envío"));
        });
    });
  } catch (error) {
    console.error("Error al obtener los recibos:", error);
    throw new Error("Error al obtener los recibos");
  }
}

function procesarNotificacion(idEnvioNotificacion, estado) {
  return new Promise((resolve, reject) => {
    const sql =
      "Update " +
      constantes.ESQUEMA +
      ".notificaciones SET estado = " +
      conexion.dbConn.escape(estado) +
      " WHERE id_envio_notificacion = " +
      conexion.dbConn.escape(idEnvioNotificacion);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.error("Error al procesar la notificación:", error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(result.affectedRows > 0);
        }
      });
    });
  });
}

async function procesoObtenerRecibos() {
  try {
    let recibos = await obtenerRecibos();
    for (const [id, recibo] of Object.entries(recibos.data)) {
      if (recibo.status === "ok") {
        procesarNotificacion(id, "PROCESADA");
      } else if (recibo.status === "error") {
        procesarNotificacion(id, "ERROR_RECIBO");
      }
    }
  } catch (error) {
    console.error("Error al procesar los recibos de notificaciones:", error);
    throw new Error("Error al procesar los recibos de notificaciones");
  }
}

async function eliminarErrorRecibos() {
  try {
    let notificacionesError = await obtenerNotificacionesEstado("ERROR_RECIBO");
    for (const notificacion of notificacionesError) {
      try {
        await gestorConexiones.eliminarToken(notificacion.push_token);
      } catch (error) {
        console.error(
          "Error al eliminar la conexión con push token" +
            notificacion.push_token,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error al eliminar los errores de recibos:", error);
    throw new Error("Error al eliminar los errores de recibos");
  }
}

async function registrarNotificacionGrupo(
  nid_grupo,
  grupos,
  titulo,
  body,
  data
) {
  try {
    if (nid_grupo === constantes.BANDA) {
      let personas = await gestorMusicos.obtenerPersonasTipoMusico(grupos);
      await enviarNotificaciones(personas, titulo, body, data);
    }
  } catch (error) {
    console.error("Error al registrar la notificación del grupo:", error);
    throw error;
  }
}

module.exports.enviarNotificaciones = enviarNotificaciones;
module.exports.enviarNotificacionesTodos = enviarNotificacionesTodos;
module.exports.procesoEnviarNotificaciones = procesoEnviarNotificaciones;
module.exports.registrarNotificacion = registrarNotificacion;
module.exports.registrarNotificacionGrupo = registrarNotificacionGrupo;
