const constantes = require("../constantes.js");
const conexion = require("../conexion.js");

function registrarPreinscripcion(
  nombre,
  primerApellido,
  segundoApellido,
  dni,
  fechaNacimiento,
  nombrePadre,
  primerApellidoPadre,
  segundoApellidoPadre,
  dniPadre,
  correoElectronico,
  telefono,
  municipio,
  provincia,
  direccion,
  numero,
  puerta,
  escalera,
  codigoPostal,
  instrumento,
  familiaInstrumento,
  sucursal,
  curso,
  horario,
  tipoInscripcion,
  instrumento2,
  familiaInstrumento2,
  instrumento3,
  familiaInstrumento3
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".preinscripcion(nombre, primer_apellido, segundo_apellido, dni, fecha_nacimiento, nombre_padre, primer_apellido_padre, " +
          "segundo_apellido_padre, dni_padre, correo_electronico, telefono, municipio, provincia, direccion, " +
          "numero, puerta, escalera, codigo_postal, instrumento, familia_instrumento, sucursal, curso, horario, tipo_inscripcion" +
          ", instrumento2, familia_instrumento2, instrumento3, familia_instrumento3) values(" +
          conexion.dbConn.escape(nombre) +
          ", " +
          conexion.dbConn.escape(primerApellido) +
          ", " +
          conexion.dbConn.escape(segundoApellido) +
          ", " +
          conexion.dbConn.escape(dni) +
          ", str_to_date(nullif(" +
          conexion.dbConn.escape(fechaNacimiento) +
          ", '') , '%Y-%m-%d'), " +
          conexion.dbConn.escape(nombrePadre) +
          ", " +
          conexion.dbConn.escape(primerApellidoPadre) +
          ", " +
          conexion.dbConn.escape(segundoApellidoPadre) +
          ", " +
          conexion.dbConn.escape(dniPadre) +
          ", " +
          conexion.dbConn.escape(correoElectronico) +
          ", " +
          conexion.dbConn.escape(telefono) +
          ", " +
          conexion.dbConn.escape(municipio) +
          ", " +
          conexion.dbConn.escape(provincia) +
          ", " +
          conexion.dbConn.escape(direccion) +
          ", " +
          conexion.dbConn.escape(numero) +
          ", " +
          conexion.dbConn.escape(puerta) +
          ", " +
          conexion.dbConn.escape(escalera) +
          ", " +
          conexion.dbConn.escape(codigoPostal) +
          ", " +
          conexion.dbConn.escape(instrumento) +
          ", " +
          "nullif(" +
          conexion.dbConn.escape(familiaInstrumento) +
          ",''), " +
          conexion.dbConn.escape(sucursal) +
          "," +
          conexion.dbConn.escape(curso) +
          ", " +
          conexion.dbConn.escape(horario) +
          "," +
          conexion.dbConn.escape(tipoInscripcion) +
          ", " +
          conexion.dbConn.escape(instrumento2) +
          ", " +
          "nullif(" +
          conexion.dbConn.escape(familiaInstrumento2) +
          ",''), " +
          conexion.dbConn.escape(instrumento3) +
          ", " +
          "nullif(" +
          conexion.dbConn.escape(familiaInstrumento3) +
          ",'') " +
          ")",
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject(new Error("Error al registrar la preinscripción"));
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function obtenerPreinscripciones() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.*, case p.sucursal " +
        " when 1 then 'Torre Pacheco' when 2 then 'Roldán' when 3 then 'Balsicas' when 4 then 'Dolores de Pacheco'  when 5 then 'El Jimenado' " +
        "  when 6 then 'Los Alcázares'  when 7 then 'Sucina' else '' end as nombre_sucursal " +
        ", case p.curso when 6 then 'Adultos' when 7 then 'Iniciación' when 8 then 'Preparatorio' else p.curso end nombre_curso, " +
        "case p.tipo_inscripcion when 1 then 'Nueva Matricula' when 2 then 'Renovación' end as tipo_matricula from " +
        constantes.ESQUEMA_BD +
        ".preinscripcion p where fecha_solicitud > now() - interval 3 month",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al obtener las preinscripicones"));
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtenerPreinscripcionesDetalle(nidPreinscripcion) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select p.*, case p.sucursal " +
        " when 1 then 'Torre Pacheco' when 2 then 'Roldán' when 3 then 'Balsicas' when 4 then 'Dolores de Pacheco'  when 5 then 'El Jimenado' " +
        "  when 6 then 'Los Alcázares'  when 7 then 'Sucina' else '' end as nombre_sucursal " +
        ", case p.curso when 6 then 'Adultos' when 7 then 'Iniciación' when 8 then 'Preparatorio' else p.curso end nombre_curso, " +
        "case p.tipo_inscripcion when 1 then 'Nueva Matricula' when 2 then 'Renovación' end as tipo_matricula from " +
        constantes.ESQUEMA_BD +
        ".preinscripcion p where nid_preinscripcion = " +
        conexion.dbConn.escape(nidPreinscripcion),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(new Error("Error al obtener el detalle de la preinscripcion"));
        } else {
          resolve(results);
        }
      }
    );
  });
}

module.exports.obtenerPreinscripciones = obtenerPreinscripciones;
module.exports.registrarPreinscripcion = registrarPreinscripcion;
module.exports.obtenerPreinscripcionesDetalle = obtenerPreinscripcionesDetalle;
