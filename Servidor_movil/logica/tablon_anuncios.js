const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("./base_datos.js");

async function insertarTablonAnuncio(titulo, descripcion, nidTipoTablon) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".tablon_anuncios(titulo, descripcion, nid_tipo_tablon) " +
      "values(" +
      conexion.dbConn.escape(titulo) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(nidTipoTablon) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("tablon_anuncios.js -> insertarTablonAnuncio: ", error);
    throw new Error("Error al insertar el tablón de anuncios");
  }
}

async function actualizarTablonAnuncio(
  nidTablonAnuncio,
  titulo,
  descripcion,
  nidTipoTablon,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".tablon_anuncios " +
      "set titulo = " +
      conexion.dbConn.escape(titulo) +
      ", descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", nid_tipo_tablon = " +
      conexion.dbConn.escape(nidTipoTablon) +
      " where nid_tablon_anuncio = " +
      conexion.dbConn.escape(nidTablonAnuncio);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("tablon_anuncios.js -> actualizarTablonAnuncio: ", error);
    throw new Error("Error al actualizar el tablón de anuncios");
  }
}

async function eliminarTablonAnuncio(nidTablonAnuncio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".tablon_anuncios " +
      "set borrado = 'S' " +
      "where nid_tablon_anuncio = " +
      conexion.dbConn.escape(nidTablonAnuncio);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log("tablon_anuncios.js -> eliminarTablonAnuncio: ", error);
    throw new Error("Error al eliminar el tablón de anuncios");
  }
}

async function obtenerTodosTablonesAnuncio() {
  try {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta, " +
      constantes.ESQUEMA +
      ".tipo_tablon tt " +
      "where ta.nid_tipo_tablon = tt.nid_tipo_tablon and " +
      "  ta.borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTodosTablonesAnuncio: ", error);
    throw new Error("Se ha producido un error al recuperar los tablones");
  }
}

async function obtenerTablonesAnuncio(tipo) {
  try {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta, " +
      constantes.ESQUEMA +
      ".tipo_tablon tt " +
      "where ta.nid_tipo_tablon = tt.nid_tipo_tablon and " +
      "tt.nid_tipo_tablon = " +
      conexion.dbConn.escape(tipo) +
      " and ta.borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTablonesAnuncio: ", error);
    throw new Error("Se ha producido un error al recuperar los tablones");
  }
}

async function obtenerTablonesAnuncioGeneral() {
  try {
    const anuncios = await obtenerTablonesAnuncio(constantes.GENERAL);
    return anuncios;
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTablonesAnuncioGeneral: ", error);
    throw new Error(
      "Se ha producido un error al recuperar los tablones generales",
    );
  }
}

async function obtenerTablonesAnuncioBanda() {
  try {
    const anuncios = await obtenerTablonesAnuncio(constantes.BANDA);
    return anuncios;
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTablonesAnuncioBanda: ", error);
    throw new Error(
      "Se ha producido un error al recuperar los tablones de banda",
    );
  }
}

async function obtenerTablonesAnuncioAsociacion() {
  try {
    const anuncios = await obtenerTablonesAnuncio(constantes.ASOCIACION);
    return anuncios;
  } catch (error) {
    console.log(
      "tablon_anuncios.js -> obtenerTablonesAnuncioAsociacion: ",
      error,
    );
    throw new Error(
      "Se ha producido un error al recuperar los tablones de asociación",
    );
  }
}

async function obtenerTablonesAnuncioEscuela() {
  try {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon, taa.nid_asignatura, taa.nid_curso from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta " +
      "join " +
      constantes.ESQUEMA +
      ".tipo_tablon tt on ta.nid_tipo_tablon = tt.nid_tipo_tablon " +
      "left join " +
      constantes.ESQUEMA +
      ".tablon_anuncios_asignatura taa on ta.nid_tablon_anuncio = taa.nid_tablon_anuncio " +
      "where tt.nid_tipo_tablon = " +
      conexion.dbConn.escape(constantes.ESCUELA) +
      " and ta.borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTablonesAnuncioEscuela: ", error);
    throw new Error(
      "Se ha producido un error al recuperar los tablones de escuela",
    );
  }
}

async function obtenerTablonAnuncio(nidTablonAnuncio) {
  try {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon, taa.nid_asignatura, taa.nid_curso, a.descripcion as asignatura from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta " +
      "left join " +
      constantes.ESQUEMA +
      ".tablon_anuncios_asignatura taa on ta.nid_tablon_anuncio = taa.nid_tablon_anuncio " +
      "join " +
      constantes.ESQUEMA +
      ".tipo_tablon tt on ta.nid_tipo_tablon = tt.nid_tipo_tablon " +
      "left join " +
      constantes.ESQUEMA +
      ".asignaturas a on taa.nid_asignatura = a.nid_asignatura " +
      "where ta.nid_tablon_anuncio = " +
      conexion.dbConn.escape(nidTablonAnuncio) +
      " and ta.borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    if (results.length === 0) {
      throw new Error("No se ha encontrado el tablón de anuncios");
    }
    return results[0];
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTablonAnuncio: ", error);
    throw new Error(
      "Se ha producido un error al recuperar el tablón de anuncios",
    );
  }
}

async function obtenerTablonesAnuncioTipo(nidTipoTablon) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".tablon_anuncios " +
      "where nid_tipo_tablon = " +
      conexion.dbConn.escape(nidTipoTablon) +
      " and borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTablonesAnuncioTipo: ", error);
    throw new Error(
      "Se ha producido un error al recuperar los tablones por tipo",
    );
  }
}

module.exports.insertarTablonAnuncio = insertarTablonAnuncio;
module.exports.actualizarTablonAnuncio = actualizarTablonAnuncio;
module.exports.eliminarTablonAnuncio = eliminarTablonAnuncio;
module.exports.obtenerTablonAnuncio = obtenerTablonAnuncio;
module.exports.obtenerTablonesAnuncio = obtenerTablonesAnuncio;
module.exports.obtenerTablonesAnuncioGeneral = obtenerTablonesAnuncioGeneral;
module.exports.obtenerTablonesAnuncioBanda = obtenerTablonesAnuncioBanda;
module.exports.obtenerTablonesAnuncioAsociacion =
  obtenerTablonesAnuncioAsociacion;
module.exports.obtenerTablonesAnuncioEscuela = obtenerTablonesAnuncioEscuela;
module.exports.obtenerTodosTablonesAnuncio = obtenerTodosTablonesAnuncio;
module.exports.obtenerTablonesAnuncioTipo = obtenerTablonesAnuncioTipo;
