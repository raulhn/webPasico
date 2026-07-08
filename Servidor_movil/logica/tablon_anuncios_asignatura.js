const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("./base_datos.js");

async function insertarTablonAnuncioAsignatura(
  nidTablonAnuncio,
  nidAsignatura,
  nidCurso,
) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".tablon_anuncios_asignatura(nid_tablon_anuncio, nid_asignatura, nid_curso) " +
      "values(" +
      conexion.dbConn.escape(nidTablonAnuncio) +
      ", " +
      "nullif(" +
      conexion.dbConn.escape(nidAsignatura) +
      ",'')," +
      "nullif(" +
      conexion.dbConn.escape(nidCurso) +
      ",''))";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log(
      "tablon_anuncios_asignatura.js -> insertarTablonAnunciosAsignatura: ",
      error,
    );
    throw new Error(
      "Se ha producido un erro ral insetar el tablon anuncio en la asignatura",
    );
  }
}

async function actualizarTablonAnuncioAsignatura(
  nidTablonAnuncio,
  nidAsignatura,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".tablon_anuncios_asignatura " +
      "set  nid_asignatura = nullif(" +
      conexion.dbConn.escape(nidAsignatura) +
      ", '')" +
      " where nid_tablon_anuncio = " +
      conexion.dbConn.escape(nidTablonAnuncio);

    const results = await gestor_base_datos.actualiza(sql);
    return results.affectedRows;
  } catch (error) {
    console.log(
      "tablon_anuncios_asignatura.js -> actualizarTablonAnuncioAsignatura: ",
      error,
    );
    throw new Error(
      "Se ha producido un error al actualizar el tablon anuncio en la asignatura",
    );
  }
}

async function obtenerTablonAnuncioAsignatura(nidTablonAnuncioAsignatura) {
  try {
    const sql = "select * ";
    " from " + constantes.ESQUEMA + ".tablon_anuncios_asignatura ";
    " where nid_tablon_anuncio_asignatura = " +
      conexion.dbConn.escape(nidTablonAnuncioAsignatura);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length == 0) {
      console.log(
        "tablon_anuncios_asignatura.js -> obtenerTablonAnuncioAsignatura: No se ha encontrado el tablon asignatura",
      );
      throw new Error("No se ha encontrado el tablon asignatura");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log(
      "tablon_anuncios_asignatura.js -> obtenerTablonAnuncioAsignatura: ",
      error,
    );
    throw new Error(
      "Se ha producido un error al recuperar el tablón asignatura",
    );
  }
}

module.exports.insertarTablonAnuncioAsignatura =
  insertarTablonAnuncioAsignatura;
module.exports.actualizarTablonAnuncioAsignatura =
  actualizarTablonAnuncioAsignatura;
module.exports.obtenerTablonAnuncioAsignatura = obtenerTablonAnuncioAsignatura;
