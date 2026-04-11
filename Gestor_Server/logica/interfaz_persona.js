const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_interfaz_socio = require("./interfaz_socio.js");

function obtener_persona_nif_insert(nif, lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where dni = " +
    conexion.dbConn.escape(nif) +
    " and operacion = " +
    conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
    " and lote = " +
    conexion.dbConn.escape(lote) +
    " and dni <> ''";

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("interfaz_persona -> obtener_persona_nif_insert", error);
        reject("Error al recuperar la persona por nif");
      } else {
        resolve(results);
      }
    });
  });
}
function obtener_persona_nombre_insert(
  nombre,
  primer_apellido,
  segundo_apellido,
  lote,
) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where nombre = " +
    conexion.dbConn.escape(nombre) +
    " and primer_apellido = " +
    conexion.dbConn.escape(primer_apellido) +
    " and segundo_apellido = " +
    conexion.dbConn.escape(segundo_apellido) +
    " and operacion = " +
    conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
    " and lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        reject("Error al recuperar la persona");
      } else {
        resolve(result);
      }
    });
  });
}

function obtener_persona_apellidos_insert(
  primer_apellido,
  segundo_apellido,
  lote,
) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where primer_apellido = " +
    conexion.dbConn.escape(primer_apellido) +
    " and segundo_apellido = " +
    conexion.dbConn.escape(segundo_apellido) +
    " and operacion = " +
    conexion.dbConn.escape(constantes.OPERACIONES_INTERFAZ.INSERTAR) +
    " and lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (err, results) => {
      if (err) {
        console.log(
          "interfaz_persona -> obtener_persona_apellidos_insert:",
          err,
        );
        throw new Error("Error al recuperar las personas");
      } else {
        resolve(results);
      }
    });
  });
}

function obtener_conflictos_personas(nid_interfaz_persona) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_conflictos_persona where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log(
          "interfaz_persona -> obtener_conflictos_personas: Error al obtener_conflictos_personas para ",
          nid_interfaz_persona,
        );
        reject("Error al obtener los conflictos de personas");
      } else {
        resolve(results);
      }
    });
  });
}

function obtener_interfaz_personas(lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where lote = " +
    conexion.dbConn.escape(lote);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        reject("Se ha producido un error al recuperar el interfaz de persona");
      } else {
        resolve(results);
      }
    });
  });
}

function obtener_interfaz_personas_pendiente(lote) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where lote = " +
    conexion.dbConn.escape(lote) +
    " and estado = " +
    conexion.dbConn.escape(constantes.ESTADOS_INTERFAZ.PENDIENTE);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        reject(
          "Se ha producido un error al recuperar el interfaz de persona pendiente",
        );
      } else {
        resolve(results);
      }
    });
  });
}

function actualizar_operacion_conflicto(
  nid_interfaz_persona,
  operacion,
  nid_persona,
) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona set operacion = " +
    conexion.dbConn.escape(operacion) +
    ", nid_persona = " +
    conexion.dbConn.escape(nid_persona) +
    " where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.log("Error al iniciar la transacción:", err);
        reject("Error al iniciar la transacción");
        return;
      }

      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log(
            "interfaz_persona -> actualizar_operacion_conflicto: Error al actualizar la operación del conflicto para ",
            nid_interfaz_persona,
            " a ",
            operacion,
            " con nid_persona ",
            nid_persona,
            ":",
            error,
          );
          conexion.dbConn.rollback();
          reject("Error al actualizar la operación del conflicto");
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

//  Función para obtener el socio nuevo asociado a una interfaz_persona, en caso de que exista un conflicto de actualización
async function obtener_socio_nuevo(nid_interfaz_persona) {
  try {
    const interfaz_persona =
      await obtener_interfaz_persona(nid_interfaz_persona);

    const interfaz_socio = await gestor_interfaz_socio.obtener_interfaz_socio(
      interfaz_persona.nid_interfaz_socio,
    );

    if (interfaz_socio && interfaz_socio.length > 0) {
      const nid_interfaz_persona_socio = interfaz_socio[0].nid_interfaz_persona;
      const interfaz_persona_socio = await obtener_interfaz_persona(
        nid_interfaz_persona_socio,
      );
      return interfaz_persona_socio.nid_persona;
    }
    return null;
  } catch (error) {
    throw new Error("Error al obtener el conflicto de socio");
  }
}

