const eslintPluginPrettier = require("eslint-plugin-prettier");
const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestorUsuario = require("./usuario.js");
const comun = require("./comun.js");

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
        reject(error);
      }
      resolve(results.length > 0);
    });
  });
}

//bSocio indica si se tienen que incluir los hijos que son socios, TRUE indica que si
function obtenerHijos(nid_persona, bSocio) {
  return new Promise((resolve, reject) => {
    let condicionSocio;
    if (!bSocio) {
      condicionSocio =
        " and not exists (select 1 from " +
        constantes.ESQUEMA +
        ".socios s " +
        "where s.nid_persona = p.nid_persona" +
        ")";
    }
    const sql =
      "select nid_persona " +
      "from " +
      constantes.ESQUEMA +
      ".persona p " +
      "where (nid_padre = " +
      conexion.dbConn.escape(nid_persona) +
      "   or nid_madre = " +
      conexion.dbConn.escape(nid_persona) +
      "   or nid_socio = " +
      conexion.dbConn.escape(nid_persona) +
      ")" +
      condicionSocio;

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("persona.js -> obtenerHijos: " + error);
        reject("Error al obtener los hijos");
      } else {
        resolve(results);
      }
    });
  });
}

function obtenerPadre(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT nid_padre FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener el padre de la persona:", error);
        reject(error);
      } else if (results.length === 0) {
        resolve(null);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function obtenerMadre(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT nid_madre FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener la madre de la persona:", error);
        reject(error);
      } else if (results.length === 0) {
        resolve(null);
      } else {
        resolve(results[0]);
      }
    });
  });
}

function obtenerSocioAsociado(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT nid_socio FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "Error al obtener el socio asociado de la persona:",
          error
        );
        reject(error);
      } else if (results.length === 0) {
        resolve(null);
      } else {
        resolve(results[0]);
      }
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
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " or fecha_actualizacion is null)";

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error(
          "Error al verificar si se requiere actualizar la persona:",
          error
        );
        reject(error);
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
  nid_socio,
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
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_nacimiento)) +
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
      ", nid_socio = " +
      conexion.dbConn.escape(nid_socio) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
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
  nid_padre,
  nid_socio,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO persona (nid_persona, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, nif, telefono, correo_electronico, nid_madre, nid_padre, nid_socio, fecha_actualizacion) VALUES (" +
      conexion.dbConn.escape(nid_persona) +
      ", " +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(primer_apellido) +
      ", " +
      conexion.dbConn.escape(segundo_apellido) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_nacimiento)) +
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
      ", " +
      conexion.dbConn.escape(nid_socio) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
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
  nid_socio,
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
          nid_socio,
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
        nid_padre,
        nid_socio,
        fecha_actualizacion
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
            reject(error);
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
        reject(error);
      }
      if (results.length === 0) {
        resolve(null); // No se encontró la persona
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
        reject(error);
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
        return null;
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
        reject(error);
      }
      resolve(results[0]);
    });
  });
}

function obtenerUsuarioPersona(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT u.* FROM " +
      constantes.ESQUEMA +
      ".usuarios u, " +
      constantes.ESQUEMA +
      ".persona p WHERE u.nid_persona = p.nid_persona " +
      " and p.nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener el usuario de la persona:", error);
        reject(error);
      }
      resolve(results[0]);
    });
  });
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
        reject(error);
      }
      if (results.length === 0) {
        resolve(null); // No se encontró la persona asociada al usuario
      } else {
        resolve(results[0]);
      }
    });
  });
}

function obtenerPersonas() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM " + constantes.ESQUEMA + ".persona";

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener las personas:", error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function obtenerPersona(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener la persona:", error);
        reject(error);
      }
      if (results.length === 0) {
        resolve(null); // No se encontró la persona
      } else {
        resolve(results[0]);
      }
    });
  });
}

function obtenerPersonasMusicos() {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.*, m.nid_tipo_musico, m.nid_instrumento FROM " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".musicos m WHERE p.nid_persona = m.nid_persona" +
      " and (m.fecha_baja is null or m.fecha_baja > NOW())";

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al obtener las personas músicos:", error);
        reject(error);
      }
      resolve(results);
    });
  });
}

function esHijo(nid_persona, nid_hijo) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE (nid_padre = " +
      conexion.dbConn.escape(nid_persona) +
      " OR nid_madre = " +
      conexion.dbConn.escape(nid_persona) +
      " OR nid_socio = " +
      conexion.dbConn.escape(nid_persona) +
      ") AND nid_persona = " +
      conexion.dbConn.escape(nid_hijo);

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.error("Error al verificar si es hijo:", error);
        reject(error);
      } else {
        resolve(results.length > 0);
      }
    });
  });
}

module.exports.registrarPersona = registrarPersona;
module.exports.obtenerPersonasSucias = obtenerPersonasSucias;
module.exports.limpiarPersona = limpiarPersona;
module.exports.asociarUsuarioPersona = asociarUsuarioPersona;
module.exports.obtenerHijos = obtenerHijos;
module.exports.obtenerPersonaUsuario = obtenerPersonaUsuario;
module.exports.obtenerUsuarioPersona = obtenerUsuarioPersona;
module.exports.obtenerPersonaUsuario = obtenerPersonaUsuario;
module.exports.obtenerPersonas = obtenerPersonas;
module.exports.obtenerPersona = obtenerPersona;
module.exports.obtenerPersonasMusicos = obtenerPersonasMusicos;

module.exports.obtenerPadre = obtenerPadre;
module.exports.obtenerMadre = obtenerMadre;
module.exports.obtenerSocioAsociado = obtenerSocioAsociado;

module.exports.esHijo = esHijo;
