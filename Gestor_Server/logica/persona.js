const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const servicePersona = require("../services/servicePersona.js")

function requiere_actualizar_usuario(nidPersona, fechaActualizacion)
{
  return new Promise(
    (resolve, reject) =>
    {
  const consulta = "select count(*) num " +
                   "from " + constantes.ESQUEMA_BD + ".persona p " +
                   "where p.nid " + conexion.dbConn.escape(nidPersona) +
                   "  and p.fecha_actualizacion > " + conexion.dbConn.escape(fechaActualizacion);
  conexion.dbConn.query(consulta,
    (error, results, fields) =>
    {
      if(error) {reject("Error al comprobar si require actualización")}
      else {resolve(results[0]["num"] > 0)}
    }
  )
})
}

function actualizar_persona_objeto(persona)
{
  return new Promise(
    (resolve, reject) =>
    {
      const actualizarSQL =  "update " + constantes.ESQUEMA_BD + 
         ".persona set " +
         "nombre = " + conexion.dbConn.escape(persona.nombre) + ", " +
         "primer_apellido = " + conexion.dbConn.escape(persona.primer_apellido) + ", " +
         "segundo_apellido = " + conexion.dbConn.escape(persona.segundo_apellido) + ", " +
         "correo_electronico = " + conexion.dbConn.escape(persona.correo_electronico) + ", " +
         "fecha_nacimiento = " + conexion.dbConn.escape(persona.fecha_nacimiento) + ", " +
         "nif = " + conexion.dbConn.escape(persona.nif) + ", " +
         "nid_padre = " + conexion.dbConn.escape(persona.nid_padre) + ", " +
         "nid_madre = " + conexion.dbConn.escape(persona.nid_madre) + ", " +
         "telefono = " + conexion.dbConn.escape(persona.telefono)
         "where nid = " + conexion.dbConn.escape(persona.nid_persona);

      conexion.dbConn.beginTransaction(
        () =>
        {
          conexion.dbConn.query(actualizarSQL,
            (error, results, fields) =>
            {
              if(error)
              {
                console.log(error);
                conexion.dbConn.rollback();
                reject("Error al actualizar la persona del servicio movil");
              }
              else
              {
                conexion.dbConn.commit();
                resolve();
              }
            }
          )
        }
      )
    }
  )
}

async function actualizar_usuario_movil(nidPersona)
{
  try
  {
  let persona_movil = await servicePersona.obtener_persona(nidPersona);
  let bActualizar = await requiere_actualizar_usuario(nidPersona, persona_movil.fecha_actualizacion);

  if(bActualizar)
  {
    await actualizar_persona_objeto(persona_movil);
  }
  }
  catch(error)
  {
    console.log(error);
    throw new Error("Error al actualizar el usuario")
  }
}

async function actualizar_personas_sucias()
{
  try
  {
    let personas_sucias = await servicePersona.obtenerPersonasSucias();

    for(let i=0; i < personas_sucias.length; i++)
    {
      await actualizar_persona_objeto(personas_sucias[i]);
      await servicePersona.limpiarPersona(personas_sucias[i].nid_persona)
    }
    return;
  }
  catch(error)
  {
    console.log(error);
  }
}


async function existe_nif(nif) {
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    if (nif.length === 0) {
      resolve(false);
    } else {
      conexion.dbConn.query(
        "select count(*) cont from " +
          constantes.ESQUEMA_BD +
          ".persona where nif = " +
          conexion.dbConn.escape(nif),
        (error, results, fields) => {
          if (error) {
            resolve(false);
          } else {
            resolve(results[0]["cont"] > 0);
          }
        }
      );
    }
  });
}

async function valida_nif(nif) {
  try {

    let bExisteNif = await existe_nif(nif);
    if (!bExisteNif) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.query(
          "select " +
            constantes.ESQUEMA_BD +
            ".comprueba_nif(" +
            conexion.dbConn.escape(nif) +
            ") valido from dual",
          (error, results, fields) => {
            if (error) {
              reject("Error al validar el NIF");
            } else {
              if (results[0]["valido"] == "S") {
                resolve(true);
              } else {
                reject("NIF/NIE no válido");
              }
            }
          }
        );
      });
    } else {
      throw new Error("El NIF/NIE ya existe");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al validar el NIF");
  }
}

