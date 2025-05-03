const eslintPluginPrettier = require("eslint-plugin-prettier");
const conexion = require("../conexion.js");

function existePersona(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al verificar la existencia de la persona:", error);
        return reject(error);
      }
      resolve(results.length > 0);
    });
  });
}

function requiereActualizarPersona(nid_persona, fecha_actualizacion) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND fecha_actualizacion > " +
      conexion.dbConn.escape(fecha_actualizacion);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "Error al verificar si se requiere actualizar la persona:",
          error
        );
        return reject(error);
      }
      resolve(results.length > 0);
    });
  });
}

function actualizarPersona(
  nid_persona,
  nombre,
  primer_apellido,
  segundo_apellido,
  fecha_nacimiento,
  nif,
  telefono,
  correo_electronico,
  nid_madre,
  nid_padre
) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE persona SET nombre = " +
      conexion.dbConn.escape(nombre) +
      ", primer_apellido = " +
      conexion.dbConn.escape(primer_apellido) +
      ", segundo_apellido = " +
      conexion.dbConn.escape(segundo_apellido) +
      ", fecha_nacimiento = " +
      conexion.dbConn.escape(fecha_nacimiento) +
      ", nif = " +
      conexion.dbConn.escape(nif) +
      ", telefono = " +
      conexion.dbConn.escape(telefono) +
      ", correo_electronico = " +
      conexion.dbConn.escape(correo_electronico) +
      ", nid_madre = " +
      conexion.dbConn.escape(nid_madre) +
      ", nid_padre = " +
      conexion.dbConn.escape(nid_padre) +
    " WHERE nid_persona = " + conexion.dbConn.escape(nid_persona);

    conexion.dbConn.beginTransaction((err) => {
      conexion.dbConn.query(sql, (error) => {
        if (error) {
          console.error("Error al actualizar la persona:", error);
          return conexion.dbConn.rollback(() => {
            reject(error);
          });
        }
        conexion.dbConn.commit((err) => {
          if (err) {
            console.error("Error al confirmar la transacción:", err);
            return conexion.dbConn.rollback(() => {
              reject(err);
            });
          } else {
            resolve();
          }
        });
      });
    });
  });
}

function insertarPersona(
  nid_persona,
  nombre,
  primer_apellido,
  segundo_apellido,
  fecha_nacimiento,
  nif,
  telefono,
  correo_electronico,
  nid_madre,
  nid_padre
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO persona (nid_persona, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, nif, telefono, correo_electronico, nid_madre, nid_padre) VALUES (" +
      conexion.dbConn.escape(nid_persona) +
      ", " +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(primer_apellido) +
      ", " +
      conexion.dbConn.escape(segundo_apellido) +
      ", " +
      conexion.dbConn.escape(fecha_nacimiento) +
      ", " +
      conexion.dbConn.escape(nif) + 
      ", " +
      conexion.dbConn.escape(telefono) +
      ", " +
      conexion.dbConn.escape(correo_electronico) +
      ", " +
      conexion.dbConn.escape(nid_madre) +
      ", " +
      conexion.dbConn.escape(nid_padre) +
      ")";

    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.error("Error al iniciar la transacción:", err);
        reject(err);
      } else {
        conexion.dbConn.query(sql, (error) => {
          if (error) {
            console.error("Error al insertar la persona:", error);
            reject(error);
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

async function registrarPersona(
  nid_persona,
  nombre,
  primer_apellido,
  segundo_apellido,
  fecha_nacimiento,
  nif,
  telefono,
  correo_electronico,
  nid_madre,
  nid_padre,
  fecha_actualizacion
) {
  try {
    const existe = await existePersona(nid_persona);

    if (existe) {
      const requiereActualizar = await requiereActualizarPersona(
        nid_persona,
        fecha_actualizacion
      );
      if (requiereActualizar) {
        await actualizarPersona(
          nid_persona,
          nombre,
          primer_apellido,
          segundo_apellido,
          fecha_nacimiento,
          nif,
          telefono,
          correo_electronico,
          nid_madre,
          nid_padre,
    
        );
        console.log("Persona actualizada correctamente.");
        return;
      } else {
        console.log("La persona ya existe y no requiere actualización.");
      }
    } else {
      await insertarPersona(
        nid_persona,
        nombre,
        primer_apellido,
        segundo_apellido,
        fecha_nacimiento,
        nif,
        telefono,
        correo_electronico,
        nid_madre,
        nid_padre
      );
      console.log("Persona insertada correctamente.");
    }
  } catch (error) {
    console.error("Error al registrar la persona:", error);
    throw new Error("Error al registrar la persona"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

module.exports.registrarPersona = registrarPersona;
