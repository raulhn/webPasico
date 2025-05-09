const constantes = require("../constantes");
const conexion = require("../conexion");

function existeMusico(nid_persona, nid_tipo_musico, nid_instrumento) {
  return new Promise((resolve, reject) => {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".musicos where nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      " and nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico) +
      " and nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento);

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.log("Error al comprobar si existe el músico: ", error);
        reject(new Error("Error al comprobar si existe el músico"));
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

function insertarMusico(
  nid_persona,
  fecha_alta,
  fecha_baja,
  nid_tipo_musico,
  nid_instrumento,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".musicos (nid_persona, fecha_alta, fecha_baja, nid_tipo_musico, nid_instrumento, fecha_actualizacion)" +
      " values (" +
      conexion.dbConn.escape(nid_persona) +
      ", " +
      conexion.dbConn.escape(fecha_alta) +
      ", " +
      conexion.dbConn.escape(fecha_baja) +
      ", " +
      conexion.dbConn.escape(nid_tipo_musico) +
      ", " +
      conexion.dbConn.escape(nid_instrumento) +
      ", " +
      conexion.dbConn.escape(fecha_actualizacion) +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.log("Error al insertar el músico: ", error);
          conexion.dbConn.rollback();
          reject(new Error("Error al insertar el músico"));
        } else {
          conexion.dbConn.commit();
          console.log("Músico insertado correctamente");
          resolve();
        }
      });
    });
  });
}

function actualizarMusico(
  nid_persona,
  fecha_alta,
  fecha_baja,
  nid_tipo_musico,
  nid_instrumento,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".musicos set fecha_alta = " +
      conexion.dbConn.escape(fecha_alta) +
      ", fecha_baja = " +
      conexion.dbConn.escape(fecha_baja) +
      ", nid_tipo_musico = " +
      conexion.dbConn.escape(nid_tipo_musico) +
      ", nid_instrumento = " +
      conexion.dbConn.escape(nid_instrumento) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(fecha_actualizacion) +
      " where nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.log("Error al actualizar el músico: ", error);
          conexion.dbConn.rollback();
          reject(new Error("Error al actualizar el músico"));
        } else {
          conexion.dbConn.commit();
          console.log("Músico actualizado correctamente");
          resolve();
        }
      });
    });
  });
}

async function registrarMusico(
  nid_persona,
  fecha_alta,
  fecha_baja,
  nid_tipo_musico,
  nid_instrumento,
  fecha_actualizacion
) {
  try {
    let bExiste = await existeMusico(
      nid_persona,
      nid_tipo_musico,
      nid_instrumento
    );

    if (bExiste) {
      await actualizarMusico(
        nid_persona,
        fecha_alta,
        fecha_baja,
        nid_tipo_musico,
        nid_instrumento,
        fecha_actualizacion
      );
    } else {
      await insertarMusico(
        nid_persona,
        fecha_alta,
        fecha_baja,
        nid_tipo_musico,
        nid_instrumento,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al comprobar si existe el músico: ", error);
    throw new Error("Error al comprobar si existe el músico");
  }
}

function esMusico(nid_persona) {
  return new Promise((resolve, reject) => {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".musicos where nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.log("Error al comprobar si es músico: ", error);
        reject(new Error("Error al comprobar si es músico"));
      } else {
        resolve(result.length > 0);
      }
    });
  });
}

module.exports.registrarMusico = registrarMusico;
module.exports.esMusico = esMusico;
