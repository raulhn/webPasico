const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_interfaz_socio = require("./interfaz_socio.js");
const gestor_base_datos = require("./base_datos.js");
const fechas = require("./fechas.js");

async function obtener_persona_nif(nif, lote) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona where dni = " +
      conexion.dbConn.escape(nif) +
      " and lote = " +
      conexion.dbConn.escape(lote) +
      " and dni <> ''";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("interfaz_persona -> obtener_persona_nif_insert", error);
    throw new Error("Error al recuperar la persona por nif");
  }
}

async function obtener_persona_nombre(
  nombre,
  primer_apellido,
  segundo_apellido,
  lote,
) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona where nombre = " +
      conexion.dbConn.escape(nombre) +
      " and primer_apellido = " +
      conexion.dbConn.escape(primer_apellido) +
      " and segundo_apellido = " +
      conexion.dbConn.escape(segundo_apellido) +
      "and operacion = " +
      conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
      " and lote = " +
      conexion.dbConn.escape(lote);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("interfaz_persona -> obtener_persona_nombre_insert", error);
    throw new Error("Error al recuperar la persona por nombre");
  }
}

async function obtener_persona_apellidos(
  primer_apellido,
  segundo_apellido,
  lote,
) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona where primer_apellido = " +
      conexion.dbConn.escape(primer_apellido) +
      " and segundo_apellido = " +
      conexion.dbConn.escape(segundo_apellido) +
      "and operacion = " +
      conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
      " and lote = " +
      conexion.dbConn.escape(lote);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("interfaz_persona -> obtener_persona_apellidos_insert", error);
    throw new Error("Error al recuperar la persona por apellidos");
  }
}

async function obtener_conflictos_personas(nid_interfaz_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_conflictos_persona where nid_interfaz_persona = " +
      conexion.dbConn.escape(nid_interfaz_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("interfaz_persona -> obtener_conflictos_personas", error);
    throw new Error("Error al recuperar los conflictos de personas");
  }
}

async function obtener_interfaz_personas(lote) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona where lote = " +
      conexion.dbConn.escape(lote);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("interfaz_persona -> obtener_interfaz_personas", error);
    throw new Error("Error al recuperar las personas del lote");
  }
}

async function obtener_interfaz_personas_pendiente(lote) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona where lote = " +
      conexion.dbConn.escape(lote) +
      " and estado = " +
      conexion.dbConn.escape(constantes.ESTADOS_INTERFAZ.PENDIENTE);

    const resuls = await gestor_base_datos.consulta(sql);
    return resuls;
  } catch (error) {
    console.log(
      "interfaz_persona -> obtener_interfaz_personas_pendiente",
      error,
    );
    throw new Error("Error al recuperar las personas pendientes del lote");
  }
}

