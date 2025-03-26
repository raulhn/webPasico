const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const persona = require("./persona.js");

function existeSocio(nidPersona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".socios where nid_persona = " +
        conexion.dbConn.escape(nidPersona),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results[0].cont);
        }
      }
    );
  });
}

function obtenerSiguienteNumSocio() {
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
          resolve(results[0].siguiente_num);
        }
      }
    );
  });
}

async function asyncRegistrarSocio(
  nidPersona,
  numSocio,
  fechaAlta,
  resolve,
  reject
) {
  const bExistePersona = await persona.existeNid(nidPersona);
  const bExisteSocio = await existeSocio(nidPersona);

  if (!bExistePersona) {
    reject(new Error("No existe la persona"));
  } else if (bExisteSocio) {
    reject("El socio ya está registrado");
  } else {
    if (numSocio === "") {
      numSocio = await obtenerSiguienteNumSocio();
    }

    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".socios(nid_persona, num_socio, fecha_alta) values(" +
          conexion.dbConn.escape(nidPersona) +
          ", " +
          conexion.dbConn.escape(numSocio) +
          ", " +
          "str_to_date(nullif(" +
          conexion.dbConn.escape(fechaAlta) +
          ", '') , '%Y-%m-%d'))",
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
  }
}

function registrarSocio(nidPersona, numSocio, fechaAlta) {
  return new Promise((resolve, reject) => {
    try {
      asyncRegistrarSocio(nidPersona, numSocio, fechaAlta, resolve, reject);
    } catch (error) {
      console.log(error);
      reject(new Error("Error al registrar socio"));
    }
  });
}

async function asyncActualizarSocio(
  nidPersona,
  numSocio,
  fechaAlta,
  fechaBaja,
  resolve,
  reject
) {
  const bExisteSocio = await existeSocio(nidPersona);
  if (bExisteSocio) {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".socios set fecha_baja = str_to_date(nullif(" +
          conexion.dbConn.escape(fechaBaja) +
          ", '') , '%Y-%m-%d')," +
          " fecha_alta =  str_to_date(nullif(" +
          conexion.dbConn.escape(fechaAlta) +
          ", '') , '%Y-%m-%d'), " +
          " num_socio = " +
          conexion.dbConn.escape(numSocio) +
          " where nid_persona = " +
          conexion.dbConn.escape(nidPersona),
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
  } else {
    reject("No existe socio");
  }
}

function actualizarSocio(nidPersona, numSocio, fechaAlta, fechaBaja) {
  return new Promise((resolve, reject) => {
    try {
      asyncActualizarSocio(
        nidPersona,
        numSocio,
        fechaAlta,
        fechaBaja,
        resolve,
        reject
      );
    } catch (error) {
      console.log(error);
      reject(new Error("Error al actualizar socio"));
    }
  });
}

function obtenerSocios() {
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

function obtenerSociosAlta() {
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
          reject(new Error("Error al obtener los socios de alta"));
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtenerSociosBaja() {
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
          reject(new Error("Error al obtener socios de baja"));
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtenerSocio(nidPersona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select s.nid_persona, s.num_socio, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
        constantes.ESQUEMA_BD +
        ".socios s where nid_persona = " +
        conexion.dbConn.escape(nidPersona),
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

module.exports.registrarSocio = registrarSocio;
module.exports.actualizarSocio = actualizarSocio;

module.exports.obtenerSocios = obtenerSocios;
module.exports.obtenerSociosAlta = obtenerSociosAlta;
module.exports.obtenerSociosBaja = obtenerSociosBaja;
module.exports.obtenerSocio = obtenerSocio;
