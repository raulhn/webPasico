const crypto = require("crypto");
const cron = require("node-cron");
const nodeMail = require("./nodemail");
const constantes = require("../constantes.js");
const conexion = require("../conexion.js");

function generarTokenVerificacion() {
  return crypto.randomBytes(32).toString("hex");
}

function registrarValidacionMail(nid_usuario) {
  return new Promise((resolve, reject) => {
    const token = generarTokenVerificacion();
    const query =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".validacion_mail (nid_usuario, token, fecha) " +
      "VALUES (" +
      conexion.dbConn.escape(nid_usuario) +
      ", " +
      conexion.dbConn.escape(token) +
      ", sysdate())";

    conexion.dbConn.query(query, async (error, results) => {
      if (error) {
        console.error("Error al registrar la validación de correo:", error);
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
}

function registrarCorreoValidacion(correoElectronico, token) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".envio_correo (correo_electronico, asunto, cuerpo, estado) " +
      "VALUES (" +
      conexion.dbConn.escape(correoElectronico) +
      ", 'Validación de correo', 'Por favor valide su correo ' " +
      conexion.dbConn.escape("https://ladelpasico.es/valida/" + token) +
      ", '0')";

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al registrar el correo de validación:", error);
        reject(error);
      } else {
        resolve(results.insertId); // Devuelve el ID del nuevo registro
      }
    });
  });
}

async function enviarEmailValidacion(nid_usuario, correoElectronico) {
  try {
    const token = await registrarValidacionMail(nid_usuario);
    await registrarCorreoValidacion(correoElectronico, token);
  } catch (error) {
    console.error("Error al enviar el correo de validación:", error);
  }
}

function obtenerUsuario(token) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT nid_usuario FROM " +
      constantes.ESQUEMA +
      ".validacion_mail WHERE token = " +
      conexion.dbConn.escape(token);

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al validar el correo:", error);
        reject(error);
      } else if (results.length > 0) {
        resolve(results[0].nid_usuario);
      } else {
        resolve(null); // Token no válido
      }
    });
  });
}

function verificarUsuario(nid_usuario) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE " +
      constantes.ESQUEMA +
      ".usuario SET verificado = 'S' WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al verificar el usuario:", error);
        reject(error);
      } else {
        resolve(results.affectedRows > 0); // true si se actualizó, false si no
      }
    });
  });
}

async function validarEmail(token) {
  try {
    const nid_usuario = await obtenerUsuario(token);
    if (!nid_usuario) {
      console.error("Token no válido o ya utilizado.");
      return false;
    }

    const verificado = await verificarUsuario(nid_usuario);
    if (!verificado) {
      console.error("Error al verificar el usuario.");
      return false;
    }

    return true;
  } catch (error) {
    console.log("Error en la validación del correo:", error);
    return false;
  }
}

function actualizarEstadoEnvioCorreo(nid_envio_correo, estado, error) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE " +
      constantes.ESQUEMA +
      ".envio_correo SET estado = " +
      conexion.dbConn.escape(estado) +
      ", error = " +
      conexion.dbConn.escape(error) +
      "  WHERE nid_envio_correo = " +
      conexion.dbConn.escape(nid_envio_correo);

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error(
          "Error al actualizar el estado del envío de correo:",
          error
        );
        reject(error);
      } else {
        resolve(results.affectedRows > 0); // true si se actualizó, false si no
      }
    });
  });
}

async function enviarCorreo(nid_envio_correo, to, subject, html) {
  try {
    let resultado = await nodeMail.enviarEmail(to, subject, html);
    console.log("Envinado correo a: " + to);
    console.log("Asunto: " + subject);
    if (resultado.error) {
      console.error("Error al enviar el correo:", resultado.message);
      await actualizarEstadoEnvioCorreo(
        nid_envio_correo,
        "1",
        resultado.message
      );
    } else {
      console.log("Correo enviado:", resultado.message);
      await actualizarEstadoEnvioCorreo(nid_envio_correo, "2", null);
    }
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}

function enviarCorreos() {
  console.log("Iniciando el envío de correos programado...");
  cron.schedule("*/1 * * * *", () => {
    console.log("Ejecutando tarea programada para enviar correos...");
    const query =
      "select * from " +
      constantes.ESQUEMA +
      ".envio_correo where estado = '0'";

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener correos pendientes:", error);
        return;
      }

      results.forEach(async (row) => {
        await enviarCorreo(
          row.nid_envio_correo,
          row.correo_electronico,
          row.asunto,
          row.cuerpo
        );
      });
    });
  });
}

module.exports.enviarEmailValidacion = enviarEmailValidacion;
module.exports.validarEmail = validarEmail;
module.exports.enviarCorreos = enviarCorreos;
