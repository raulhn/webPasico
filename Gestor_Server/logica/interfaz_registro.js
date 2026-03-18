const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_personas = require("./persona.js");

function cargar_registro(cadena) {
  const valores = cadena.split(";");

  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".carga_datos( dni, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento," +
    "dni_socio, nombre_socio, primer_apellido_socio, segundo_apellido_socio, fecha_nacimiento_socio, iban, lenguaje_musical, " +
    "instrumento1, instrumento2, instrumento3, instrumento4, instrumento5) values(trim(" +
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
    "))";

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

function registrar_interfaz_persona(persona) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".persona(nif, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento, operacion) values(" +
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

function actualizar_interfaz_persona(persona, nid_persona_interfaz) {
  const sql =
    "update " +
    constantes.ESQUEMA_BD +
    ".persona set nif = " +
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
    " where nid_persona_interfaz = " +
    conexion.dbConn.escape(nid_persona_interfaz);

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

function compara_persona_interfaz(persona, persona_interfaz) {
  if (
    persona.nif != persona_interfaz.nif ||
    persona.nombre != persona_interfaz.nombre ||
    persona.primer_apellido != persona_interfaz.primer_apellido ||
    persona.segundo_apellido != persona_interfaz.segundo_apellido ||
    persona.email != persona_interfaz.email ||
    persona.telefono != persona_interfaz.telefono ||
    persona.fecha_nacimiento != persona_interfaz.fecha_nacimiento
  ) {
    return true;
  } else {
    return false;
  }
}

function insertar_conflicto_persona(persona_interfaz, nid_persona_interfaz) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".interfaz_conflicto_persona(nid_persona_interfaz, nif, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento) values(" +
    conexion.dbConn.escape(nid_persona_interfaz) +
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
async function comprueba_persona(
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
    let nid_interfaz_persona = await registrar_interfaz_persona(datos_persona);

    let persona = await gestor_personas.obtener_persona_nif(nif);
    if (persona) {
      // Se ha encontrado una persona con el mismo NIF, se compara con la interfaz para determinar si se actualiza o no
      if (compara_persona_interfaz(persona, datos_persona)) {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.ACTUALIZAR;
      } else {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS;
      }
      datos_persona.nid_persona = persona.nid;
      await actualizar_interfaz_persona(persona, nid_interfaz_persona);
    } else {
      persona = await obtener_personas_nombre(
        nombre,
        primer_apellido,
        segundo_apellido,
      );

      if (persona.length == 0) {
        datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.INSERTAR;
      } else if (persona.length == 1) {
        datos_persona.nid_persona = persona[0].nid;
        // Se ha encontrado una única persona con el mismo nombre, se compara con la interfaz para determinar si se actualiza o no
        if (compara_persona_interfaz(persona[0], datos_persona)) {
          datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.ACTUALIZAR;
        } else {
          datos_persona.operacion = constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS;
        }
        await actualizar_interfaz_persona(persona[0], nid_interfaz_persona);
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
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports.cargar_registro = cargar_registro;
