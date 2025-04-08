const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const persona = require("./persona.js");

function existe_socio(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".socios where nid_persona = " +
        conexion.dbConn.escape(nid_persona),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]["cont"]);
        }
      }
    );
  });
}

function obtener_siguiente_num_socio() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select max(num_socio) + 1 siguiente_num from " +
        constantes.ESQUEMA_BD +
        ".socios",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0]["siguiente_num"]);
        }
      }
    );
  });
}

async function registrar_socio(nid_persona, num_socio, fecha_alta) {
  try {
    let bExistePersona = await persona.existe_nid(nid_persona);
    let bExisteSocio = await existe_socio(nid_persona);

    if (!bExistePersona) {
      throw new Error("No existe la persona");
    } else if (bExisteSocio) {
      throw new Error("El socio ya está registrado");
    } else {
      if (num_socio == "") {
        num_socio = await obtener_siguiente_num_socio();
      }

      return new Promise((resolve, reject) => {
        conexion.dbConn.beginTransaction(() => {
          conexion.dbConn.query(
            "insert into " +
              constantes.ESQUEMA_BD +
              ".socios(nid_persona, num_socio, fecha_alta) values(" +
              conexion.dbConn.escape(nid_persona) +
              ", " +
              conexion.dbConn.escape(num_socio) +
              ", " +
              "str_to_date(nullif(" +
              conexion.dbConn.escape(fecha_alta) +
              ", '') , '%Y-%m-%d'))",
            (error, results, fields) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject("Error al registrar el socio");
              } else {
                conexion.dbConn.commit();
                resolve();
              }
            }
          );
        });
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el socio");
  }
}

async function actualizar_socio(
  nid_persona,
  num_socio,
  fecha_alta,
  fecha_baja
) {
  try {
    let bExisteSocio = await existe_socio(nid_persona);
    if (bExisteSocio) {
      conexion.dbConn.beginTransaction(() => {
        return new Promise((resolve, reject) => {
          conexion.dbConn.query(
            "update " +
              constantes.ESQUEMA_BD +
              ".socios set fecha_baja = str_to_date(nullif(" +
              conexion.dbConn.escape(fecha_baja) +
              ", '') , '%Y-%m-%d')," +
              " fecha_alta =  str_to_date(nullif(" +
              conexion.dbConn.escape(fecha_alta) +
              ", '') , '%Y-%m-%d'), " +
              " num_socio = " +
              conexion.dbConn.escape(num_socio) +
              " where nid_persona = " +
              conexion.dbConn.escape(nid_persona),
            (error, results, fields) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject(error);
              } else {
                conexion.dbConn.commit();
                resolve();
              }
            }
          );
        });
      });
    } else {
      throw new Error("No existe socio");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al actualizar el socio");
  }
}

function obtener_socios() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.*, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
        constantes.ESQUEMA_BD +
        ".socios s, " +
        constantes.ESQUEMA_BD +
        ".persona p where s.nid_persona = p.nid",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_socios_alta() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(ifnull(p.nif, ''), ' ',  ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ' , ifnull(p.segundo_apellido, '')) etiqueta, p.*, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
        constantes.ESQUEMA_BD +
        ".socios s, " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        " where s.nid_persona = p.nid and (s.fecha_baja is null or s.fecha_baja > sysdate())",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_socios_baja() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select *, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
        constantes.ESQUEMA_BD +
        ".socios s, " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        " where s.nid_persona = p.nid and s.fecha_baja <= sysdate()",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_socio(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select s.nid_persona, s.num_socio, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
        constantes.ESQUEMA_BD +
        ".socios s where nid_persona = " +
        conexion.dbConn.escape(nid_persona),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

module.exports.registrar_socio = registrar_socio;
module.exports.actualizar_socio = actualizar_socio;

module.exports.obtener_socios = obtener_socios;
module.exports.obtener_socios_alta = obtener_socios_alta;
module.exports.obtener_socios_baja = obtener_socios_baja;
module.exports.obtener_socio = obtener_socio;
