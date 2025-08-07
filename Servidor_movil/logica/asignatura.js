const constantes = require("../constantes");
const conexion = require("../conexion");

function formatDateToMySQL(date) {
  try {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    return null;
  }
}

function insertarAsignatura(
  nid_asignatura,
  descripcion,
  instrumento_banda,
  tipo_asignatura,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".asignaturas (nid_asignatura, descripcion, instrumento_banda, tipo_asignatura, fecha_actualizacion)" +
      " values (" +
      conexion.dbConn.escape(nid_asignatura) +
      ", " +
      conexion.dbConn.escape(descripcion) +
      ", " +
      conexion.dbConn.escape(instrumento_banda) +
      ", " +
      conexion.dbConn.escape(tipo_asignatura) +
      ", " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.log("Error al insertar la asignatura: ", error);
          conexion.dbConn.rollback();
          reject(new Error("Error al insertar la asignatura"));
        } else {
          conexion.dbConn.commit();
          console.log("Asignatura insertada correctamente");
          resolve();
        }
      });
    });
  });
}

function actualizarAsignatura(
  nid_asignatura,
  descripcion,
  instrumento_banda,
  tipo_asignatura,
  fecha_actualizacion
) {
  return new Promise((resolve, reject) => {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".asignaturas set descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", instrumento_banda = " +
      conexion.dbConn.escape(instrumento_banda) +
      ", tipo_asignatura = " +
      conexion.dbConn.escape(tipo_asignatura) +
      ", fecha_actualizacion = " +
      conexion.dbConn.escape(formatDateToMySQL(fecha_actualizacion)) +
      " where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, result) => {
        if (error) {
          console.log("Error al actualizar la asignatura: ", error);
          conexion.dbConn.rollback();
          reject(new Error("Error al actualizar la asignatura"));
        } else {
          conexion.dbConn.commit();
          console.log("Asignatura actualizada correctamente");
          resolve();
        }
      });
    });
  });
}

function obtenerAsignatura(nid_asignatura) {
  return new Promise((resolve, reject) => {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".asignaturas where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.log("Error al obtener la asignatura: ", error);
        reject(new Error("Error al obtener la asignatura"));
      } else {
        resolve(result[0]);
      }
    });
  });
}

function existeAsignatura(nid_asignatura) {
  return new Promise((resolve, reject) => {
    const sql =
      "select count(*) as existe from " +
      constantes.ESQUEMA +
      ".asignaturas where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    conexion.dbConn.query(sql, (error, result) => {
      if (error) {
        console.log(
          "Error al comprobar la existencia de la asignatura: ",
          error
        );
        reject(new Error("Error al comprobar la existencia de la asignatura"));
      } else {
        resolve(result[0].existe > 0);
      }
    });
  });
}

async function registrarAsignatura(
  nid_asignatura,
  descripcion,
  instrumento_banda,
  tipo_asignatura,
  fecha_actualizacion
) {
  try {
    let asignatura = await existeAsignatura(nid_asignatura);
    if (asignatura) {
      await actualizarAsignatura(
        nid_asignatura,
        descripcion,
        instrumento_banda,
        tipo_asignatura,
        fecha_actualizacion
      );
    } else {
      await insertarAsignatura(
        nid_asignatura,
        descripcion,
        instrumento_banda,
        tipo_asignatura,
        fecha_actualizacion
      );
    }
  } catch (error) {
    console.error("Error al registrar la asignatura: ", error);
    throw error;
  }
}

function obtenerAsignaturas() {
  return new Promise((resolve, reject) => {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".asignaturas order by descripcion";

    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("Error al obtener las asignaturas: ", error);
        reject(new Error("Error al obtener las asignaturas"));
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.registrarAsignatura = registrarAsignatura;
module.exports.obtenerAsignaturas = obtenerAsignaturas;