async function existe_nid(nid_persona) {
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".persona where nid = " +
        conexion.dbConn.escape(nid_persona),
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

async function obtener_persona_apellidos(primer_apellido, segundo_apellido) {
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(nombre, ' ', primer_apellido, ' ', segundo_apellido) etiqueta from " +
        constantes.ESQUEMA_BD +
        ".persona where upper(primer_apellido) = upper(" +
        conexion.dbConn.escape(primer_apellido) +
        ") and ifnull(upper(segundo_apellido), '') = ifnull(upper(" +
        conexion.dbConn.escape(segundo_apellido) +
        "), '')",
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

async function existe_persona(
  nombre,
  primer_apellido,
  segundo_apellido,
  fecha_nacimiento
) {
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".persona " +
        " where " +
        constantes.ESQUEMA_BD +
        ".initcap(nombre) = " +
        constantes.ESQUEMA_BD +
        ".initcap( " +
        conexion.dbConn.escape(nombre) +
        ") " +
        " and " +
        constantes.ESQUEMA_BD +
        ".initcap(primer_apellido) = " +
        constantes.ESQUEMA_BD +
        ".initcap( " +
        conexion.dbConn.escape(primer_apellido) +
        ") " +
        " and " +
        constantes.ESQUEMA_BD +
        ".initcap(segundo_apellido) = " +
        constantes.ESQUEMA_BD +
        ".initcap( " +
        conexion.dbConn.escape(segundo_apellido) +
        ") " +
        " and fecha_nacimiento = " +
        "str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_nacimiento) +
        ", '') , '%Y-%m-%d')",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
        } else {
          resolve(results[0]["cont"] > 0);
        }
      }
    );
  });
}

async function registrar_persona(
  nombre,
  primer_apellido,
  segundo_apellido,
  telefono,
  fecha_nacimiento,
  nif,
  correo_electronico,
  codigo
) {
  try {
    let bExiste_nif = await existe_nif(nif);
    let bExiste_persona = await existe_persona(
      nombre,
      primer_apellido,
      segundo_apellido,
      fecha_nacimiento
    );
    if (!bExiste_nif && !bExiste_persona) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.beginTransaction(() => {
          conexion.dbConn.query(
            "insert into " +
              constantes.ESQUEMA_BD +
              ".persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif, correo_electronico, codigo) " +
              " values(" +
              constantes.ESQUEMA_BD +
              ".initcap(" +
              conexion.dbConn.escape(nombre) +
              "), " +
              constantes.ESQUEMA_BD +
              ".initcap(" +
              conexion.dbConn.escape(primer_apellido) +
              "), " +
              constantes.ESQUEMA_BD +
              ".initcap(" +
              conexion.dbConn.escape(segundo_apellido) +
              ")," +
              "cast(nullif(cast(" +
              conexion.dbConn.escape(telefono) +
              " as char), '') as unsigned)" +
              "," +
              "str_to_date(nullif(" +
              conexion.dbConn.escape(fecha_nacimiento) +
              ", '') , '%Y-%m-%d')" +
              ", " +
              "nullif(" +
              conexion.dbConn.escape(nif) +
              ", ''), " +
              conexion.dbConn.escape(correo_electronico) +
              "," +
              "nullif(cast(" +
              conexion.dbConn.escape(codigo) +
              " as char), ''))",
            (error, results, fields) => {
              if (error) {
                conexion.dbConn.rollback();
                console.log(error);
                reject(error);
              } else {
                conexion.dbConn.commit();
                console.log("Usuario registrado");
                resolve(results.insertId);
              }
            }
          );
        });
      });
    } else if (bExiste_nif) {
      throw new Error("Ya existe un nif registrado para esa persona");
    } else {
      throw new Error(
        "Existe una persona con mismo nombre, apellidos y fecha de nacimiento"
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar la persona");
  }
}

async function obtener_nid_persona(nif) {
  try {
    bExiste = await existe_nif(nif);
    if (bExiste) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.query(
          "select nid from " +
            constantes.ESQUEMA_BD +
            ".persona where nif = " +
            conexion.dbConn.escape(nif),
          (error, results, fields) => {
            if (error) {
              console.log(error);
              reject(error);
            } else if (results.length < 1) {
              resolve("");
            } else {
              resolve(results[0]["nid"]);
            }
          }
        );
      });
    } else {
      return "";
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el nid de la persona");
  }
}