function actualizar_conflicto_persona(conflicto_persona) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".interfaz_conflictos_persona set nid_persona = " +
    conexion.dbConn.escape(conflicto_persona.nid_persona) +
    ", nid_socio = ifnull(" +
    conexion.dbConn.escape(conflicto_persona.nid_socio) +
    ", nid_socio)" +
    " where nid_conflicto = " +
    conexion.dbConn.escape(conflicto_persona.nid_conflicto);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.log("Error al iniciar la transacción:", err);
        reject("Error al iniciar la transacción");
        return;
      }

      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log(
            "interfaz_persona -> actualizar_conflicto_persona: Error al actualizar el conflicto de persona para ",
            conflicto_persona.nid_interfaz_conflicto_persona,
            " a ",
            conflicto_persona.operacion,
            " con nid_persona ",
            conflicto_persona.nid_persona,
            ":",
            error,
          );
          conexion.dbConn.rollback();
          reject("Error al actualizar el conflicto de persona");
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

function obtener_conflicto_actualizacion(nid_interfaz_persona) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_conflictos_persona where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona) +
    " and nid_persona is not null";

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log(
          "interfaz_persona -> obtener_conflicto_actualizacion: Error al obtener el conflicto de actualización para ",
          nid_interfaz_persona,
          ":",
          error,
        );
        reject("Error al obtener el conflicto de actualización");
      } else {
        resolve(results);
      }
    });
  });
}

function actualizar_estado(nid_interfaz_persona, estado) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona set estado = " +
    conexion.dbConn.escape(estado) +
    " where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction((err) => {
      if (err) {
        console.log("Error al iniciar la transacción:", err);
        reject("Error al iniciar la transacción");
        return;
      }

      conexion.dbConn.query(sql, (error, results) => {
        if (error) {
          console.log(
            "interfaz_persona -> actualizar_estado: Error al actualizar el estado para ",
            nid_interfaz_persona,
            " a ",
            estado,
            ":",
            error,
          );
          conexion.dbConn.rollback();
          reject("Error al actualizar el estado");
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      });
    });
  });
}

function obtener_interfaz_persona(nid_interfaz_persona) {
  const sql =
    "select * from " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona where nid_interfaz_persona = " +
    conexion.dbConn.escape(nid_interfaz_persona);

  return new Promise((resolve, reject) => {
    conexion.dbConn.query(sql, (error, results) => {
      if (error) {
        console.log("interfaz_persona -> obtener_interfaz_persona: ", error);
        reject(
          "Se ha producido un error al recuperar la interfaz Persona con nid: ",
          nid_interfaz_persona,
        );
      } else if (results.length == 0) {
        console.log(
          "interfaz_persona -> obtener_interfaz_persona: No se ha eencontrado la inteeerfaz_persona para el nid",
          nid_interfaz_persona,
        );
        reject("No se ha encontrado el interfaz persona");
      } else {
        resolve(results[0]);
      }
    });
  });
}

module.exports.obtener_persona_nif_insert = obtener_persona_nif_insert;
module.exports.obtener_persona_nombre_insert = obtener_persona_nombre_insert;
module.exports.obtener_persona_apellidos_insert =
  obtener_persona_apellidos_insert;
module.exports.obtener_conflictos_personas = obtener_conflictos_personas;
module.exports.obtener_interfaz_personas = obtener_interfaz_personas;
module.exports.actualizar_operacion_conflicto = actualizar_operacion_conflicto;
module.exports.actualizar_estado = actualizar_estado;
module.exports.obtener_interfaz_personas_pendiente =
  obtener_interfaz_personas_pendiente;
module.exports.obtener_interfaz_persona = obtener_interfaz_persona;
module.exports.obtener_conflicto_actualizacion =
  obtener_conflicto_actualizacion;
module.exports.actualizar_conflicto_persona = actualizar_conflicto_persona;
module.exports.obtener_socio_nuevo = obtener_socio_nuevo;
