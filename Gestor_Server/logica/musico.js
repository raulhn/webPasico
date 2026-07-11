const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const persona = require("./persona.js");
const serviceMusicos = require("../services/serviceMusicos.js");
const gestor_base_datos = require("./base_datos.js");

async function existe_instrumento(nid_instrumento) {
  try {
    const sql =
      "select count(*) cont from " +
      constantes.ESQUEMA_BD +
      ".instrumentos where nid = " +
      conexion.dbConn.escape(nid_instrumento);
    const result = await gestor_base_datos.consulta(sql);
    return result[0]["cont"] > 0;
  } catch (error) {
    console.error("Error al verificar la existencia del instrumento:", error);
    return false;
  }
}

async function obtener_instrumentos() {
  try {
    const sql =
      "select i.nid, i.descripcion from " +
        constantes.ESQUEMA_BD +
        ".instrumentos i";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener instrumentos:", error);
    throw new Error("Error al obtener instrumentos");
  }
}

async function obtener_instrumentos_filtro() {
  try {
    const sql =
      "select i.nid, i.descripcion from " +
        constantes.ESQUEMA_BD +
        ".instrumentos i union select 0, 'Todos' from dual";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener instrumentos filtro:", error);
    throw new Error("Error al obtener instrumentos filtro");
  }
}

async function obtener_instrumentos_sucios() {
  try {
    const sql =
      "select i.nid, i.descripcion from " +
        constantes.ESQUEMA_BD +
        ".instrumentos i where i.sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener instrumentos sucios:", error);
    throw new Error("Error al obtener instrumentos sucios");
  }
}

async function actualizar_instrumento_sucio(nid_instrumento, sucio) {
  try {
    const sql =
      "update " +
        constantes.ESQUEMA_BD +
        ".instrumentos set sucio = " +
        conexion.dbConn.escape(sucio) +
        " where nid = " +
        conexion.dbConn.escape(nid_instrumento);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al actualizar el instrumento sucio:", error);
    throw new Error("Error al actualizar el instrumento sucio");
  }
}

async function registrar_instrumento(instrumento) {
  try {
    const sql =
      "insert into " +
        constantes.ESQUEMA_BD +
        ".instrumentos(descripcion) values(" +
        conexion.dbConn.escape(instrumento) +
        ")";
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al registrar el instrumento:", error);
    throw new Error("Error al registrar el instrumento");
  }
}

async function actualizar_instrumento(nid_instrumento, descripcion) {
  try {
    const sql =
      "update " +
        constantes.ESQUEMA_BD +
        ".instrumentos set descripcion = " +
        conexion.dbConn.escape(descripcion) +
        ", sucio = 'S'" +
        " where nid = " +
        conexion.dbConn.escape(nid_instrumento);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al actualizar el instrumento:", error);
    throw new Error("Error al actualizar el instrumento");
  }
}

async function obtener_musicos() {
  try {
    const sql =
      "select p.nid, p.nif, p.nombre, p.primer_apellido, p.segundo_apellido, p.telefono, p.correo_electronico, " +
        " m.fecha_alta, m.nid_tipo_musico, m.fecha_baja, m.fecha_alta, m.nid_instrumento, m.fecha_actualizacion, " +
        " t.descripcion as tipo_musico, i.descripcion as instrumento" +
        " from " +
        constantes.ESQUEMA_BD +
        ".musico m, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".instrumentos i, " +
        constantes.ESQUEMA_BD +
        ".tipo_musico t " +
        " where p.nid = m.nid_persona " +
        " and m.nid_instrumento = i.nid " +
        " and m.nid_tipo_musico = t.nid_tipo_musico" +
        " group by p.nombre, p.primer_apellido, p.segundo_apellido, p.telefono, p.correo_electronico, t.nid_tipo_musico, m.nid_instrumento";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener músicos:", error);
    throw new Error("Error al obtener músicos");
  }
}

async function insertar_musico(nid_persona, nid_instrumento, nid_tipo_musico) {
  try {
    const sql =
      "insert into " +
        constantes.ESQUEMA_BD +
        ".musico(nid_persona, nid_instrumento, fecha_alta, nid_tipo_musico) values(" +
        conexion.dbConn.escape(nid_persona) +
        ", " +
        conexion.dbConn.escape(nid_instrumento) +
        ", sysdate(), " +
        conexion.dbConn.escape(nid_tipo_musico) +
        ")";
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al registrar al músico:", error);
    throw new Error("Error al registrar al músico");
  }
}

