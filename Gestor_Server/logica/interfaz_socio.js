const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_interfaz_persona = require("./interfaz_persona.js");
const gestor_socio = require("./socio.js");

function insertar_interfaz_socio(interfaz_socio) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".interfaz_socio(nid_interfaz_persona, fecha_alta, fecha_baja, operacion, estado, lote)" +
    "values(" +
    conexion.dbConn.escape(interfaz_socio.nid_interfaz_persona) +
    ", " +
    " str_to_date(substr(nullif(" +
    conexion.dbConn.escape(interfaz_socio.fecha_alta) +
    ", ''), 1, 10), '%d-%m-%Y'), " +
    " str_to_date(substr(nullif(" +
    conexion.dbConn.escape(interfaz_socio.fecha_baja) +
    ", ''), 1, 10), '%d-%m-%Y'), " +
    conexion.dbConn.escape(interfaz_socio.operacion) +
    ", " +
    conexion.dbConn.escape(interfaz_socio.estado) +
    ", " +
    conexion.dbConn.escape(interfaz_socio.lote) +
    ")";

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log("interfaz_socio -> insertar_interfaz_socio: ", error);
          conexion.dbConn.rollback();
          reject("Se ha producido un error al registrar la interfaz de socio");
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function actualizar_interfaz_socio(interfaz_socio) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".interfaz_socio " +
    "set nid_interfaz_persona = " +
    conexion.dbConn.escape(interfaz_socio.nid_interfaz_persona) +
    ", " +
    " fecha_alta = " +
    " str_to_date(substr(nullif(" +
    conexion.dbConn.escape(interfaz_socio.fecha_alta) +
    ", ''), 1, 10), '%Y-%m-%d'), " +
    " fecha_baja = " +
    " str_to_date(substr(nullif(" +
    conexion.dbConn.escape(interfaz_socio.fecha_baja) +
    ", ''), 1, 10), '%Y-%m-%d'), " +
    " operacion = " +
    conexion.dbConn.escape(interfaz_socio.operacion) +
    ", " +
    " estado = " +
    conexion.dbConn.escape(interfaz_socio.estado) +
    " where nid_interfaz_socio = " +
    conexion.dbConn.escape(interfaz_socio.nid_interfaz_socio);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log("interfaz_socio -> actualizar_interfaz_socio: ", error);
          conexion.dbConn.rollback();
          reject("Se ha producido un error al actualizar la interfaz de socio");
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

function obtener_interfaz_socio_lote(lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_socio where lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("interfaz_socio -> obtener_interfaz_socio_lote: ", error);
        reject(
          "Se ha producido un error al recuperar los registros de interfaz de socio para el lote ",
          lote,
        );
      } else {
        resolve(results);
      }
    });
  });
}

function comparar_dato(dato_interfaz, dato) {
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

function comparar_socio(interfaz_socio, socio) {
  try {
    if (
      comparar_dato(interfaz_socio.nid_persona, socio.nid_persona) &&
      comparar_dato(interfaz_socio.fecha_alta, socio.fecha_alta) &&
      comparar_dato(interfaz_socio.fecha_baja, socio.fecha_baja)
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("interfaz_socio -> comparar_socio: ", error);
    throw new Error(
      "Se ha producido un error al comparar el socio en la interfaz",
    );
  }
}

function insertar_conflico_interfaz_socio(conflicto_interfaz_socio) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".conflictos_interfaz_socio(nid_interfaz_socio, nid_persona, fecha_alta, fecha_baja)" +
    " values(" +
    conexion.dbConn.escape(conflicto_interfaz_socio.nid_interfaz_socio) +
    ", " +
    conexion.dbConn.escape(conflicto_interfaz_socio.nid_persona) +
    ", " +
    " str_to_date(substr(nullif(" +
    conexion.dbConn.escape(conflicto_interfaz_socio.fecha_alta) +
    ", ''), 1, 10), '%d-%m-%Y'), " +
    " str_to_date(substr(nullif(" +
    conexion.dbConn.escape(conflicto_interfaz_socio.fecha_baja) +
    ", ''), 1, 10), '%d-%m-%Y') )";

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log(
            "interfaz_socio -> insertar_conflico_interfaz_socio:",
            error,
          );
          conexion.dbConn.rollback();
          reject("Se ha producido un error al registrar el conflicto de socio");
        } else {
          conexion.dbConn.commit();
          resolve(results.insertId);
        }
      });
    });
  });
}

