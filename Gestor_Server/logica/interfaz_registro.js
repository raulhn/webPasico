const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_personas = require("./gestor_personas.js");

function cargar_registro(cadena) {
  const valores = cadena.split(";");

  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".carga_datos( dni, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento," +
    "dni_socio, nombre_socio, primer_apellido_socio, segundo_apellido_socio, fecha_nacimiento_socio, iban, lenguaje_musical, " +
    "instrumento1, instrumento2, instrumento3, instrumento4, instrumento5) values(" +
    conexion.dbConn.escape(cadena[0]) +
    ", " +
    conexion.dbConn.escape(cadena[1]) +
    ", " +
    conexion.dbConn.escape(cadena[2]) +
    ", " +
    conexion.dbConn.escape(cadena[3]) +
    ", " +
    conexion.dbConn.escape(cadena[4]) +
    ", " +
    conexion.dbConn.escape(cadena[5]) +
    ", " +
    conexion.dbConn.escape(cadena[6]) +
    ", " +
    conexion.dbConn.escape(cadena[7]) +
    ", " +
    conexion.dbConn.escape(cadena[8]) +
    ", " +
    conexion.dbConn.escape(cadena[9]) +
    ", " +
    conexion.dbConn.escape(cadena[10]) +
    ", " +
    conexion.dbConn.escape(cadena[11]) +
    ", " +
    conexion.dbConn.escape(cadena[12]) +
    ", " +
    conexion.dbConn.escape(cadena[13]) +
    ", " +
    conexion.dbConn.escape(cadena[14]) +
    ", " +
    conexion.dbConn.escape(cadena[15]) +
    ", " +
    conexion.dbConn.escape(cadena[16]) +
    ", " +
    conexion.dbConn.escape(cadena[17]) +
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

function registrar_interfaz_persona(
  nif,
  nombre,
  primer_apellido,
  segundo_apellido,
  email,
  telefono,
  fecha_nacimiento,
  operacion,
) {
  const sql =
    "insert into " +
    constantes.ESQUEMA_BD +
    ".persona(nif, nombre, primer_apellido, segundo_apellido, email, telefono, fecha_nacimiento, operacion) values(" +
    conexion.dbConn.escape(nif) +
    ", " +
    conexion.dbConn.escape(nombre) +
    ", " +
    conexion.dbConn.escape(primer_apellido) +
    ", " +
    conexion.dbConn.escape(segundo_apellido) +
    ", " +
    conexion.dbConn.escape(email) +
    ", " +
    conexion.dbConn.escape(telefono) +
    ", " +
    conexion.dbConn.escape(fecha_nacimiento) +
    ", " +
    conexion.dbConn.escape(operacion) +
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
  correo_electronico,
  fecha_nacimiento,
) {
  try {
    let persona = await gestor_personas.obtener_persona_nif(nif);

    if (!persona) {
      let persona = await obtener_personas_nombre(
        nombre,
        primer_apellido,
        segundo_apellido,
      );

      if (persona.length == 0) {
      } else if (persona.length == 1) {
      } else {
      }
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports.cargar_registro = cargar_registro;
