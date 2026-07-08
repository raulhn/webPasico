const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestorUsuario = require("./usuario.js");
const comun = require("./comun.js");
const gestor_base_datos = require("./base_datos.js");

async function existePersona(nid_persona) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error("Error al verificar la existencia de la persona:", error);
    throw new Error("Error al verificar la existencia de la persona");
  }
}

//bSocio indica si se tienen que incluir los hijos que son socios, TRUE indica que si
async function obtenerHijos(nid_persona, bSocio) {
  try {
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

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los hijos de la persona:", error);
    throw new Error("Error al obtener los hijos de la persona");
  }
}

async function obtenerPadre(nid_persona) {
  try {
    const sql =
      "SELECT nid_padre FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null;
    } else {
      return results[0]["nid_padre"];
    }
  } catch (error) {
    console.error("Error al obtener el padre de la persona:", error);
    throw new Error("Error al obtener el padre de la persona");
  }
}

async function obtenerMadre(nid_persona) {
  try {
    const sql =
      "SELECT nid_madre FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null;
    } else {
      return results[0]["nid_madre"];
    }
  } catch (error) {
    console.error("Error al obtener la madre de la persona:", error);
    throw new Error("Error al obtener la madre de la persona");
  }
}

async function obtenerSocioAsociado(nid_persona) {
  try {
    const sql =
      "SELECT nid_socio FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null;
    } else {
      return results[0]["nid_socio"];
    }
  } catch (error) {
    console.error("Error al obtener el socio asociado de la persona:", error);
    throw new Error("Error al obtener el socio asociado de la persona");
  }
}

async function requiereActualizarPersona(nid_persona, fecha_actualizacion) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " AND (fecha_actualizacion < " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " or fecha_actualizacion is null)";

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error(
      "Error al verificar si se requiere actualizar la persona:",
      error,
    );
    throw new Error("Error al verificar si se requiere actualizar la persona");
  }
}

async function actualizarPersona(
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
  fecha_actualizacion,
) {
  try {
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

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.error("Error al actualizar la persona:", error);
    throw new Error("Error al actualizar la persona");
  }
}

async function insertarPersona(
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
  fecha_actualizacion,
) {
  try {
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

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.error("Error al insertar la persona:", error);
    throw new Error("Error al insertar la persona");
  }
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
  fecha_actualizacion,
) {
  try {
    const existe = await existePersona(nid_persona);

    if (existe) {
      const requiereActualizar = await requiereActualizarPersona(
        nid_persona,
        fecha_actualizacion,
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
          fecha_actualizacion,
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
        fecha_actualizacion,
      );
      console.log("Persona insertada correctamente.");
    }
  } catch (error) {
    console.error("Error al registrar la persona:", error);
    throw new Error("Error al registrar la persona"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

async function obtenerPersonasSucias() {
  try {
    const consulta =
      "select * from " +
      constantes.ESQUEMA +
      ".persona p " +
      " where p.sucio = 'S'";

    const results = await gestor_base_datos.consulta(consulta);
    return results;
  } catch (error) {
    console.error("Error al obtener las personas sucias:", error);
    throw new Error("Error al obtener las personas sucias");
  }
}

async function limpiarPersona(nid_persona) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".persona set sucio = 'N' " +
      " where nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al limpiar la persona:", error);
    throw new Error("Error al limpiar la persona");
  }
}