async function registrar_interfaz_socio(
  nid_interfaz_persona,
  fecha_alta,
  fecha_baja,
  lote,
) {
  try {
    const comprueba_interfaz_socio =
      await obtener_interfaz_socio(nid_interfaz_persona);
    if (comprueba_interfaz_socio.length > 0) {
      //El socio ya existe para el nid_interfaz_persona, no se registra el interfaz de socio
      return comprueba_interfaz_socio[0].nid_interfaz_socio;
    }
    const interfaz_persona =
      await gestor_interfaz_persona.obtener_interfaz_persona(
        nid_interfaz_persona,
      );
    if (
      interfaz_persona.operacion == constantes.OPERACIONES_INTERFAZ.INSERTAR
    ) {
      const interfaz_socio = {
        nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
        fecha_alta: fecha_alta,
        fecha_baja: fecha_baja,
        lote: lote,
        operacion: constantes.OPERACIONES_INTERFAZ.INSERTAR,
        estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
      };
      return await insertar_interfaz_socio(interfaz_socio);
    } else if (
      interfaz_persona.operacion == constantes.OPERACIONES_INTERFAZ.ACTUALIZAR
    ) {
      const existe_socio = await gestor_socio.obtener_socio(
        interfaz_persona.nid_persona,
      );
      if (!existe_socio) {
        const interfaz_socio = {
          nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
          fecha_alta: fecha_alta,
          fecha_baja: fecha_baja,
          operacion: constantes.OPERACIONES_INTERFAZ.INSERTAR,
          estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
          lote: lote,
        };
        return await insertar_interfaz_socio(interfaz_socio);
      }
      // Existe el socio se comprueba si se tiene que actualizar (Modificación fecha alta o baja)
      else {
        const socio = await gestor_socio.obtener_socio(
          interfaz_persona.nid_persona,
        );
        const interfaz_compara_socio = {
          nid_persona: interfaz_persona.nid_persona,
          fecha_alta: fecha_alta,
          fecha_baja: fecha_baja,
        };
        if (!comparar_socio(interfaz_compara_socio, socio)) {
          const interfaz_socio = {
            nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
            fecha_alta: fecha_alta,
            fecha_baja: fecha_baja,
            operacion: constantes.OPERACIONES_INTERFAZ.ACTUALIZAR,
            estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
            lote: lote,
          };
          const nid_interfaz_socio =
            await insertar_interfaz_socio(interfaz_socio);

          const conflicto_interfaz_socio = {
            nid_interfaz_socio: nid_interfaz_socio,
            nid_persona: socio.nid_persona,
            fecha_alta: socio.fecha_alta,
            fecha_baja: socio.fecha_baja,
          };

          // Se recupera el conflicto de actulización, y se incluid el nid del socio
          let conflicto_persona_actualizar =
            await gestor_interfaz_persona.obtener_conflicto_actualizacion(
              interfaz_persona.nid_interfaz_persona,
            );
          if (conflicto_persona_actualizar.length > 0) {
            conflicto_persona_actualizar[0].nid_socio = socio[0].nid_persona;
            console.log(
              "interfaz_socio -> registrar_interfaz_socio:",
              socio,
              conflicto_persona_actualizar[0],
            );
            await gestor_interfaz_persona.actualizar_conflicto_persona(
              conflicto_persona_actualizar[0],
            );
          }

          await insertar_conflico_interfaz_socio(conflicto_interfaz_socio);
          return nid_interfaz_socio;
        } else {
          const interfaz_socio = {
            nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
            fecha_alta: fecha_alta,
            fecha_baja: fecha_baja,
            operacion: constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS,
            estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
            lote: lote,
          };
          return await insertar_interfaz_socio(interfaz_socio);
        }
      }
    } else if (
      interfaz_persona.operacion == constantes.OPERACIONES_INTERFAZ.CONFLICTO
    ) {
      const interfaz_socio = {
        nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
        fecha_alta: fecha_alta,
        fecha_baja: fecha_baja,
        operacion: constantes.OPERACIONES_INTERFAZ.CONFLICTO,
        estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
        lote: lote,
      };
      return await insertar_interfaz_socio(interfaz_socio);
    } else if (
      interfaz_persona.operacion == constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS
    ) {
      const interfaz_socio = {
        nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
        fecha_alta: fecha_alta,
        fecha_baja: fecha_baja,
        nid_persona: interfaz_persona.nid_persona,
        operacion: constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS,
        estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
        lote: lote,
      };

      const socio = await gestor_socio.obtener_socio(
        interfaz_persona.nid_persona,
      );
      const comparacion = comparar_socio(interfaz_socio, socio);

      if (!comparacion) {
        interfaz_socio.operacion = constantes.OPERACIONES_INTERFAZ.ACTUALIZAR;
      }

      return await insertar_interfaz_socio(interfaz_socio);
    }

    return null;
  } catch (error) {
    console.log("interfaz_socio -> registrar_socio", error);
    throw new Error("Se ha producido un error al registrar el socio");
  }
}

function obtener_interfaz_socio(nid_interfaz_persona) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_socio where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("interfaz_socio -> obtener_socio: ", error);
        reject(
          "Se ha producido un error al recuperar el socio para el nid_interfaz_persona " +
            nid_interfaz_persona,
        );
      } else {
        resolve(results);
      }
    });
  });
}

function obtener_interfaz_socio_nid(nid_interfaz_socio) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_socio where nid_interfaz_socio = " +
    conexion.dbConn.escape(nid_interfaz_socio);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("interfaz_socio -> obtener_interfaz_socio_nid", error);
        reject(
          "Se ha producido un error al intentar recuperar la interfaz de gestor_socio",
        );
      } else if (results.length == 0) {
        console.log(
          "interfaz_socion -> obtener_interfaz_socio_nid: No se ha encontrado la interfaz de socio",
        );
        reject("No se ha encontrado la interfaz de socio");
      } else {
        resolve(results[0]);
      }
    });
  });
}