async function registrar_instrumento_persona(
  nid_persona,
  nid_instrumento,
  nid_tipo_musico
) {
  try {
    let bExistePersona = await persona.existe_nid(nid_persona);
    let bExisteInstrumento = await existe_instrumento(nid_instrumento);

    if (bExistePersona && bExisteInstrumento) {
      await insertar_musico(nid_persona, nid_instrumento, nid_tipo_musico);
      await actualizar_sucio(nid_persona, "S");
    } else {
      throw new Error("Error al registrar al músico");
    }
  } catch (error) {
    console.error("Error en registrar_instrumento_persona:", error);
    throw new Error("Error al registrar al músico");
  }
}

async function obtener_instrumentos_persona(nid_persona) {
  try {
    const bExistePersona = await persona.existe_nid(nid_persona);
    if (bExistePersona) {
      const sql =
        "select i.* from " +
          constantes.ESQUEMA_BD +
          ".musico m, " +
          constantes.ESQUEMA_BD +
          ".instrumentos i where m.nid_persona = " +
          conexion.dbConn.escape(nid_persona) +
          " and m.nid_instrumento = i.nid";
      const results = await gestor_base_datos.consulta(sql);
      return results;
    } else {
      throw new Error("Error al obtener la información");
    }
  } catch (error) {
    console.error("Error en obtener_instrumentos_persona:", error);
    throw new Error("Error al obtener la información");
  }
}

async function eliminar_instrumento_persona(nid_persona, nid_instrumento) {
  try {
    const sql =
      "delete from " +
        constantes.ESQUEMA_BD +
        ".musico where nid_persona " +
        conexion.dbConn.escape(nid_persona) +
        " and nid_instrumento = " +
        conexion.dbConn.escape(nid_instrumento);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al eliminar instrumento de persona:", error);
    throw new Error("Error al eliminar instrumento de persona");
  }
}

async function obtener_personas_instrumento(nid_instrumento) {
  try {
    if (await existe_instrumento(nid_instrumento)) {
      const sql =
        "select p.*, " +
          " m.fecha_alta, m.nid_tipo_musico, m.fecha_baja, m.fecha_alta, m.nid_instrumento, m.fecha_actualizacion" +
          " from " +
          constantes.ESQUEMA_BD +
          ".persona p, " +
          constantes.ESQUEMA_BD +
          ".musico m where m.nid_persona = p.nid and " +
          "m.nid_instrumento = " +
          conexion.dbConn.escape(nid_instrumento);
      const results = await gestor_base_datos.consulta(sql);
      return results;
    } else {
      throw new Error("No existe instrumento");
    }
  } catch (error) {
    console.error("Error en obtener_personas_instrumento:", error);
    throw new Error(error.message);
  }
}

async function obtener_tipo_musicos() {
  try {
    const sql =
      "select * from " + constantes.ESQUEMA_BD + ".tipo_musico";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener tipos de músicos:", error);
    throw new Error("Error al obtener tipos de músicos");
  }
}

async function registrar_tipo_musico(descripcion) {
  try {
    const sql =
      "insert into " +
        constantes.ESQUEMA_BD +
        ".tipo_musico(descripcion) values(" +
        conexion.dbConn.escape(descripcion) +
        ")";
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al registrar el tipo de músico:", error);
    throw new Error("Error al registrar el tipo de músico");
  }
}

async function actualizar_tipo_musico(nid_tipo_musico, descripcion) {
  try {
    const sql =
      "update " +
        constantes.ESQUEMA_BD +
        ".tipo_musico set descripcion = " +
        conexion.dbConn.escape(descripcion) +
        ", sucio = 'S'" +
        " where nid_tipo_musico = " +
        conexion.dbConn.escape(nid_tipo_musico);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al actualizar el tipo de músico:", error);
    throw new Error("Error al actualizar el tipo de músico");
  }
}

async function actualizar_tipo_musico_sucio(nid_tipo_musico, sucio) {
  try {
    const sql =
      "update " +
        constantes.ESQUEMA_BD +
        ".tipo_musico set sucio = " +
        conexion.dbConn.escape(sucio) +
        " where nid_tipo_musico = " +
        conexion.dbConn.escape(nid_tipo_musico);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al actualizar el tipo de músico sucio:", error);
    throw new Error("Error al actualizar el tipo de músico sucio");
  }
}