async function obtenerUsuario(nid_usuario) {
  try {
    let existe = await gestorUsuario.existeUsuarioNid(nid_usuario);
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw new Error("Error al obtener el usuario"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

async function obtenerPersonaNombre(
  nombre,
  primer_apellido,
  segundo_apellido,
  correo_electronico,
) {
  try {
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

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null; // No se encontró la persona
    } else {
      return results[0];
    }
  } catch (error) {
    console.error("Error al obtener la persona por nombre:", error);
    throw new Error("Error al obtener la persona por nombre"); // Propagar el error para manejarlo en otro lugar si es necesario}
  }
}

async function obtenerPersonaApellido(
  primer_apellido,
  segundo_apellido,
  correo_electronico,
) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE primer_apellido = " +
      conexion.dbConn.escape(primer_apellido) +
      " AND segundo_apellido = " +
      conexion.dbConn.escape(segundo_apellido) +
      " AND correo_electronico = " +
      conexion.dbConn.escape(correo_electronico);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null; // No se encontró la persona
    } else if (results.length > 1) {
      // Se ha encontrado más de una persona
      return null;
    } else {
      return results[0];
    }
  } catch (error) {
    console.error("Error al obtener la persona por apellido:", error);
    throw new Error("Error al obtener la persona por apellido"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

async function actualizarPersonaUsuario(nid_persona, nid_usuario) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".usuarios SET nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario) +
      " and verificado = 'S'";

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al actualizar la persona del usuario:", error);
    throw new Error("Error al actualizar la persona del usuario"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
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
        usuario.correo_electronico,
      );

      if (persona) {
        await actualizarPersonaUsuario(persona.nid_persona, nid_usuario);
      } else {
        persona = await obtenerPersonaApellido(
          usuario.primer_apellido,
          usuario.segundo_apellido,
          usuario.correo_electronico,
        );
        // No se encuentra por nombre, se buscar solo por apellidos y correo
        if (persona) {
          await actualizarPersonaUsuario(persona.nid_persona, nid_usuario);
        } else {
          return null;
        }
      }
    }
  } catch (error) {
    console.error("Error al asociar el usuario con la persona:", error);
    throw new Error("Error al asociar el usuario con la persona"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

async function obtenerPersonaUsuario(nid_usuario) {
  try {
    const sql =
      "SELECT p.* FROM " +
      constantes.ESQUEMA +
      ".usuarios u, " +
      constantes.ESQUEMA +
      ".persona p WHERE u.nid_persona = p.nid_persona and u.nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null; // No se encontró la persona asociada al usuario
    } else {
      return results[0];
    }
  } catch (error) {
    console.error("Error al obtener la persona del usuario:", error);
    throw new Error("Error al obtener la persona del usuario"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

async function obtenerUsuarioPersona(nid_persona) {
  try {
    const sql =
      "SELECT u.* FROM " +
      constantes.ESQUEMA +
      ".usuarios u, " +
      constantes.ESQUEMA +
      ".persona p WHERE u.nid_persona = p.nid_persona " +
      " and p.nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null; // No se encontró el usuario asociado a la persona
    } else {
      return results[0];
    }
  } catch (error) {
    console.error("Error al obtener el usuario de la persona:", error);
    throw new Error("Error al obtener el usuario de la persona"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

async function obtenerPersonaUsuario(nid_usuario) {
  try {
    const sql =
      "SELECT p.* FROM " +
      constantes.ESQUEMA +
      ".usuarios u, " +
      constantes.ESQUEMA +
      ".persona p WHERE u.nid_persona = p.nid_persona and u.nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null; // No se encontró la persona asociada al usuario
    } else {
      return results[0];
    }
  } catch (error) {
    console.error("Error al obtener la persona del usuario:", error);
    throw new Error("Error al obtener la persona del usuario"); // Propagar el error para manejarlo en otro lugar si es necesario
  }
}

async function obtenerPersonas() {
  try {
    const sql = "SELECT * FROM " + constantes.ESQUEMA + ".persona";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener las personas:", error);
    throw new Error("Error al obtener las personas");
  }
}

async function obtenerPersona(nid_persona) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".persona WHERE nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      return null; // No se encontró la persona
    } else {
      return results[0];
    }
  } catch (error) {
    console.error("Error al obtener la persona:", error);
    throw new Error("Error al obtener la persona");
  }
}

async function obtenerPersonasMusicos() {
  try {
    const sql =
      "SELECT p.*, m.nid_tipo_musico, m.nid_instrumento FROM " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".musicos m WHERE p.nid_persona = m.nid_persona" +
      " and (m.fecha_baja is null or m.fecha_baja > NOW())";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener las personas músicos:", error);
    throw new Error("Error al obtener las personas músicos");
  }
}

async function obtenerPersonasSocios() {
  try {
    const sql =
      "SELECT p.* FROM " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".socios s WHERE p.nid_persona = s.nid_persona" +
      " and (s.fecha_baja is null or s.fecha_baja > NOW())";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener las personas socios:", error);
    throw new Error("Error al obtener las personas socios");
  }
}

async function obtenerPersonasSociosActivos(activo) {
  try {
    let sql =
      "Select p.* from " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".socios s " +
      " where p.nid_persona = s.nid_persona ";

    if (activo == 1) {
      sql = sql + " and (s.fecha_baja is null or s.fecha_baja > NOW())";
    } else if (activo == 2) {
      sql = sql + " and s.fecha_baja is not null and s.fecha_baja <= NOW()";
    }

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener las personas socios activos:", error);
    throw new Error("Error al obtener las personas socios activos");
  }
}

async function obtenerPersonasAlumnosAsignatura(
  nid_curso,
  nid_asignatura,
  activo,
) {
  try {
    let sql =
      "select p.* from " +
      constantes.ESQUEMA +
      ".persona p, " +
      constantes.ESQUEMA +
      ".matricula m, " +
      constantes.ESQUEMA +
      ".matricula_asignatura ma " +
      " where p.nid_persona = m.nid_persona " +
      "   and m.nid_matricula = ma.nid_matricula " +
      "   and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      "   and ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    if (activo == 1) {
      sql = sql + " and (ma.fecha_baja is null or ma.fecha_baja > NOW())";
    } else if (activo == 2) {
      sql = sql + " and ma.fecha_baja is not null and ma.fecha_baja <= NOW()";
    }

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error(
      "Error al obtener las personas alumnos de la asignatura:",
      error,
    );
    throw new Error("Error al obtener las personas alumnos de la asignatura");
  }
}

async function esHijo(nid_persona, nid_hijo) {
  try {
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

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error("Error al verificar si es hijo:", error);
    throw new Error("Error al verificar si es hijo");
  }
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
module.exports.obtenerPersonasSocios = obtenerPersonasSocios;
module.exports.obtenerPersonasSociosActivos = obtenerPersonasSociosActivos;
module.exports.obtenerPersonasAlumnosAsignatura =
  obtenerPersonasAlumnosAsignatura;

module.exports.obtenerPadre = obtenerPadre;
module.exports.obtenerMadre = obtenerMadre;
module.exports.obtenerSocioAsociado = obtenerSocioAsociado;

module.exports.esHijo = esHijo;