async function obtener_padre(nid_persona) {
  try {
    bExiste = await existe_nid(nid_persona);
    if (bExiste) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.query(
          "select nid_padre from " +
            constantes.ESQUEMA_BD +
            ".persona where nid = " +
            conexion.dbConn.escape(nid_persona),
          async (error, results, fields) => {
            if (error) {
              console.log(error);
              reject(error);
            } else if (results.length < 1) {
              reject("No encontrada_persona");
            } else {
              resolve(results[0]["nid_padre"]);
            }
          }
        );
      });
    } else {
      throw new Error("No existe el nid de la persona");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el padre de la persona");
  }
}

async function obtener_madre(nid_persona) {
  try {
    bExiste = await existe_nid(nid_persona);
    if (bExiste) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.query(
          "select nid_madre from " +
            constantes.ESQUEMA_BD +
            ".persona where nid = " +
            conexion.dbConn.escape(nid_persona),
          async (error, results, fields) => {
            if (error) {
              console.log(error);
              reject(error);
            } else if (results.length < 1) {
              reject("No encontrada persona");
            } else {
              resolve(results[0]["nid_madre"]);
            }
          }
        );
      });
    } else {
      throw new Error("No existe el nid de la persona");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener la madre de la persona");
  }
}

async function obtener_hijos(nid_persona) {
  try {
    bExiste = await existe_nid(nid_persona);

    if (bExiste) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.query(
          "select concat(ifnull(p.nif, ''), ' ',  ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ' , ifnull(p.segundo_apellido, '')) etiqueta, p.* from " +
            constantes.ESQUEMA_BD +
            ".persona p where nid_madre = " +
            conexion.dbConn.escape(nid_persona) +
            " or nid_padre = " +
            conexion.dbConn.escape(nid_persona),
          (error, results, fields) => {
            if (error) {
              console.log(error);
              reject("Error al obtener los hijos de la persona");
            } else {
              resolve(results);
            }
          }
        );
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los hijos de la persona");
  }
}

