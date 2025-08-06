const constantes = require("../constantes");
const conexion = require("../conexion");

function insertarTablonAnuncio(titulo, descripcion, nidTipoTablon) {
  return new Promise((resolve, reject) => {
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

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log("tablon_anuncios.js -> insertarTablonAnuncio: ", error);
          conexion.dbConn.rollback();
          reject("Error al insertar el tablón de anuncios");
        }
        {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function actualizarTablonAnuncio(
  nidTablonAnuncio,
  titulo,
  descripcion,
  nidTipoTablon
) {
  return new Promise((resolve, reject) => {
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
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log("tablon_anuncios.js -> actualizarTablonAnuncio: ", error);
          conexion.dbConn.rollback();
          reject("Se ha producido un error al actualizar el tabón");
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

function obtenerTablonAnuncio(nidTablonAnuncio) {
  return new Promise((resolve, reject) => {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".tablon_anuncios " +
      "where nid_tablon_anuncio = " +
      conexion.dbConn.escape(nidTablonAnuncio);

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("tablon_anuncios.js -> obtenerTabonAnuncio: ", error);
        reject("Se ha producido un error al recuperar el tablón");
      } else if (results.length == 0) {
        reject("No se ha encontrado el tablón");
      } else {
        resolve(results[0]);
      }
    });
  });
}

function obtenerTablonesAnuncio(tipo) {
  return new Promise((resolve, reject) => {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta, " +
      constantes.ESQUEMA +
      ".tipo_tablon tt " +
      "where ta.nid_tipo_tablon = tt.nid_tipo_tablon and " +
      "tt.nid_tipo_tablon = " +
      conexion.dbConn.escape(tipo);

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("tablon_anuncios.js -> obtenerTablonesAnuncion: ", error);
        reject("Se ha producido un error al recuperar los tablones");
      } else {
        resolve(results);
      }
    });
  });
}

function obtenerTablonesAnuncio() {
  return new Promise((resolve, reject) => {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta, " +
      constantes.ESQUEMA +
      ".tipo_tablon tt " +
      "where ta.nid_tipo_tablon = tt.nid_tipo_tablon";

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("tablon_anuncios.js -> obtenerTablonesAnuncio: ", error);
        reject("Se ha producido un error al recuperar los tablones");
      } else {
        resolve(results);
      }
    });
  });
}

async function obtenerTablonesAnuncioGeneral() {
  try {
    const anuncios = await obtenerTablonesAnuncio(constantes.GENERAL);
    return anuncios;
  } catch (error) {
    console.log("tablon_anuncios.js -> obtenerTablonesAnuncioGeneral: ", error);
    throw new Error(
      "Se ha producido un error al recuperar los tablones generales"
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
      "Se ha producido un error al recuperar los tablones de banda"
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
      error
    );
    throw new Error(
      "Se ha producido un error al recuperar los tablones de asociación"
    );
  }
}

function obtenerTablonesAnuncioEscuela() {
  return new Promise((resolve, reject) => {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon, taa.nid_asignatura, taa.nid_curso from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta, " +
      constantes.ESQUEMA +
      ".tipo_tablon tt, " +
      constantes.ESQUEMA +
      ".tablon_anuncios_asignatura taa " +
      "where ta.nid_tipo_tablon = tt.nid_tipo_tablon and " +
      "taa.nid_tablon_anuncio = ta.nid_tablon_anuncio and " +
      "tt.nid_tipo_tablon = " +
      conexion.dbConn.escape(constantes.ESCUELA);

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log(
          "tablon_anuncios.js -> obtenerTablonesAnuncioEscuela: ",
          error
        );
        reject("Se ha producido un error al recuperar los tablones");
      } else {
        resolve(results);
      }
    });
  });
}

function obtenerTablonAnuncio(nidTablonAnuncio) {
  return new Promise((resolve, reject) => {
    const sql =
      "select ta.*, tt.descripcion as tipo_tablon from " +
      constantes.ESQUEMA +
      ".tablon_anuncios ta, " +
      constantes.ESQUEMA +
      ".tipo_tablon tt " +
      "where ta.nid_tipo_tablon = tt.nid_tipo_tablon and " +
      " ta.nid_tablon_anuncio = " +
      conexion.dbConn.escape(nidTablonAnuncio);

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("tablon_anuncios.js -> obtenerTablonAnuncio: ", error);
        reject("Se ha producido un error al recuperar el tablón de anuncios");
      } else if (results.length === 0) {
        reject("No se ha encontrado el tablón de anuncios");
      } else {
        resolve(results[0]);
      }
    });
  });
}

function obtenerTablonesAnuncioTipo(nidTipoTablon) {
  return new Promise((resolve, reject) => {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".tablon_anuncios " +
      "where nid_tipo_tablon = " +
      conexion.dbConn.escape(nidTipoTablon);

    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log(
          "tablon_anuncios.js -> obtenerTablonesAnuncioTipo: ",
          error
        );
        reject("Se ha producido un error al recuperar los tablones por tipo");
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.insertarTablonAnuncio = insertarTablonAnuncio;
module.exports.actualizarTablonAnuncio = actualizarTablonAnuncio;
module.exports.obtenerTablonAnuncio = obtenerTablonAnuncio;
module.exports.obtenerTablonesAnuncio = obtenerTablonesAnuncio;
module.exports.obtenerTablonesAnuncioGeneral = obtenerTablonesAnuncioGeneral;
module.exports.obtenerTablonesAnuncioBanda = obtenerTablonesAnuncioBanda;
module.exports.obtenerTablonesAnuncioAsociacion =
  obtenerTablonesAnuncioAsociacion;
module.exports.obtenerTablonesAnuncioEscuela = obtenerTablonesAnuncioEscuela;
module.exports.obtenerTablonesAnuncioTipo = obtenerTablonesAnuncioTipo;
module.exports.obtenerTablonAnuncio = obtenerTablonAnuncio;
