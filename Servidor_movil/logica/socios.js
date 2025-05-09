const conexion = require("../conexion");
const constantes = require("../constantes");

function insertarSocio(
  nid_persona,
  fecha_alta,
  fecha_baja,
  num_socio,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO " +
      constantes.ESQUEMA +
      ".socios (nid_persona, fecha_alta, fecha_baja, num_socio, fecha_actualizacion) VALUES (" +
      conexion.dbConn.escape(nid_persona) +
      ", " +
      conexion.dbConn.escape(fecha_alta) +
      ", " +
      conexion.dbConn.escape(fecha_baja) +
      ", " +
      conexion.dbConn.escape(num_socio) +
      ", " +
      conexion.dbConn.escape(fecha_actualizacion) +
      ")";

    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.error("Error al iniciar la transacción:", err);
        reject(new Error("Error al iniciar la transacción"));
      } else {
        conexion.dbConn.query(sql, (error) => {
          if (error) {
            console.error("Error al insertar el socio:", error);
            reject(new Error("Error al insertar el socio"));
          }
          conexion.dbConn.commit((err) => {
            if (err) {
              console.error("Error al confirmar la transacción:", err);
              conexion.dbConn.rollback(() => {
                reject(err);
              });
            }
          });
          resolve();
        });
      }
    });
  });
}

function actualizarSocio(
  nid_persona,
  fecha_alta,
  fecha_baja,
  num_socio,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".socios SET fecha_alta = " +
      conexion.dbConn.escape(fecha_alta) +
      ", fecha_baja = " +
      conexion.dbConn.escape(fecha_baja) +
      ", num_socio = " +
      conexion.dbConn.escape(num_socio) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(fecha_actualizacion) +
      " WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.error("Error al iniciar la transacción:", err);
        reject(err);
      } else {
        conexion.dbConn.query(sql, (error) => {
          if (error) {
            console.error("Error al actualizar el socio:", error);
            reject(error);
          }
          conexion.dbConn.commit((err) => {
            if (err) {
              console.error("Error al confirmar la transacción:", err);
              conexion.dbConn.rollback(() => {
                reject(err);
              });
            }
            resolve();
          });
        });
      }
    });
  });
}

function existeSocio(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS existe FROM " +
      constantes.ESQUEMA +
      ".socios WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al verificar la existencia del socio:", error);
        reject(error);
      } else {
        resolve(results[0].existe > 0);
      }
    });
  });
}

async function registrarSocio(
  nid_persona,
  fecha_alta,
  fecha_baja,
  num_socio,
  fecha_actualizacion
) {
  try {
    let existe = await existeSocio(nid_persona);
    if (existe) {
      return await actualizarSocio(
        nid_persona,
        fecha_alta,
        fecha_baja,
        num_socio,
        fecha_actualizacion
      );
    } else {
      return await insertarSocio(
        nid_persona,
        fecha_alta,
        fecha_baja,
        num_socio,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar el socio:", error);
    throw new Error("Error al registrar el socio");
  }
}

function esSocio(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT COUNT(*) AS esSocio FROM " +
      constantes.ESQUEMA +
      ".socios WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al verificar si es socio:", error);
        reject(error);
      } else {
        resolve(results[0].esSocio > 0);
      }
    });
  });
}

function obtenerSocio(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".socios WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener el socio:", error);
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

module.exports.registrarSocio = registrarSocio;
module.exports.esSocio = esSocio;
module.exports.obtenerSocio = obtenerSocio;