async function registrar_padre(nid_persona, nid_padre) {
  try {
    bExiste = await existe_nid(nid_persona);

    if (bExiste) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.beginTransaction(() => {
          conexion.dbConn.query(
            "update " +
              constantes.ESQUEMA_BD +
              ".persona set nid_padre = nullif(cast(" +
              conexion.dbConn.escape(nid_padre) +
              " as char), '')" +
              " where nid = " +
              conexion.dbConn.escape(nid_persona),
            (error, results, fields) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      });
    } else {
      throw new Error("Error al registrar el padre");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el padre");
  }
}

async function registrar_madre(nid_persona, nid_madre) {
  try {
    bExiste = await existe_nid(nid_persona);

    if (bExiste) {
      return new Promise((resolve, reject) => {
        conexion.dbConn.beginTransaction(() => {
          conexion.dbConn.query(
            "update " +
              constantes.ESQUEMA_BD +
              ".persona set nid_madre =  nullif(cast(" +
              conexion.dbConn.escape(nid_madre) +
              " as char), '')" +
              " where nid = " +
              conexion.dbConn.escape(nid_persona),
            (error, results, fields) => {
              if (error) {
                console.log(error);
                conexion.dbConn.rollback();
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      });
    } else {
      throw new Error("Error al registrar la madre");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar la madre");
  }
}

async function obtener_personas() {
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(ifnull(p.nif, ''), ' ',  ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ' , ifnull(p.segundo_apellido, '')) etiqueta, p.* from " +
        constantes.ESQUEMA_BD +
        ".persona p",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else if (results.length < 1) {
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

async function obtener_todas_personas() {
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.* from " + constantes.ESQUEMA_BD + ".persona p",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else if (results.length < 1) {
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}


async function obtener_persona(nid) {
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(ifnull(p.nif, ''), ' ',  ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ' , ifnull(p.segundo_apellido, '')) etiqueta, p.* from " +
        constantes.ESQUEMA_BD +
        ".persona p where nid = " +
        conexion.dbConn.escape(nid),
      (error, results, fields) => {
        if (error) {
          console.log("Error");
          console.log(error);
          reject(error);
        } else if (results.length < 1) {
          reject("No se ha encontrado la persona");
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

async function obtener_objeto_persona(nid)
{
  await actualizar_personas_sucias();
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.* from " +
        constantes.ESQUEMA_BD +
        ".persona p where nid = " +
        conexion.dbConn.escape(nid),
      (error, results, fields) => {
        if (error) {
          console.log("Error");
          console.log(error);
          reject(error);
        } else if (results.length < 1) {
          reject(new Error("No se ha encontrado la persona"));
        } else {
          resolve(results[0]);
        }
      }
    );
  })
}

function actualizar_persona(
  nid,
  nif,
  nombre,
  primer_apellido,
  segundo_apellido,
  telefono,
  fecha_nacimiento,
  correo_electronico,
  codigo,
  nid_socio
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      bExistePersona = await existe_nid(nid);
      if (bExistePersona) {
        conexion.dbConn.query(
          "update " +
            constantes.ESQUEMA_BD +
            ".persona set" +
            " nif = " +
            "nullif(" +
            conexion.dbConn.escape(nif) +
            ", '')" +
            ", nombre = " +
            constantes.ESQUEMA_BD +
            ".initcap(" +
            conexion.dbConn.escape(nombre) +
            ")" +
            ", primer_apellido = " +
            constantes.ESQUEMA_BD +
            ".initcap(" +
            conexion.dbConn.escape(primer_apellido) +
            ")" +
            ", segundo_apellido = " +
            constantes.ESQUEMA_BD +
            ".initcap(" +
            conexion.dbConn.escape(segundo_apellido) +
            ")" +
            ", telefono = cast(nullif(cast(" +
            conexion.dbConn.escape(telefono) +
            " as char), '') as unsigned)" +
            ", fecha_nacimiento = str_to_date(nullif(" +
            conexion.dbConn.escape(fecha_nacimiento) +
            ", '') , '%Y-%m-%d')" +
            ", correo_electronico = nullif(" +
            conexion.dbConn.escape(correo_electronico) +
            ", '')" +
            ", codigo = " +
            "nullif(cast(" +
            conexion.dbConn.escape(codigo) +
            " as char), '')" +
            ", nid_socio = " +
            "nullif(cast(" +
            conexion.dbConn.escape(nid_socio) +
            " as char), '')" +
            " where nid = " +
            conexion.dbConn.escape(nid),
          (error, results, fields) => {
            if (error) {
              console.log(error);
              conexion.dbConn.rollback();
              resolve(false);
            } else {
              conexion.dbConn.commit();
              resolve(true);
            }
          }
        );
      } else {
        resolve(false);
      }
    });
  });
}

function valida_iban(iban) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select " +
        constantes.ESQUEMA_BD +
        ".comprueba_iban(" +
        conexion.dbConn.escape(iban) +
        ") valido from dual",
      (error, results, fields) => {
        if (error) {
          reject("Error al validar el IBAN");
        } else {
          resolve(results[0]["valido"] == "S");
        }
      }
    );
  });
}

function registrar_forma_pago(nid_titular, iban) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      bExistePersona = await existe_nid(nid_titular);
      bIbanValido = await valida_iban(iban);
      if (!bIbanValido) {
        reject("El IBAN no es válido");
      } else if (bExistePersona) {
        conexion.dbConn.query(
          "insert into " +
            constantes.ESQUEMA_BD +
            ".forma_pago(nid_titular, iban) values(" +
            conexion.dbConn.escape(nid_titular) +
            ", " +
            conexion.dbConn.escape(iban) +
            ")",
          (error, results, fields) => {
            if (error) {
              console.log(error);
              conexion.dbConn.rollback();
              reject();
            } else {
              conexion.dbConn.commit();
              resolve();
            }
          }
        );
      }
    });
  });
}

function obtener_forma_pago(nid_titular) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido, ' - ', iban) etiqueta, fp.nid from " +
        constantes.ESQUEMA_BD +
        ".forma_pago fp, " +
        constantes.ESQUEMA_BD +
        ".persona p where fp.nid_titular = p.nid and fp.nid_titular = " +
        conexion.dbConn.escape(nid_titular),
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

function tiene_forma_pago(nid_titular) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".persona where nid_forma_pago is not null",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]["cont"]);
        }
      }
    );
  });
}