async function obtener_tipos_musico_sucios() {
  try {
    const sql =
      "select * from " +
        constantes.ESQUEMA_BD +
        ".tipo_musico where sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener tipos de músicos sucios:", error);
    throw new Error("Error al obtener tipos de músicos sucios");
  }
}

async function obtener_musico(nid_persona) {
  try {
    const sql =
      "select  m.nid_persona, m.nid_instrumento, m.fecha_alta, m.nid_tipo_musico, m.fecha_baja, m.fecha_actualizacion from " +
        constantes.ESQUEMA_BD +
        ".musico m where m.nid_persona = " +
        conexion.dbConn.escape(nid_persona);
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener músico:", error);
    throw new Error("Error al obtener músico");
  }
}

async function baja_musico(
  nid_persona,
  nid_instrumento,
  nid_tipo_musico,
  fecha_baja
) {
  try {
    const sql =
      "update " +
        constantes.ESQUEMA_BD +
        ".musico set fecha_baja = nullif(" +
        conexion.dbConn.escape(fecha_baja) +
        ", ''), fecha_actualizacion = sysdate() " +
        " where nid_persona = " +
        conexion.dbConn.escape(nid_persona) +
        " and nid_instrumento = " +
        conexion.dbConn.escape(nid_instrumento) +
        " and nid_tipo_musico = " +
        conexion.dbConn.escape(nid_tipo_musico);
    await gestor_base_datos.actualiza(sql);

    console.log(
      "update " +
        constantes.ESQUEMA_BD +
        ".musico set fecha_baja = " +
        conexion.dbConn.escape(fecha_baja) +
        ", nid_tipo_musico = " +
        conexion.dbConn.escape(nid_tipo_musico) +
        " where nid_persona = " +
        conexion.dbConn.escape(nid_persona) +
        " and nid_instrumento = " +
        conexion.dbConn.escape(nid_instrumento)
    );
    console.log("Se ha dado de baja al músico");
  } catch (error) {
    console.error("Error al dar de baja al músico:", error);
    throw new Error("Error al dar de baja al músico");
  }
}

async function actualizar_sucio(nid_persona, sucio) {
  try {
    const sql =
      "update " +
        constantes.ESQUEMA_BD +
        ".musico set sucio = " +
        conexion.dbConn.escape(sucio) +
        " where nid_persona = " +
        conexion.dbConn.escape(nid_persona);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.error("Error al actualizar el campo sucio del músico:", error);
    throw new Error("Error al actualizar el campo sucio del músico");
  }
}

async function obtener_sucios() {
  try {
    const sql =
      "select m.* from " +
        constantes.ESQUEMA_BD +
        ".musico m where m.sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener músicos sucios:", error);
    throw new Error("Error al obtener músicos sucios");
  }
}

module.exports.obtener_instrumentos_filtro = obtener_instrumentos_filtro;
module.exports.obtener_instrumentos = obtener_instrumentos;

module.exports.registrar_instrumento = registrar_instrumento;
module.exports.actualizar_instrumento = actualizar_instrumento;

module.exports.obtener_musicos = obtener_musicos;

module.exports.registrar_instrumento_persona = registrar_instrumento_persona;
module.exports.obtener_instrumentos_persona = obtener_instrumentos_persona;
module.exports.eliminar_instrumento_persona = eliminar_instrumento_persona;
module.exports.obtener_personas_instrumento = obtener_personas_instrumento;
module.exports.obtener_instrumentos_sucios = obtener_instrumentos_sucios;
module.exports.actualizar_instrumento_sucio = actualizar_instrumento_sucio;

module.exports.obtener_tipo_musicos = obtener_tipo_musicos;
module.exports.obtener_tipos_musico_sucios = obtener_tipos_musico_sucios;
module.exports.actualizar_tipo_musico_sucio = actualizar_tipo_musico_sucio;
module.exports.obtener_musico = obtener_musico;
module.exports.baja_musico = baja_musico;
module.exports.actualizar_sucio = actualizar_sucio;

module.exports.obtener_sucios = obtener_sucios;

module.exports.registrar_tipo_musico = registrar_tipo_musico;
module.exports.actualizar_tipo_musico = actualizar_tipo_musico;