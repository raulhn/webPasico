const envio_email = require("../config/envio_email_solicitud.json");
const conexion = require("../conexion");
const constantes = require("../constantes");

function insertarSolicitudEliminacionUsuario(correo_electronico) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA_BD +
      ".solicitudes_eliminar_usuario (correo_electronico) VALUES (" +
      conexion.dbConn.escape(correo_electronico) +
      ")";

    conexion.dbConn.query(sql, (error) => {
      if (error) {
        console.error(
          "Error al insertar la solicitud de eliminación de usuario:",
          error,
        );
        conexion.dbConn.rollback();
        reject(
          new Error("Error al insertar la solicitud de eliminación de usuario"),
        );
      } else {
        conexion.dbConn.commit();
        resolve();
      }
    });
  });
}

function registrarCorreoEliminacion(to, subject, html) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO " +
      constantes.ESQUEMA_BD_MOVIL +
      ".envio_correo (correo_electronico, asunto, cuerpo, estado) " +
      "VALUES (" +
      conexion.dbConn.escape(to) +
      ", 'Verificación de correo', " +
      conexion.dbConn.escape(html) +
      ", '0')";
    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al registrar el correo de validación:", error);
        conexion.dbConn.rollback();
        reject(error);
      } else {
        conexion.dbConn.commit();
        resolve(results.insertId); // Devuelve el ID del nuevo registro
      }
    });
  });
}

async function registrarSolicitudEliminacionUsuario(correo_electronico) {
  try {
    await insertarSolicitudEliminacionUsuario(correo_electronico);

    const to = envio_email.to;
    const subject = "Solicitud de eliminación de usuario recibida";
    const html =
      "<h1>Solicitud de eliminación de usuario recibida</h1>" +
      "<p>Recibida solicitud para eliminar la cuenta de usuario.</p>" +
      correo_electronico +
      "<br>" +
      "<p>Revisa las últimas solicitudes recibidas</>";
    await registrarCorreoEliminacion(to, subject, html);
  } catch (error) {
    throw error;
  }
}

module.exports.registrarSolicitudEliminacionUsuario =
  registrarSolicitudEliminacionUsuario;
