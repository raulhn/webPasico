const constantes = require("../constantes");
const conexion = require("../conexion");
const comun = require("./comun");
const gestorPersonas = require("./persona");
const gestor_base_datos = require("./base_datos.js");

async function existeMusico(nid_persona, nid_tipo_musico, nid_instrumento) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".musicos where nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico) +
      " and nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error("Error al comprobar si existe el músico: ", error);
    throw new Error("Error al comprobar si existe el músico");
  }
}

async function insertarMusico(
  nid_persona,
  fecha_alta,
  fecha_baja,
  nid_tipo_musico,
  nid_instrumento,
  fecha_actualizacion,
) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".musicos (nid_persona, fecha_alta, fecha_baja, nid_tipo_musico, nid_instrumento, fecha_actualizacion)" +
      " values (" +
      conexion.dbConn.escape(nid_persona) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_alta)) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_baja)) +
      ", " +
      conexion.dbConn.escape(nid_tipo_musico) +
      ", " +
      conexion.dbConn.escape(nid_instrumento) +
      ", " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.error("Error al insertar el músico: ", error);
    throw new Error("Error al insertar el músico");
  }
}

async function actualizarMusico(
  nid_persona,
  fecha_alta,
  fecha_baja,
  nid_tipo_musico,
  nid_instrumento,
  fecha_actualizacion,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".musicos set fecha_alta = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_alta)) +
      ", fecha_baja = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_baja)) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(comun.formatDateToMySQL(fecha_actualizacion)) +
      " where nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico) +
      " and nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el músico: ", error);
    throw new Error("Error al actualizar el músico");
  }
}

async function registrarMusico(
  nid_persona,
  fecha_alta,
  fecha_baja,
  nid_tipo_musico,
  nid_instrumento,
  fecha_actualizacion,
) {
  try {
    let bExiste = await existeMusico(
      nid_persona,
      nid_tipo_musico,
      nid_instrumento,
    );

    if (bExiste) {
      await actualizarMusico(
        nid_persona,
        fecha_alta,
        fecha_baja,
        nid_tipo_musico,
        nid_instrumento,
        fecha_actualizacion,
      );
    } else {
      await insertarMusico(
        nid_persona,
        fecha_alta,
        fecha_baja,
        nid_tipo_musico,
        nid_instrumento,
        fecha_actualizacion,
      );
    }
  } catch (error) {
    console.error("Error al comprobar si existe el músico: ", error);
    throw new Error("Error al comprobar si existe el músico");
  }
}

async function esMusico(nid_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".musicos where nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (error) {
    console.error("Error al comprobar si es músico: ", error);
    throw new Error("Error al comprobar si es músico");
  }
}

// El parametro bSocio indica si se quiere no tener en cuenta los hijos que ya son socios,
// y por tanto se consideran idependiente, TRUE en caso de que se quieran incluir los hijos socios
async function esPadreMusico(nid_persona, bSocio = true) {
  try {
    let hijos = await gestorPersonas.obtenerHijos(nid_persona, bSocio);
    for (let i = 0; i < hijos.length; i++) {
      const bEsMusico = await esMusico(hijos[i].nid_persona);

      if (bEsMusico) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log("musicos.js -> esPadreMusico: ", e);
    throw new Error(e);
  }
}

async function obtenerPersonasTipoMusico(tipos_musico) {
  try {
    const sql =
      "select nid_persona from " +
      constantes.ESQUEMA +
      ".musicos where nid_tipo_musico in (" +
      tipos_musico.map((tipo) => conexion.dbConn.escape(tipo)).join(",") +
      ")" +
      " group by nid_persona";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener el tipo de músico: ", error);
    throw new Error("Error al obtener el tipo de músico");
  }
}

async function obtenerInstrumentos(nid_persona) {
  try {
    const sql =
      "select i.nid_instrumento, i.descripcion from " +
      constantes.ESQUEMA +
      ".musicos m, " +
      constantes.ESQUEMA +
      ".instrumentos i where m.nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and m.nid_instrumento = i.nid_instrumento" +
      " group by i.nid_instrumento, i.descripcion";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error al obtener los instrumentos del músico: ", error);
    throw new Error("Error al obtener los instrumentos del músico");
  }
}

module.exports.registrarMusico = registrarMusico;
module.exports.esMusico = esMusico;
module.exports.esPadreMusico = esPadreMusico;
module.exports.obtenerPersonasTipoMusico = obtenerPersonasTipoMusico;
module.exports.obtenerInstrumentos = obtenerInstrumentos;