async function actualizar_conflicto(nid_interfaz_persona) {
  try {
    const interfaz_persona =
      await gestor_interfaz_persona.obtener_interfaz_persona(
        nid_interfaz_persona,
      );
    const interfaz_socio = await obtener_interfaz_socio(
      interfaz_persona.nid_interfaz_persona,
    );

    if (interfaz_socio.length > 0) {
      if (
        interfaz_persona.operacion == constantes.OPERACIONES_INTERFAZ.ACTUALIZAR
      ) {
        const existe_socio = await gestor_socio(interfaz_persona.nid_persona);
        if (!existe_socio) {
          const interfaz_socio = {
            nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
            fecha_alta: fecha_alta,
            fecha_baja: fecha_baja,
            operacion: constantes.OPERACIONES_INTERFAZ.INSERTAR,
            estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
            lote: interfaz_persona.lote,
          };
          return await insertar_interfaz_socio(interfaz_socio);
        }
        //Es una actualización y la persona ya es socia
        const socio = await gestor_socio.obtener_socio(
          interfaz_persona.nid_persona,
        );
        if (comparar_socio(interfaz_socio, socio)) {
          return await actualizar_interfaz_socio({
            nid_interfaz_socio: interfaz_socio.nid_interfaz_socio,
            nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
            fecha_alta: interfaz_socio.fecha_alta,
            fecha_baja: interfaz_socio.fecha_baja,
            operacion: constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS,
            estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
          });
        } else {
          // Se recupera el conflicto de actulización, y se incluid el nid del socio
          let conflicto_persona_actualizar =
            await gestor_interfaz_persona.obtener_conflicto_actualizacion(
              interfaz_persona.nid_interfaz_persona,
            );
          console.log("interfaz_socio -> actualizar_conflicto_persona:", socio);
          if (conflicto_persona_actualizar.length > 0) {
            conflicto_persona_actualizar[0].nid_socio = socio.nid_persona;
            await gestor_interfaz_persona.actualizar_conflicto_persona(
              conflicto_persona_actualizar[0],
            );
          }

          return await actualizar_interfaz_socio({
            nid_interfaz_socio: interfaz_socio.nid_interfaz_socio,
            nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
            fecha_alta: interfaz_socio.fecha_alta,
            fecha_baja: interfaz_socio.fecha_baja,
            operacion: constantes.OPERACIONES_INTERFAZ.ACTUALIZAR,
            estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
          });
        }
      } else if (
        interfaz_persona.operacion == constantes.OPERACIONES_INTERFAZ.INSERTAR
      ) {
        return await actualizar_interfaz_socio({
          nid_interfaz_socio: interfaz_socio.nid_interfaz_socio,
          nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
          fecha_alta: interfaz_socio.fecha_alta,
          fecha_baja: interfaz_socio.fecha_baja,
          operacion: constantes.OPERACIONES_INTERFAZ.INSERTAR,
          estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
        });
      } else if (
        (interfaz_persona.operacion =
          constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS)
      ) {
        return await actualizar_interfaz_socio({
          nid_interfaz_socio: interfaz_socio.nid_interfaz_socio,
          nid_interfaz_persona: interfaz_persona.nid_interfaz_persona,
          fecha_alta: interfaz_socio.fecha_alta,
          fecha_baja: interfaz_socio.fecha_baja,
          operacion: constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS,
          estado: constantes.ESTADOS_INTERFAZ.PENDIENTE,
        });
      }
    }
    return null;
  } catch (error) {
    console.log("interfaz_socio -> actualizar_conflicto", error);
    throw new Error(
      "Se ha producido un error al actualizar el conflicto de socio",
    );
  }
}

async function obtener_nid_socio(nid_interfaz_socio) {
  try {
    const interfaz_socio = await obtener_interfaz_socio_nid(nid_interfaz_socio);
    if (interfaz_socio) {
      const interfaz_persona =
        await gestor_interfaz_persona.obtener_interfaz_persona(
          interfaz_socio.nid_interfaz_persona,
        );
      if (interfaz_persona) {
        return interfaz_persona.nid_persona;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log("interfaz_socio -> obtener_nid_socio", error);
    throw new Error(
      "Se ha producido un error al obtener el nid del socio a partir del nid de la interfaz de socio",
    );
  }
}

module.exports.insertar_interfaz_socio = insertar_interfaz_socio;
module.exports.actualizar_interfaz_socio = actualizar_interfaz_socio;
module.exports.obtener_interfaz_socio_lote = obtener_interfaz_socio_lote;
module.exports.obtener_interfaz_socio = obtener_interfaz_socio;
module.exports.registrar_interfaz_socio = registrar_interfaz_socio;
module.exports.actualizar_conflicto = actualizar_conflicto;
module.exports.obtener_interfaz_socio_nid = obtener_interfaz_socio_nid;
module.exports.obtener_nid_socio = obtener_nid_socio;
