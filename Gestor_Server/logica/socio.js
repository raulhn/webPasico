const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const persona = require("./persona.js");
const gestor_matricula = require("./matricula.js");

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
      },
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
      },
    );
  });
}

function guardar_socio(nid_persona, num_socio, fecha_alta) {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".socios(nid_persona, num_socio, fecha_alta) values(" +
      conexion.dbConn.escape(nid_persona) +
      ", " +
      conexion.dbConn.escape(num_socio) +
      ", " +
      "str_to_date(substr(nullif(" +
      conexion.dbConn.escape(fecha_alta) +
      ", ''), 1, 10) , '%Y-%m-%d'))";
    conexion.dbConn.beginTransaction(() => {
      console.log("socio -> guardar_socio: fecha_alta: ", fecha_alta);
      console.log("socio -> guardar_socio: nid_persona: ", nid_persona);
      console.log(sql);
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject("Error al registrar el socio");
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
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

      await guardar_socio(nid_persona, num_socio, fecha_alta);
      await actualizar_sucio(nid_persona, "S");
      return;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el socio");
  }
}

function realiza_actualizacion_socio(
  nid_persona,
  num_socio,
  fecha_alta,
  fecha_baja,
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".socios set fecha_baja = str_to_date(substr(nullif(" +
          conexion.dbConn.escape(fecha_baja) +
          ", ''), 1, 10) , '%Y-%m-%d')," +
          " fecha_alta =  str_to_date(substr(nullif(" +
          conexion.dbConn.escape(fecha_alta) +
          ", ''), 1, 10) , '%Y-%m-%d'), " +
          " num_socio = " +
          conexion.dbConn.escape(num_socio) +
          ", fecha_actualizacion = sysdate()" +
          ", sucio = 'S'" +
          " where nid_persona = " +
          conexion.dbConn.escape(nid_persona),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(new Error("Error al guardar el socio"));
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        },
      );
    });
  });
}

async function actualizar_socio(
  nid_persona,
  num_socio,
  fecha_alta,
  fecha_baja,
) {
  try {
    console.log("Comprueba si existe socio", nid_persona);
    let bExisteSocio = await existe_socio(nid_persona);
    if (bExisteSocio > 0) {
      await realiza_actualizacion_socio(
        nid_persona,
        num_socio,
        fecha_alta,
        fecha_baja,
      );

      await actualizar_sucio(nid_persona, "S");
      return;
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
      },
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
      },
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
      },
    );
  });
}

function obtener_socio(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select s.nid_persona, s.num_socio, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja, " +
        " fecha_actualizacion " +
        " from " +
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
      },
    );
  });
}

function actualizar_sucio(nid_persona, sucio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".socios set sucio = " +
          conexion.dbConn.escape(sucio) +
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
        },
      );
    });
  });
}

function obtener_sucios() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select s.* from " +
        constantes.ESQUEMA_BD +
        ".socios s where s.sucio = 'S'",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      },
    );
  });
}

function actualizar_socio_persona(nid_persona, nid_socio) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".persona set nid_socio = " +
    conexion.dbConn.escape(nid_socio) +
    ", sucio = 'S'" +
    ", fecha_actualizacion = now()" +
    " where nid = " +
    conexion.dbConn.escape(nid_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

async function recuperar_socio(nid_persona) {
  try {
    let socio = await obtener_socio(nid_persona);
    if (socio.length > 0) {
      return socio[0];
    } else {
      let persona_recuperada = await persona.obtener_persona(nid_persona);
      if (persona_recuperada.nid_socio) {
        let socios_asociado = await obtener_socio(persona_recuperada.nid_socio);
        if (socios_asociado.length > 0) {
          return socios_asociado[0];
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el socio");
  }
}

async function recuperar_socio_alta(nid_persona) {
  try {
    let socio = await recuperar_socio(nid_persona);
    if (
      socio &&
      (!socio.fecha_baja || new Date(socio.fecha_baja) > new Date())
    ) {
      return socio;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el socio");
  }
}

function obtener_alumnos_sin_socio() {
  const sql =
    " select p.nid, p.nombre, p.primer_apellido, p.segundo_apellido, p.correo_electronico, p.telefono, p.nif " +
    " from " +
    constantes.ESQUEMA_BD +
    ".matricula_asignatura ma,                                " +
    +constantes.ESQUEMA_BD +
    ".matricula m,                                            " +
    +constantes.ESQUEMA_BD +
    ".persona p                                               " +
    " where ma.nid_matricula = m.nid                                             " +
    "   and m.nid_persona = p.nid                                                " +
    "   and (ma.fecha_baja is null or ma.fecha_baja > now())                     " +
    "   and (                                                                    " +
    "         (                                                                  " +
    "          not exists (select 1                                              " +
    "                   from " +
    constantes.ESQUEMA_BD +
    ".socios s                              " +
    "                   where p.nid = s.nid_persona                              " +
    "                     and (s.fecha_baja is null or s.fecha_baja > now())     " +
    "                 )                                                          " +
    "         )                                                                  " +
    "         and                                                                " +
    "         (                                                                  " +
    "           not exists (select 1                                             " +
    "                   from " +
    constantes.ESQUEMA_BD +
    ".socios s                              " +
    "                   where p.nid_socio = s.nid_persona                        " +
    "                     and (s.fecha_baja is null or s.fecha_baja > now())     " +
    "           )                                                                " +
    "                                                                            " +
    "         )                                                                  " +
    "                                                                            " +
    "   )                                                                        " +
    " group by p.nid, p.nombre, p.primer_apellido, p.segundo_apellido, p.correo_electronico, p.telefono, p.nif";

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log("socio.js -> obtener_alumnos_sin_socio:", error);
        reject("Se ha producido un error al obtener los alumnos sin socio");
      } else {
        resolve(results);
      }
    });
  });
}

function obtener_socios_sin_forma_pago() {
  const sql =
    "select p.* from " +
    constantes.ESQUEMA_BD +
    ".socios s, pasico_gestor.persona p " +
    " where s.nid_persona = p.nid " +
    " and s.fecha_baja is null " +
    " and nid_forma_pago is null";
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.existe_socio = existe_socio;
module.exports.registrar_socio = registrar_socio;
module.exports.actualizar_socio = actualizar_socio;

module.exports.obtener_socios = obtener_socios;
module.exports.obtener_socios_alta = obtener_socios_alta;
module.exports.obtener_socios_baja = obtener_socios_baja;
module.exports.obtener_socio = obtener_socio;
module.exports.actualizar_sucio = actualizar_sucio;
module.exports.obtener_sucios = obtener_sucios;
module.exports.actualizar_socio_persona = actualizar_socio_persona;

module.exports.recuperar_socio = recuperar_socio;
module.exports.recuperar_socio_alta = recuperar_socio_alta;
module.exports.obtener_alumnos_sin_socio = obtener_alumnos_sin_socio;
module.exports.obtener_socios_sin_forma_pago = obtener_socios_sin_forma_pago;
