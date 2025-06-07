const gestorPersonas = require("./persona.js");
const gestorConexiones = require("./gestorConexiones.js");
const conexion = require("../conexion.js");

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
    for (const persona of personas) {
      const nid_persona = persona.nid_persona;
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