async function actualizar_interfaz_persona(interfaz_persona) {
  try {
    console.log("interfaz persona a actualizar", interfaz_persona);
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona set dni = " +
      conexion.dbConn.escape(interfaz_persona.dni) +
      ", nombre = " +
      conexion.dbConn.escape(interfaz_persona.nombre) +
      ", primer_apellido = " +
      conexion.dbConn.escape(interfaz_persona.primer_apellido) +
      ", segundo_apellido = " +
      conexion.dbConn.escape(interfaz_persona.segundo_apellido) +
      ", fecha_nacimiento = str_to_date(substr(nullif(" +
      conexion.dbConn.escape(
        fechas.formatearFechaGuion(interfaz_persona.fecha_nacimiento),
      ) +
      " , ''), 1, 10), '%Y-%m-%d')" +
      ", operacion = " +
      conexion.dbConn.escape(interfaz_persona.operacion) +
      ", lote = " +
      conexion.dbConn.escape(interfaz_persona.lote) +
      ", nid_persona = ifnull(nid_persona, " +
      conexion.dbConn.escape(interfaz_persona.nid_persona) +
      ")" +
      ", estado = " +
      conexion.dbConn.escape(interfaz_persona.estado) +
      ", nid_interfaz_socio = " +
      conexion.dbConn.escape(interfaz_persona.nid_interfaz_socio) +
      ", nid_interfaz_madre = " +
      conexion.dbConn.escape(interfaz_persona.nid_interfaz_madre) +
      ", nid_interfaz_padre = " +
      conexion.dbConn.escape(interfaz_persona.nid_interfaz_padre) +
      " where nid_interfaz_persona = " +
      conexion.dbConn.escape(interfaz_persona.nid_interfaz_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar la interfaz persona: " + error);
    throw new Error("Error al actualizar la interfaz persona");
  }
}

async function actualizar_operacion_conflicto(
  nid_interfaz_persona,
  operacion,
  nid_persona,
) {
  try {
    let sql;
    if (
      nid_persona === null ||
      nid_persona === undefined ||
      nid_persona === ""
    ) {
      sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".interfaz_persona set operacion = " +
        conexion.dbConn.escape(operacion) +
        " where nid_interfaz_persona = " +
        conexion.dbConn.escape(nid_interfaz_persona);
    } else {
      sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".interfaz_persona set operacion = " +
        conexion.dbConn.escape(operacion) +
        ", nid_persona = ifnull(nid_persona, " +
        conexion.dbConn.escape(nid_persona) +
        ")" +
        " where nid_interfaz_persona = " +
        conexion.dbConn.escape(nid_interfaz_persona);
    }

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar la operación del conflicto: " + error);
    throw new Error("Error al actualizar la operación del conflicto");
  }
}

//  Función para obtener el socio nuevo asociado a una interfaz_persona, en caso de que exista un conflicto de actualización
async function obtener_socio_nuevo(nid_interfaz_persona) {
  try {
    const interfaz_persona =
      await obtener_interfaz_persona(nid_interfaz_persona);
    console.log("interfaz_persona -> obtener_socio_nuevo:", interfaz_persona);
    if (!interfaz_persona.nid_interfaz_socio) {
      return null;
    }
    const interfaz_socio =
      await gestor_interfaz_socio.obtener_interfaz_socio_nid(
        interfaz_persona.nid_interfaz_socio,
      );
    console.log("interfaz_persona -> obtener_socio_nuevo:", interfaz_socio);
    if (interfaz_socio) {
      const nid_interfaz_persona_socio = interfaz_socio.nid_interfaz_persona;
      const interfaz_persona_socio = await obtener_interfaz_persona(
        nid_interfaz_persona_socio,
      );
      return interfaz_persona_socio.nid_persona;
    }
    return null;
  } catch (error) {
    throw new Error("Error al obtener el conflicto de socio");
  }
}

async function actualizar_conflicto_persona(conflicto_persona) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".interfaz_conflictos_persona set nid_persona = " +
      conexion.dbConn.escape(conflicto_persona.nid_persona) +
      ", nid_socio = ifnull(" +
      conexion.dbConn.escape(conflicto_persona.nid_socio) +
      ", nid_socio)" +
      " where nid_conflicto = " +
      conexion.dbConn.escape(conflicto_persona.nid_conflicto);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar el conflicto de persona: " + error);
    throw new Error("Error al actualizar el conflicto de persona");
  }
}

async function obtener_conflicto_actualizacion(nid_interfaz_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_conflictos_persona where nid_interfaz_persona = " +
      conexion.dbConn.escape(nid_interfaz_persona) +
      " and nid_persona is not null";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("interfaz_persona -> obtener_conflicto_actualizacion", error);
    throw new Error("Error al recuperar el conflicto de actualización");
  }
}

async function actualizar_estado(nid_interfaz_persona, estado) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona set estado = " +
      conexion.dbConn.escape(estado) +
      " where nid_interfaz_persona = " +
      conexion.dbConn.escape(nid_interfaz_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log(
      "Error al actualizar el estado de la interfaz persona: " + error,
    );
    throw new Error("Error al actualizar el estado de la interfaz persona");
  }
}

async function obtener_interfaz_persona(nid_interfaz_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".interfaz_persona where nid_interfaz_persona = " +
      conexion.dbConn.escape(nid_interfaz_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log("interfaz_persona -> obtener_interfaz_persona: ", error);
    throw new Error(
      "Se ha producido un error al recuperar la interfaz Persona con nid",
    );
  }
}

module.exports.obtener_persona_nif = obtener_persona_nif;
module.exports.obtener_persona_nombre = obtener_persona_nombre;
module.exports.obtener_persona_apellidos = obtener_persona_apellidos;
module.exports.obtener_conflictos_personas = obtener_conflictos_personas;
module.exports.obtener_interfaz_personas = obtener_interfaz_personas;
module.exports.actualizar_operacion_conflicto = actualizar_operacion_conflicto;
module.exports.actualizar_estado = actualizar_estado;
module.exports.obtener_interfaz_personas_pendiente =
  obtener_interfaz_personas_pendiente;
module.exports.obtener_interfaz_persona = obtener_interfaz_persona;
module.exports.obtener_conflicto_actualizacion =
  obtener_conflicto_actualizacion;
module.exports.actualizar_conflicto_persona = actualizar_conflicto_persona;
module.exports.obtener_socio_nuevo = obtener_socio_nuevo;
module.exports.actualizar_interfaz_persona = actualizar_interfaz_persona;