function obtener_pago_persona(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid_forma_pago from " +
        constantes.ESQUEMA_BD +
        ".persona p where p.nid = " +
        conexion.dbConn.escape(nid_persona),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function obtener_formas_pago_persona(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".forma_pago fp " +
        " where fp.nid_titular = " +
        conexion.dbConn.escape(nid_persona),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject("Error al recuperar las formas de pago");
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_forma_pago_nid(nid_forma_pago) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido, ' - ', iban) etiqueta, fp.* from " +
        constantes.ESQUEMA_BD +
        ".forma_pago fp, " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        "where fp.nid_titular = p.nid and fp.nid = " +
        conexion.dbConn.escape(nid_forma_pago),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else if (results.length < 1) {
          console.log("(persona.js): No encontrada forma de pago");
          reject();
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

function obtener_formas_pago() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido, ' - ', iban) etiqueta, fp.nid from " +
        constantes.ESQUEMA_BD +
        ".forma_pago fp, " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        "where fp.nid_titular = p.nid",
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

function asociar_pago_persona(nid_persona, nid_forma_pago) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".persona set nid_forma_pago = " +
          conexion.dbConn.escape(nid_forma_pago) +
          " where nid = " +
          conexion.dbConn.escape(nid_persona),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function actualizar_user_pasarela_pago(nid_persona, nid_user_pasarela) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".persona set nid_pasarela_pago = " +
          conexion.dbConn.escape(nid_user_pasarela) +
          " where nid = " +
          conexion.dbConn.escape(nid_persona),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject("Error al asignar el usuario pasarela de pago");
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function actualizar_metodo_pasarela_pago(
  nid_forma_pago,
  nid_metodo_pasarela_pago
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".forma_pago set nid_metodo_pasarela_pago = " +
          conexion.dbConn.escape(nid_metodo_pasarela_pago) +
          " where nid = " +
          conexion.dbConn.escape(nid_forma_pago),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject("Error al asignar el método de pago");
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function actualizar_forma_pago(nid_forma_pago, activo) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".forma_pago set activo = " +
          conexion.dbConn.escape(activo) +
          " where nid = " +
          conexion.dbConn.escape(nid_forma_pago),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject("Error al actualizar la forma de pago");
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function existe_forma_pago(nid_forma_pago) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num from " +
        constantes.ESQUEMA_BD +
        ".forma_pago where nid = " +
        conexion.dbConn.escape(nid_forma_pago),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          resolve(false);
        } else {
          resolve(Number(results[0]["num"]) > 0);
        }
      }
    );
  });
}

module.exports.registrar_persona = registrar_persona;
module.exports.actualizar_persona = actualizar_persona;

module.exports.existe_nif = existe_nif;
module.exports.valida_nif = valida_nif;
module.exports.existe_nid = existe_nid;
module.exports.obtener_persona_apellidos = obtener_persona_apellidos;
module.exports.obtener_nid_persona = obtener_nid_persona;
module.exports.obtener_objeto_persona = obtener_objeto_persona;

module.exports.obtener_padre = obtener_padre;
module.exports.obtener_madre = obtener_madre;
module.exports.obtener_hijos = obtener_hijos;

module.exports.registrar_padre = registrar_padre;
module.exports.registrar_madre = registrar_madre;

module.exports.obtener_personas = obtener_personas;
module.exports.obtener_todas_personas = obtener_todas_personas;
module.exports.obtener_persona = obtener_persona;

module.exports.registrar_forma_pago = registrar_forma_pago;
module.exports.obtener_forma_pago = obtener_forma_pago;
module.exports.obtener_formas_pago_persona = obtener_formas_pago_persona;
module.exports.obtener_forma_pago_nid = obtener_forma_pago_nid;
module.exports.tiene_forma_pago = tiene_forma_pago;
module.exports.obtener_pago_persona = obtener_pago_persona;
module.exports.obtener_formas_pago = obtener_formas_pago;
module.exports.asociar_pago_persona = asociar_pago_persona;

module.exports.actualizar_user_pasarela_pago = actualizar_user_pasarela_pago;
module.exports.actualizar_metodo_pasarela_pago =
  actualizar_metodo_pasarela_pago;
module.exports.actualizar_forma_pago = actualizar_forma_pago;

module.exports.existe_forma_pago = existe_forma_pago;
