const eslintPluginPrettier = require("eslint-plugin-prettier");
const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestorUsuario = require("./usuario.js");

function existePersona(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
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
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND (fecha_actualizacion < " +
      conexion.dbConn.escape(fecha_actualizacion) +
      " or fecha_actualizacion is null)";

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
  nid_padre,
  fecha_actualizacion
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
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(fecha_actualizacion) +
      ", sucio = 'N'" +
      " WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

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
          fecha_actualizacion
        );

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

function obtenerPersonasSucias() {
  const consulta =
    "select * from " +
    constantes.ESQUEMA +
    ".persona p " +
    " where p.sucio = 'S'";

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(consulta, (error, result) => {
      if (error) {
        console.error("Error al obtener las personas sucias:", error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function limpiarPersona(nid_persona) {
  const instruccion =
    "update " +
    constantes.ESQUEMA +
    ".persona set sucio = 'N' " +
    " where nid_persona = " +
    conexion.dbConn.escape(nid_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.error("Error al iniciar la transacción:", err);
        reject(err);
      } else {
        conexion.dbConn.query(instruccion, (error, result) => {
          if (error) {
            console.error("Error al limpiar la persona:", error);
            conexion.dbConn.rollback();
            reject(error);
          } else {
            conexion.dbConn.commit();
            resolve(result);
          }
        });
      }
    });
  });
}

async function obtenerUsuario(nid_usuario) {
  try {
    let existe = await gestorUsuario.existeUsuarioNid(nid_usuario);

    return new Promise((resolve, reject) => {
      if (existe) {
        const sql =
          "SELECT * FROM " +
          constantes.ESQUEMA +
          ".usuarios WHERE nid_usuario = " +
          conexion.dbConn.escape(nid_usuario);

        conexion.dbConn.query(sql, (error, results) => {
          if (error) {
            console.error("Error al obtener el usuario:", error);
            return reject(error);
          }
          resolve(results[0]);
        });
      } else {
        resolve(null);
      }
    });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw new Error("Error al obtener el usuario"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

function obtenerPersonaNombre(
  nombre,
  primer_apellido,
  segundo_apellido,
  correo_electronico
) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nombre = " +
      conexion.dbConn.escape(nombre) +
      " AND primer_apellido = " +
      conexion.dbConn.escape(primer_apellido) +
      " AND segundo_apellido = " +
      conexion.dbConn.escape(segundo_apellido) +
      " AND correo_electronico = " +
      conexion.dbConn.escape(correo_electronico);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener la persona:", error);
        return reject(error);
      }
      if (results.length === 0) {
        return resolve(null); // No se encontró la persona
      } else {
        resolve(results[0]);
      }
    });
  });
}

function actualizarPersonaUsuario(nid_persona, nid_usuario) {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".usuarios SET nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario) +
      " and verificado = 'S'";

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al actualizar la persona del usuario:", error);
        return reject(error);
      }
      resolve(results);
    });
  });
}

async function asociarUsuarioPersona(nid_usuario) {
  try {
    let usuario = await obtenerUsuario(nid_usuario);

    if (usuario && usuario.nid_persona === null) {
      // Si el usuario no tiene una persona asociada, buscamos la persona por nombre y apellidos
      let persona = await obtenerPersonaNombre(
        usuario.nombre,
        usuario.primer_apellido,
        usuario.segundo_apellido,
        usuario.correo_electronico
      );

      if (persona) {
        await actualizarPersonaUsuario(persona.nid_persona, nid_usuario);
      } else {
        console.log("No se encontró la persona asociada al usuario.");
      }
    }
  } catch (error) {
    console.error("Error al asociar el usuario con la persona:", error);
    throw new Error("Error al asociar el usuario con la persona"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

function obtenerPersonaUsuario(nid_usuario) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.* FROM " +
      constantes.ESQUEMA +
      ".usuarios u, " +
      constantes.ESQUEMA +
      ".persona p WHERE u.nid_persona = p.nid_persona and u.nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener la persona del usuario:", error);
        return reject(error);
      }
      resolve(results[0]);
    });
  });
}

module.exports.registrarPersona = registrarPersona;
module.exports.obtenerPersonasSucias = obtenerPersonasSucias;
module.exports.limpiarPersona = limpiarPersona;
module.exports.asociarUsuarioPersona = asociarUsuarioPersona;
module.exports.obtenerPersonaUsuario = obtenerPersonaUsuario;
