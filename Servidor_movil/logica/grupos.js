const constantes = require("../constantes.js");
const conexion = require("../conexion.js");

function crear_grupo(nombre, nid_profesor, nid_asignatura) {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".grupos(nombre, nid_profesor) values(" +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(nid_profesor) +
      ", " +
      conexion.dbConn.escape(nid_asignatura) +
      ")";

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, function (err, results) {
        if (err) {
          console.log("grupos.js -> crear_grupo: Error al crear grupo: " + err);
          conexion.dbConn.rollback();
          reject("Se ha producido un error al insertar el grupo");
        } else {
          resolve(results.insertId);
          conexion.dbConn.commit();
        }
      });
    });
  });
}

function borrar_grupo(nid_grupo) {
  const sql =
    "update " +
    constantes.ESQUEMA +
    ".grupos set borrado = 'S' where nid_grupo = " +
    conexion.dbConn.escape(nid_grupo);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, function (err, results) {
        if (err) {
          console.log(
            "grupos.js -> borrar_grupo: Error al borrar grupo: " + err,
          );
          conexion.dbConn.rollback();
          reject("Se ha producido un error al borrar el grupo");
        } else {
          resolve(results);
          conexion.dbConn.commit();
        }
      });
    });
  });
}

function obtener_grupos(nid_profesor) {
  const sql =
    "select from " +
    constantes.ESQUEMA +
    ".grupos where nid_profesor = " +
    conexion.dbConn.escape(nid_profesor) +
    " and borrado = 'N'";

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, function (err, results) {
      if (err) {
        console.log(
          "grupos.js -> obtener_grupos: Error al obtener grupos: " + err,
        );
        reject("Se ha producido un error al obtener los grupos");
      } else {
        resolve(results);
      }
    });
  });
}

function add_alumno(nid_grupo, nid_matricula_asignatura) {
  const sql =
    "insert into " +
    constantes.ESQUEMA +
    ".alumnos_grupos(nid_grupo, nid_matricula_asignatura) values(" +
    conexion.dbConn.escape(nid_grupo) +
    ", " +
    conexion.dbConn.escape(nid_matricula_asignatura) +
    ")";

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, function (err, results) {
        if (err) {
          console.log(
            "grupos.js -> add_alumno: Error al añadir alumno al grupo: " + err,
          );
          conexion.dbConn.rollback();
          reject("Se ha producido un error al añadir el alumno al grupo");
        } else {
          resolve(results.insertId);
          conexion.dbConn.commit();
        }
      });
    });
  });
}

function eliminar_alumno(nid_grupo, nid_matricula_asignatura) {
  const sql =
    "delete from " +
    constantes.ESQUEMA +
    ".alumnos_grupos where nid_grupo = " +
    conexion.dbConn.escape(nid_grupo) +
    " and nid_matricula_asignatura = " +
    conexion.dbConn.escape(nid_matricula_asignatura);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, function (err, results) {
        if (err) {
          console.log(
            "grupos.js -> eliminar_alumno: Error al eliminar alumno del grupo: " +
              err,
          );
          conexion.dbConn.rollback();
          reject("Se ha producido un error al eliminar el alumno del grupo");
        } else {
          resolve(results);
          conexion.dbConn.commit();
        }
      });
    });
  });
}

function es_profesor(nid_grupo, nid_persona) {
  const sql =
    "select * from " +
    constantes.ESQUEMA +
    ".grupos where nid_grupo = " +
    conexion.dbConn.escape(nid_grupo) +
    " and nid_profesor = " +
    conexion.dbConn.escape(nid_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, function (err, results) {
      if (err) {
        console.log(
          "grupos.js -> es_profesor: Error al comprobar si la persona es profesor del grupo: " +
            err,
        );
        reject(
          "Se ha producido un error al comprobar si la persona es profesor del grupo",
        );
      } else {
        resolve(results.length > 0);
      }
    });
  });
}

function obtener_alumnos_grupo(nid_grupo) {
  const sql =
    "select * from " +
    constantes.ESQUEMA +
    ".alumnos_grupos where nid_grupo = " +
    conexion.dbConn.escape(nid_grupo);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, function (err, results) {
      if (err) {
        console.log(
          "grupos.js -> obtener_alumnos_grupo: Error al obtener alumnos del grupo: " +
            err,
        );
        reject("Se ha producido un error al obtener los alumnos del grupo");
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.crear_grupo = crear_grupo;
module.exports.borrar_grupo = borrar_grupo;
module.exports.obtener_grupos = obtener_grupos;
module.exports.add_alumno = add_alumno;
module.exports.eliminar_alumno = eliminar_alumno;
module.exports.es_profesor = es_profesor;
module.exports.obtener_alumnos_grupo = obtener_alumnos_grupo;
