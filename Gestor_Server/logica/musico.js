const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const persona = require("./persona.js");
const serviceMusicos = require("../services/serviceMusicos.js");

function existe_instrumento(nid_instrumento) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".instrumentos where nid = " +
        conexion.dbConn.escape(nid_instrumento),
      (error, results, fields) => {
        if (error) {
          resolve(false);
        } else {
          resolve(results[0]["cont"] > 0);
        }
      }
    );
  });
}

function obtener_instrumentos() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select i.nid, i.descripcion from " +
        constantes.ESQUEMA_BD +
        ".instrumentos i",
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_instrumentos() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select i.nid, i.descripcion from " +
        constantes.ESQUEMA_BD +
        ".instrumentos i",
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_instrumentos_filtro() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select i.nid, i.descripcion from " +
        constantes.ESQUEMA_BD +
        ".instrumentos i union select 0, 'Todos' from dual",
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_musicos() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.nid, p.nif, p.nombre, p.primer_apellido, p.segundo_apellido, p.telefono, p.correo_electronico, " +
        " m.fecha_alta, m.nid_tipo_musico, m.fecha_baja, m.fecha_alta, m.nid_instrumento, m.fecha_actualizacion" +
        " from " +
        constantes.ESQUEMA_BD +
        ".musico m, " +
        constantes.ESQUEMA_BD +
        ".persona p where p.nid = m.nid_persona " +
        " group by p.nombre, p.primer_apellido, p.segundo_apellido, p.telefono, p.correo_electronico",
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function insertar_musico(nid_persona, nid_instrumento, nid_tipo_musico) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".musico(nid_persona, nid_instrumento, fecha_alta, nid_tipo_musico) values(" +
          conexion.dbConn.escape(nid_persona) +
          ", " +
          conexion.dbConn.escape(nid_instrumento) +
          ", sysdate(), " +
          conexion.dbConn.escape(nid_tipo_musico) +
          ")",
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject("Error al registrar al músico");
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
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
      await serviceMusicos.registrar_musico(nid_persona);
    } else {
      throw new Error("Error al registrar al músico");
    }
  } catch (error) {
    console.error("Error en registrar_instrumento_persona:", error);
    throw new Error("Error al registrar al músico");
  }
}

async function obtener_instrumentos_persona(nid_persona) {
  bExistePersona = await persona.existe_nid(nid_persona);
  if (bExistePersona) {
    return new Promise((resolve, reject) => {
      conexion.dbConn.query(
        "select i.* from " +
          constantes.ESQUEMA_BD +
          ".musico m, " +
          constantes.ESQUEMA_BD +
          ".instrumentos i where m.nid_persona = " +
          conexion.dbConn.escape(nid_persona) +
          " and m.nid_instrumento = i.nid",
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
  } else {
    throw new Error("Error al obtener la información");
  }
}

function eliminar_instrumento_persona(nid_persona, nid_instrumento) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".musico where nid_persona " +
          conexion.dbConn.escape(nid_persona) +
          " and nid_instrumento = " +
          conexion.dbConn.escape(nid_instrumento),
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
}

async function obtener_personas_instrumento(nid_instrumento) {
  if (await existe_instrumento(nid_instrumento)) {
    return new Promise((resolve, reject) => {
      conexion.dbConn.query(
        "select p.*, " +
          " m.fecha_alta, m.nid_tipo_musico, m.fecha_baja, m.fecha_alta, m.nid_instrumento, m.fecha_actualizacion" +
          " from " +
          constantes.ESQUEMA_BD +
          ".persona p, " +
          constantes.ESQUEMA_BD +
          ".musico m where m.nid_persona = p.nid and " +
          "m.nid_instrumento = " +
          conexion.dbConn.escape(nid_instrumento),
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
  } else {
    throw new Error("No existe instrumento");
  }
}

function obtener_tipo_musicos() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " + constantes.ESQUEMA_BD + ".tipo_musico",
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

function obtener_musico(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select  m.nid_persona, m.nid_instrumento, m.fecha_alta, m.nid_tipo_musico, m.fecha_baja, m.fecha_actualizacion from " +
        constantes.ESQUEMA_BD +
        ".musico m where m.nid_persona = " +
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

function baja_musico(
  nid_persona,
  nid_instrumento,
  nid_tipo_musico,
  fecha_baja
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
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
          conexion.dbConn.escape(nid_tipo_musico),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(error);
          } else {
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
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

module.exports.obtener_instrumentos_filtro = obtener_instrumentos_filtro;
module.exports.obtener_instrumentos = obtener_instrumentos;
module.exports.obtener_musicos = obtener_musicos;

module.exports.registrar_instrumento_persona = registrar_instrumento_persona;
module.exports.obtener_instrumentos_persona = obtener_instrumentos_persona;
module.exports.eliminar_instrumento_persona = eliminar_instrumento_persona;
module.exports.obtener_personas_instrumento = obtener_personas_instrumento;

module.exports.obtener_tipo_musicos = obtener_tipo_musicos;
module.exports.obtener_musico = obtener_musico;
module.exports.baja_musico = baja_musico;
