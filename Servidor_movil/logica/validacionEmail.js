const crypto = require("crypto");
const cron = require("node-cron");

function generarTokenVerificacion() {
  return crypto.randomBytes(32).toString("hex");
}

function registrarValidacionMail(nid_usuario) {
  return new Promise((resolve, reject) => {
    const token = generarTokenVerificacion();
    const query =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".validacion_email (nid_usuario, token, fecha) " +
      "VALUES (" +
      conexion.dbConn.escape(nid_usuario) +
      ", " +
      conexion.dbConn.escape(token) +
      ", sysdate())";

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al registrar la validación de correo:", error);
        reject(error);
      } else {
        resolve(token);
      }
    });
  });
}

async function enviarEmailValidacion(nid_usuario, correoElectronico) {
  try {
    const token = await registrarValidacionMail(nid_usuario);
  } catch (error) {
    console.error("Error al enviar el correo de validación:", error);
  }
}

function obtenerUsuario(token) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT nid_usuario FROM " +
      constantes.ESQUEMA +
      ".validacion_email WHERE token = " +
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

function enviarCorreos() {
  cron.schedule("*/5 * * * *", () => {
    console.log("Ejecutando tarea periódica cada 5 minutos:", new Date());
    //Aqui se enviarán los correos
  });
}

module.exports.enviarEmailValidacion = enviarEmailValidacion;
module.exports.validarEmail = validarEmail;
