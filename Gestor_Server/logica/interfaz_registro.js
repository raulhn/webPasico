const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_personas = require("./persona.js");
const gestor_interfaz_persona = require("./interfaz_persona.js");

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
    "dni_socio, nombre_socio, primer_apellido_socio, segundo_apellido_socio, fecha_nacimiento_socio, iban, lenguaje_musical, " +
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

function registrar_interfaz_persona(lote, persona) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".interfaz_persona(lote, dni, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento, operacion) values(" +
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
    ", " +
    conexion.dbConn.escape(persona.fecha_nacimiento) +
    ", " +
    conexion.dbConn.escape(persona.operacion) +
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
    ".interfaz_persona set dni = " +
    conexion.dbConn.escape(persona.nif) +
    ", nombre = " +
    conexion.dbConn.escape(persona.nombre) +
    ", primer_apellido = " +
    conexion.dbConn.escape(persona.primer_apellido) +
    ", segundo_apellido = " +
    conexion.dbConn.escape(persona.segundo_apellido) +
    ", email = " +
    conexion.dbConn.escape(persona.email) +
    ", telefono = " +
    conexion.dbConn.escape(persona.telefono) +
    ", fecha_nacimiento = " +
    conexion.dbConn.escape(persona.fecha_nacimiento) +
    ", operacion = " +
    conexion.dbConn.escape(persona.operacion) +
    ", nid_persona = " +
    conexion.dbConn.escape(persona.nid_persona) +
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
    ".interfaz_conflicto_persona(nid_interfaz_persona, nif, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento) values(" +
    conexion.dbConn.escape(nid_interfaz_persona) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.nif) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.nombre) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.primer_apellido) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.segundo_apellido) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.email) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.telefono) +
    ", " +
    conexion.dbConn.escape(persona_interfaz.fecha_nacimiento) +
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

async function cargar_datos_interfaz(lote) {
  try {
    let datos_lote = await obtener_volcado_lote(lote);
    for (let i = 0; i < datos_lote.length; i++) {
      let dato = datos_lote[i];
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
          datos_lote.nid_carga_datos,
          nid_interfaz_persona,
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
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
    } else if (persona.length == 1) {
      datos_persona.nid_persona = persona[0].nid;
      // Se ha encontrado una única persona con el mismo nombre, se compara con la interfaz para determinar si se actualiza o no
      if (compara_persona_interfaz(persona[0], datos_persona)) {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS;
      } else {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.ACTUALIZAR;
      }
      await actualizar_interfaz_persona(datos_persona, nid_interfaz_persona);
    } else {
      // No se ha podido determinar una única persona, se registra como conflicto
      datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.CONFLICTO;
      await insertar_conflicto_persona(datos_persona, nid_interfaz_persona);
      for (let i = 0; i < persona.length; i++) {
        let persona_conflicto = {
          nif: persona[i].nif,
          nombre: persona[i].nombre,
          primer_apellido: persona[i].primer_apellido,
          segundo_apellido: persona[i].segundo_apellido,
          email: persona[i].email,
          telefono: persona[i].telefono,
          fecha_nacimiento: persona[i].fecha_nacimiento,
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
    let nid_interfaz_persona = await registrar_interfaz_persona(
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
      if (persona && persona.length == 0) {
        persona = await gestor_personas.obtener_persona_apellidos(
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
