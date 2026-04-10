const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_personas = require("./persona.js");
const gestor_interfaz_persona = require("./interfaz_persona.js");
const gestor_interfaz_socio = require("./interfaz_socio.js");

function obtener_siguiente_lote() {
  const sql =
    "select ifnull(max(lote), 1) + 1 as lote from " +
    constantes.ESQUEMA_BD +
    ".carga_datos";

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(results[0].lote);
      }
    });
  });
}

function cargar_registro(cadena, lote) {
  const valores = cadena.split(";");

  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".carga_datos( dni, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento," +
    "dni_socio, nombre_socio, primer_apellido_socio, segundo_apellido_socio, email_socio, telefono_socio, fecha_nacimiento_socio, fecha_alta_socio, fecha_baja_socio, iban, lenguaje_musical, " +
    "instrumento1, instrumento2, instrumento3, instrumento4, instrumento5, lote) values(trim(" +
    conexion.dbConn.escape(valores[0]) +
    "), trim(" +
    conexion.dbConn.escape(valores[1]) +
    "), trim(" +
    conexion.dbConn.escape(valores[2]) +
    "), trim(" +
    conexion.dbConn.escape(valores[3]) +
    "), trim(" +
    conexion.dbConn.escape(valores[4]) +
    "), trim(" +
    conexion.dbConn.escape(valores[5]) +
    "), trim(" +
    conexion.dbConn.escape(valores[6]) +
    "), trim(" +
    conexion.dbConn.escape(valores[7]) +
    "), trim(" +
    conexion.dbConn.escape(valores[8]) +
    "), trim(" +
    conexion.dbConn.escape(valores[9]) +
    "), trim(" +
    conexion.dbConn.escape(valores[10]) +
    "), trim(" +
    conexion.dbConn.escape(valores[11]) +
    "), trim(" +
    conexion.dbConn.escape(valores[12]) +
    "), trim(" +
    conexion.dbConn.escape(valores[13]) +
    "), trim(" +
    conexion.dbConn.escape(valores[14]) +
    "), trim(" +
    conexion.dbConn.escape(valores[15]) +
    "), trim(" +
    conexion.dbConn.escape(valores[16]) +
    "), trim(" +
    conexion.dbConn.escape(valores[17]) +
    "), trim(" +
    conexion.dbConn.escape(valores[18]) +
    "), trim(" +
    conexion.dbConn.escape(valores[19]) +
    "), trim(" +
    conexion.dbConn.escape(valores[20]) +
    "), trim(" +
    conexion.dbConn.escape(valores[21]) +
    "), trim(" +
    conexion.dbConn.escape(valores[22]) +
    "), " +
    conexion.dbConn.escape(lote) +
    ")";

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function formatearFecha(fechaISO) {
  if (fechaISO) {
    const fecha = new Date(fechaISO); // Crear un objeto Date a partir de la fecha ISO
    const dia = fecha.getDate(); // Obtener el día
    const mes = fecha.getMonth() + 1; // Obtener el mes (0-11, por eso sumamos 1)
    const anio = fecha.getFullYear(); // Obtener el año

    // Formatear la fecha como "DD/MM/YYYY"
    return `${anio}-${mes.toString().padStart(2, "0")}-${dia
      .toString()
      .padStart(2, "0")}`;
  }
  return null;
}

function formatearFechaRevert(fechaISO) {
  if (fechaISO) {
    const fecha = new Date(fechaISO); // Crear un objeto Date a partir de la fecha ISO
    const dia = fecha.getDate(); // Obtener el día
    const mes = fecha.getMonth() + 1; // Obtener el mes (0-11, por eso sumamos 1)
    const anio = fecha.getFullYear(); // Obtener el año

    // Formatear la fecha como "DD/MM/YYYY"
    return `${dia
      .toString()
      .padStart(2, "0")}-${mes.toString().padStart(2, "0")}-${anio}`;
  }
  return null;
}

function registrar_interfaz_persona(lote, persona) {
  console.log("Interfaz Persona", persona);
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona(lote, dni, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento, operacion, estado) values(" +
    conexion.dbConn.escape(lote) +
    ", " +
    conexion.dbConn.escape(persona.nif) +
    ", " +
    conexion.dbConn.escape(persona.nombre) +
    ", " +
    conexion.dbConn.escape(persona.primer_apellido) +
    ", " +
    conexion.dbConn.escape(persona.segundo_apellido) +
    ", " +
    conexion.dbConn.escape(persona.email) +
    ", " +
    conexion.dbConn.escape(persona.telefono) +
    ", str_to_date(substr(nullif(" +
    conexion.dbConn.escape(persona.fecha_nacimiento) +
    ", ''), 1, 10), '%d-%m-%Y'), " +
    conexion.dbConn.escape(persona.operacion) +
    ", " +
    conexion.dbConn.escape(constantes.ESTADOS_INTERFAZ.PENDIENTE) +
    ")";

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function actualizar_interfaz_persona(persona, nid_interfaz_persona) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona set dni = nullif(" +
    conexion.dbConn.escape(persona.nif) +
    ", ''), nombre = " +
    conexion.dbConn.escape(persona.nombre) +
    ", primer_apellido = " +
    conexion.dbConn.escape(persona.primer_apellido) +
    ", segundo_apellido = " +
    conexion.dbConn.escape(persona.segundo_apellido) +
    ", email = " +
    conexion.dbConn.escape(persona.email) +
    ", telefono = " +
    conexion.dbConn.escape(persona.telefono) +
    ", fecha_nacimiento = str_to_date(substr(nullif(" +
    conexion.dbConn.escape(persona.fecha_nacimiento) +
    ", ''), 1, 10), '%d-%m-%Y'), operacion = " +
    conexion.dbConn.escape(persona.operacion) +
    ", nid_persona = " +
    conexion.dbConn.escape(persona.nid_persona) +
    ", nid_interfaz_socio = " +
    conexion.dbConn.escape(persona.nid_interfaz_socio) +
    " where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function comparar_dato(dato_interfaz, dato) {
  console.log("Comparar dato: ", dato_interfaz, dato);
  // Si no hay un dato nuevo cargado no se compara, se indica que es igual
  if (
    dato_interfaz === undefined ||
    dato_interfaz === null ||
    dato_interfaz.length === 0
  ) {
    return true;
  }

  // El dato de interfaz no es vacio, pero el dato registrado si
  if (dato === undefined || dato === null || dato.toString().length === 0) {
    return false;
  }

  return (
    dato_interfaz.toString().toUpperCase() === dato.toString().toUpperCase()
  );
}

function compara_persona_interfaz(persona, persona_interfaz) {
  if (
    comparar_dato(persona_interfaz.nif, persona.nif) &&
    comparar_dato(persona_interfaz.nombre, persona.nombre) &&
    comparar_dato(persona_interfaz.primer_apellido, persona.primer_apellido) &&
    comparar_dato(
      persona_interfaz.segundo_apellido,
      persona.segundo_apellido,
    ) &&
    comparar_dato(persona_interfaz.email, persona.correo_electronico) &&
    comparar_dato(persona_interfaz.telefono, persona.telefono) &&
    comparar_dato(persona_interfaz.fecha_nacimiento, persona.fecha_nacimiento)
  ) {
    return true;
  } else {
    return false;
  }
}

function insertar_conflicto_persona(persona_interfaz, nid_interfaz_persona) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".interfaz_conflictos_persona(nid_interfaz_persona, nif, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento, nid_persona) values(" +
    conexion.dbConn.escape(nid_interfaz_persona) +
    ", nullif(" +
    conexion.dbConn.escape(persona_interfaz.nif) +
    ", ''), " +
    conexion.dbConn.escape(persona_interfaz.nombre) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.primer_apellido) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.segundo_apellido) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.email) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.telefono) +
    ", str_to_date(substr(nullif(" +
    conexion.dbConn.escape(persona_interfaz.fecha_nacimiento) +
    ", ''), 1, 10), '%Y-%m-%d'), " +
    conexion.dbConn.escape(persona_interfaz.nid_persona) +
    ")";

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function obtener_volcado_lote(lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".carga_datos where lote = " +
    conexion.dbConn.escape(lote);

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

function actualizar_nid_persona_interfaz(
  nid_carga_datos,
  nid_interfaz_persona,
) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".carga_datos set nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona) +
    " where nid_carga_datos = " +
    conexion.dbConn.escape(nid_carga_datos);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject(error);
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function actualizar_nid_persona_socio_interfaz(
  nid_carga_datos,
  nid_interfaz_persona_socio,
) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".carga_datos set nid_interfaz_persona_socio = " +
    conexion.dbConn.escape(nid_interfaz_persona_socio) +
    " where nid_carga_datos = " +
    conexion.dbConn.escape(nid_carga_datos);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log(
            "interfaz_registro -> actualizar_nid_persona_socio_interfaz: ",
            error,
          );
          conexion.dbConn.rollback();
          reject(
            "Se ha producido un error al registrar en la interfaz el socio",
          );
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

async function cargar_datos_interfaz(lote) {
  try {
    let datos_lote = await obtener_volcado_lote(lote);
    for (let i = 0; i < datos_lote.length; i++) {
      let dato = datos_lote[i];

      if (dato.nombre) {
        let nid_interfaz_persona = await comprueba_persona(
          lote,
          dato.dni,
          dato.nombre,
          dato.primer_apellido,
          dato.segundo_apellido,
          dato.email,
          dato.telefono,
          dato.fecha_nacimiento,
        );

        if (nid_interfaz_persona) {
          await actualizar_nid_persona_interfaz(
            datos_lote[i].nid_carga_datos,
            nid_interfaz_persona,
          );
        }

        if (dato.nombre_socio) {
          let nid_interfaz_persona_socio = await comprueba_persona(
            lote,
            dato.dni_socio,
            dato.nombre_socio,
            dato.primer_apellido_socio,
            dato.segundo_apellido_socio,
            dato.email_socio,
            dato.telefono_socio,
            dato.fecha_nacimiento_socio,
          );

          console.log("socio: ", {
            dni_socio: dato.dni_socio,
            nombre_socio: dato.nombre_socio,
            primer_apellido: dato.primer_apellido_socio,
          });

          if (nid_interfaz_persona_socio) {
            await actualizar_nid_persona_socio_interfaz(
              datos_lote[i].nid_carga_datos,
              nid_interfaz_persona_socio,
            );

            const nid_interfaz_socio =
              await gestor_interfaz_socio.registrar_interfaz_socio(
                nid_interfaz_persona_socio,
                dato.fecha_alta_socio,
                dato.fecha_baja_socio,
                lote,
              );

            let interfaz_persona =
              await gestor_interfaz_persona.obtener_interfaz_persona(
                nid_interfaz_persona,
              );

            if (interfaz_persona.nid_persona && nid_interfaz_socio) {
              let persona = await gestor_personas.obtener_persona(
                interfaz_persona.nid_persona,
              );
              if (persona) {
                let interfaz_persona_socio =
                  await gestor_interfaz_persona.obtener_interfaz_persona(
                    nid_interfaz_persona_socio,
                  );
                if (
                  persona.nid_socio != interfaz_persona_socio.nid_persona &&
                  persona.nid != interfaz_persona_socio.nid_persona
                ) {
                  interfaz_persona.operacion =
                    constantes.OPERACIONES_INTERFAZ.ACTUALIZAR;
                }
              }
            }
            interfaz_persona.fecha_nacimiento = formatearFechaRevert(
              interfaz_persona.fecha_nacimiento,
            );
            interfaz_persona.nid_interfaz_socio = nid_interfaz_socio;
            await actualizar_interfaz_persona(
              interfaz_persona,
              nid_interfaz_persona,
            );
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
    throw new Error("Se ha producido un error al cargar los datos");
  }
}

async function comprueba_existe_persona_interfaz(datos_persona, lote) {
  const persona = await gestor_interfaz_persona.obtener_persona_nif_insert(
    datos_persona.nif,
    lote,
  );

  // Existe persona con ese nif
  if (persona.length > 0) {
    return persona[0].nid_interfaz_persona;
  }

  const personas = await gestor_interfaz_persona.obtener_persona_nombre_insert(
    datos_persona.nombre,
    datos_persona.primer_apellido,
    datos_persona.segundo_apellido,
    lote,
  );
  // Coincide persona con nombre y apellidos en modo insert
  if (personas.length > 0) {
    return personas[0].nid_interfaz_persona;
  }

  const personas_apellido =
    await gestor_interfaz_persona.obtener_persona_apellidos_insert(
      datos_persona.primer_apellido,
      datos_persona.segundo_apellido,
      lote,
    );

  if (personas_apellido.length > 0) {
    let datos = {
      nif: datos_persona.dni,
      nombre: datos_persona.nombre,
      primer_apellido: datos_persona.primer_apellido,
      segundo_apellido: datos_persona.segundo_apellido,
      email: datos_persona.email,
      telefono: datos_persona.telefono,
      fecha_nacimiento: datos_persona.fecha_nacimiento,
      operacion: null,
      nid_persona: null,
    };

    let nid_interfaz_persona = await registrar_interfaz_persona(lote, datos);
    datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.CONFLICTO;
    await actualizar_interfaz_persona(datos_persona, nid_interfaz_persona);
    for (let i = 0; i < personas_apellido.length; i++) {
      let persona_conflicto = {
        nif: personas_apellido[i].nif,
        nombre: personas_apellido[i].nombre,
        primer_apellido: personas_apellido[i].primer_apellido,
        segundo_apellido: personas_apellido[i].segundo_apellido,
        email: personas_apellido[i].email,
        telefono: personas_apellido[i].telefono,
        fecha_nacimiento: personas_apellido[i].fecha_nacimiento,
      };
      await insertar_conflicto_persona(persona_conflicto, nid_interfaz_persona);
    }
    return nid_interfaz_persona;
  }
  return null;
}

async function inserta_interfaz_persona(
  persona,
  datos_persona,
  nid_interfaz_persona,
) {
  try {
    if (!persona) {
      return;
    }
    if (persona.length == 0) {
      datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.INSERTAR;
      await actualizar_interfaz_persona(datos_persona, nid_interfaz_persona);
    } else if (persona.length == 1) {
      // Se ha encontrado una única persona con el mismo nombre, se compara con la interfaz para determinar si se actualiza o no
      if (persona[0].nombre != datos_persona.nombre) {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.CONFLICTO;
        let persona_conflicto = {
          nif: persona[0].nif,
          nombre: persona[0].nombre,
          primer_apellido: persona[0].primer_apellido,
          segundo_apellido: persona[0].segundo_apellido,
          email: persona[0].email,
          telefono: persona[0].telefono,
          fecha_nacimiento: persona[0].fecha_nacimiento,
          nid_persona: persona[0].nid,
        };
        await insertar_conflicto_persona(
          persona_conflicto,
          nid_interfaz_persona,
        );
      } else if (compara_persona_interfaz(persona[0], datos_persona)) {
        datos_persona.nid_persona = persona[0].nid;
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS;
      } else {
        datos_persona.nid_persona = persona[0].nid;
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.ACTUALIZAR;
        await insertar_conflicto_persona(
          {
            nif: persona[0].nif,
            nombre: persona[0].nombre,
            primer_apellido: persona[0].primer_apellido,
            segundo_apellido: persona[0].segundo_apellido,
            email: persona[0].email,
            telefono: persona[0].telefono,
            fecha_nacimiento: persona[0].fecha_nacimiento,
            nid_persona: persona[0].nid,
          },
          nid_interfaz_persona,
        );
      }
      await actualizar_interfaz_persona(datos_persona, nid_interfaz_persona);
    } else {
      // No se ha podido determinar una única persona, se registra como conflicto
      datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.CONFLICTO;
      await actualizar_interfaz_persona(datos_persona, nid_interfaz_persona);
      for (let i = 0; i < persona.length; i++) {
        let persona_conflicto = {
          nif: persona[i].nif,
          nombre: persona[i].nombre,
          primer_apellido: persona[i].primer_apellido,
          segundo_apellido: persona[i].segundo_apellido,
          email: persona[i].email,
          telefono: persona[i].telefono,
          fecha_nacimiento: persona[i].fecha_nacimiento,
          nid_persona: persona[i].nid,
        };
        await insertar_conflicto_persona(
          persona_conflicto,
          nid_interfaz_persona,
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function comprueba_persona(
  lote,
  nif,
  nombre,
  primer_apellido,
  segundo_apellido,
  email,
  telefono,
  fecha_nacimiento,
) {
  try {
    let datos_persona = {
      nif: nif,
      nombre: nombre,
      primer_apellido: primer_apellido,
      segundo_apellido: segundo_apellido,
      email: email,
      telefono: telefono,
      fecha_nacimiento: fecha_nacimiento,
      operacion: null,
      nid_persona: null,
    };

    let nid_interfaz_persona = await comprueba_existe_persona_interfaz(
      datos_persona,
      lote,
    );
    if (nid_interfaz_persona) {
      return nid_interfaz_persona;
    }
    nid_interfaz_persona = await registrar_interfaz_persona(
      lote,
      datos_persona,
    );

    let persona = await gestor_personas.obtener_persona_nif(nif);
    if (persona) {
      // Se ha encontrado una persona con el mismo NIF, se compara con la interfaz para determinar si se actualiza o no
      if (compara_persona_interfaz(persona, datos_persona)) {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS;
      } else {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.ACTUALIZAR;
        await insertar_conflicto_persona(
          {
            nif: persona.nif,
            nombre: persona.nombre,
            primer_apellido: persona.primer_apellido,
            segundo_apellido: persona.segundo_apellido,
            email: persona.correo_electronico,
            telefono: persona.telefono,
            fecha_nacimiento: persona.fecha_nacimiento,
            nid_persona: persona.nid,
          },
          nid_interfaz_persona,
        );
      }
      datos_persona.nid_persona = persona.nid;
      await actualizar_interfaz_persona(datos_persona, nid_interfaz_persona);
    } else {
      persona = await gestor_personas.obtener_personas_nombre(
        nombre,
        primer_apellido,
        segundo_apellido,
      );
      // No se ha encontrado por nombre, se busca solo por los apellidos
      if (!persona || (persona && persona.length == 0)) {
        persona = await gestor_personas.obtener_personas_apellidos(
          primer_apellido,
          segundo_apellido,
        );
        inserta_interfaz_persona(persona, datos_persona, nid_interfaz_persona);
      } else {
        inserta_interfaz_persona(persona, datos_persona, nid_interfaz_persona);
      }
    }
    return nid_interfaz_persona;
  } catch (e) {
    console.log(e);
    throw new Error("Error al registrar la persona en la interfaz");
  }
}

module.exports.obtener_siguiente_lote = obtener_siguiente_lote;
module.exports.cargar_registro = cargar_registro;
module.exports.cargar_datos_interfaz = cargar_datos_interfaz;
module.exports.comparar_dato = comparar_dato;
