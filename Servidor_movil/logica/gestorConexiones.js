const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function limpiarToken(token, nidUsuario) {
  try {
    const sql =
      "DELETE FROM " +
      constantes.ESQUEMA +
      ".conexiones WHERE token <> " +
      conexion.dbConn.escape(token) +
      " AND nid_usuario = " +
      conexion.dbConn.escape(nidUsuario);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al limpiar el token:", error);
    throw new Error("Error al limpiar el token: " + error.message);
  }
}

async function eliminarToken(token) {
  try {
    const sql =
      "DELETE FROM " +
      constantes.ESQUEMA +
      ".conexiones WHERE token = " +
      conexion.dbConn.escape(token);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al eliminar el token:", error);
    throw new Error("Error al eliminar el token: " + error.message);
  }
}

async function eliminarConexionesAntiguas(nid_usuario, ultima_conexion) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA +
      ".conexiones where nid_usuario = " +
      conexion.dbConn.escape(nid_usuario) +
      " and nid_conexion < " +
      conexion.dbConn.escape(ultima_conexion);

    const result = await gestor_base_datos.actualiza(sql);
    return result;
  } catch (error) {
    console.error("Error al eliminar las conexiones antiguas:", error);
    throw new Error(
      "Error al eliminar las conexiones antiguas: " + error.message,
    );
  }
}

async function actualizarTokenUsuario(token, nidUsuario) {
  try {
    const sql =
      "UPDATE " +
      constantes.ESQUEMA +
      ".conexiones set nid_usuario = " +
      conexion.dbConn.escape(nidUsuario) +
      " WHERE token = " +
      conexion.dbConn.escape(token);

    const result = await gestor_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.error("Error al actualizar el token del usuario:", error);
    throw new Error(
      "Error al actualizar el token del usuario: " + error.message,
    );
  }
}

async function obtener_ultima_observacion(nid_usuario) {
  try {
    const sql =
      "SELECT max(nid_conexion) as ultima_conexion FROM " +
      constantes.ESQUEMA +
      ".conexiones WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const result = await gestor_base_datos.consulta(sql);
    if (result.length > 0) {
      return result[0].ultima_conexion;
    } else {
      return null; // No se encontró la última conexión
    }
  } catch (error) {
    console.error("Error al obtener la última conexión del usuario:", error);
    throw new Error("Error al obtener la última conexión del usuario ");
  }
}

async function obtenerTokenUsuario(nidUsuario) {
  try {
    const sql =
      "SELECT token FROM " +
      constantes.ESQUEMA +
      ".conexiones WHERE nid_usuario = " +
      conexion.dbConn.escape(nidUsuario) +
      " and token is not null and fecha = (select max(fecha) from " +
      constantes.ESQUEMA +
      ".conexiones where nid_usuario = " +
      conexion.dbConn.escape(nidUsuario) +
      " and token is not null)";

    const result = await gestor_base_datos.consulta(sql);
    if (result.length > 0) {
      return result[0].token;
    } else {
      return null; // No se encontró el token
    }
  } catch (error) {
    console.error("Error al obtener el token del usuario:", error);
    throw new Error("Error al obtener el token del usuario");
  }
}

async function registrarConexion(token) {
  try {
    let bExsiste = await existeConexion(token);
    let numeroConexiones = await numConexiones();

    if (numeroConexiones > constantes.MAX_CONEXIONES) {
      console.error("Se ha alcanzado el número máximo de conexiones.");
      throw new Error("Se ha alcanzado el número máximo de conexiones.");
    } else {
      if (!bExsiste) {
        const sql =
          "INSERT INTO " +
          constantes.ESQUEMA +
          ".conexiones (token, fecha) " +
          "values (" +
          conexion.dbConn.escape(token) +
          ", now() )";
        const result = gestor_base_datos.actualiza(sql);
        return result;
      } else {
        const sql =
          "UPDATE " +
          constantes.ESQUEMA +
          ".conexiones SET fecha = now() WHERE token = " +
          conexion.dbConn.escape(token);
        const result = gestor_base_datos.actualiza(sql);
        return result;
      }
    }
  } catch (error) {
    console.error("Error al registrar la conexión:", error);
    throw new Error("Error al registrar la conexión");
  }
}

async function existeConexion(token) {
  try {
    const sql =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".conexiones WHERE token = " +
      conexion.dbConn.escape(token);
    const results = await gestor_base_datos.consulta(sql);

    return results.length > 0;
  } catch (error) {
    console.error("Error al verificar la conexión:", error);
    throw new Error("Error al verificar la conexión");
  }
}

async function numConexiones() {
  try {
    const sql =
      "SELECT COUNT(*) as numConexiones FROM " +
      constantes.ESQUEMA +
      ".conexiones";

    const results = await gestor_base_datos.consulta(sql);
    return results[0].numConexiones;
  } catch (error) {
    console.error("Error al contar las conexiones:", error);
    throw new Error("Error al contar las conexiones");
  }
}

async function obtenerConexiones() {
  try {
    const sql = "SELECT * FROM " + constantes.ESQUEMA + ".conexiones";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener las conexiones:", error);
    throw new Error("Error al obtener las conexiones");
  }
}

async function obtener_token_refresco(nid_usuario) {
  try {
    const sql =
      "select token_refresco from " +
      constantes.ESQUEMA +
      ".conexiones where nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length > 0) {
      return results[0].token_refresco;
    } else {
      return null; // No se encontró el token de refresco
    }
  } catch (error) {
    console.error("Error al obtener el token de refresco:", error);
    throw new Error("Error al obtener el token de refresco");
  }
}

async function insertar_token_refresco(token_refresco, nid_usuario) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".conexiones (token_refresco, nid_usuario) values (" +
      conexion.dbConn.escape(token_refresco) +
      ", " +
      conexion.dbConn.escape(nid_usuario) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al insertar el token de refresco:", error);
    throw new Error("Error al insertar el token de refresco");
  }
}

async function actualizar_token_refresco(token_refresco, nid_usuario) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".conexiones set token_refresco = " +
      conexion.dbConn.escape(token_refresco) +
      " where nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error al actualizar el token de refresco:", error);
    throw new Error("Error al actualizar el token de refresco");
  }
}

async function existe_usuario(nid_usuario) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".conexiones where nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error("Error al verificar el usuario:", error);
    throw new Error("Error al verificar el usuario");
  }
}

async function registrar_token_refresco(token_refresco, nid_usuario) {
  try {
    const bexiste_usuario = await existe_usuario(nid_usuario);
    if (bexiste_usuario) {
      await actualizar_token_refresco(token_refresco, nid_usuario);
      const ultima_conexion = await obtener_ultima_observacion(nid_usuario);
      await eliminarConexionesAntiguas(nid_usuario, ultima_conexion);
    } else {
      await insertar_token_refresco(token_refresco, nid_usuario);
    }
  } catch (error) {
    throw new Error(
      "Error al registrar el token de refresco: " + error.message,
    );
  }
}

async function existe_token_refresco(token_refresco) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".conexiones where token_refresco = " +
      conexion.dbConn.escape(token_refresco);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error("Error al verificar el token de refresco:", error);
    throw new Error("Error al verificar el token de refresco");
  }
}

module.exports.registrarConexion = registrarConexion;
module.exports.actualizarTokenUsuario = actualizarTokenUsuario;
module.exports.limpiarToken = limpiarToken;
module.exports.obtenerTokenUsuario = obtenerTokenUsuario;
module.exports.eliminarToken = eliminarToken;
module.exports.obtenerConexiones = obtenerConexiones;

module.exports.obtener_token_refresco = obtener_token_refresco;
module.exports.registrar_token_refresco = registrar_token_refresco;
module.exports.existe_token_refresco = existe_token_refresco;
module.exports.existe_usuario = existe_usuario;
