const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function comprueba_prestamo(nid_inventario, fecha_inicio) {
  try {
    const sql =
      "select count(*) num" +
      " from " +
      constantes.ESQUEMA_BD +
      ".inventario i, " +
      constantes.ESQUEMA_BD +
      ".prestamos p " +
      " where i.nid_inventario = p.nid_inventario " +
      "   and i.nid_inventario = " +
      conexion.dbConn.escape(nid_inventario) +
      "   and not (fecha_inicio <=  " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_inicio) +
      ", '') , '%Y-%m-%d')" +
      "and (fecha_fin is null or fecha_fin >= " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_inicio) +
      ", '') , '%Y-%m-%d'))) ";

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["num"] == 0;
  } catch (error) {
    console.log("prestamos.js - comprueba_prestamo -> " + error);
    throw new Error("Error al comprobar el prestamo");
  }
}

async function registrar_prestamo(nid_persona, nid_inventario, fecha_inicio) {
  try {
    let disponible = await comprueba_prestamo(nid_inventario, fecha_inicio);

    if (disponible) {
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".prestamos(nid_persona, nid_inventario, fecha_inicio) values(" +
        conexion.dbConn.escape(nid_persona) +
        ", " +
        conexion.dbConn.escape(nid_inventario) +
        ", " +
        "str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_inicio) +
        ", '') , '%Y-%m-%d')) ";

      const results = await gestor_base_datos.inserta(sql);
      return results.insertId;
    } else {
      console.log("El instrumento no está disponible");
      throw new Error("El instrumento no está disponible");
    }
  } catch (error) {
    console.log("prestamos.js - registrar_prestamo -> " + error);
    throw new Error("Error al registrar el prestamo");
  }
}

function actualizar_prestamo(
  nid_prestamo,
  nid_persona,
  nid_inventario,
  fecha_inicio,
  fecha_fin,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".prestamos set fecha_inicio = " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_inicio) +
      ", '') , '%Y-%m-%d') " +
      ", fecha_fin = " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_fin) +
      ", '') , '%Y-%m-%d') " +
      ", nid_persona = " +
      conexion.dbConn.escape(nid_persona) +
      ", nid_inventario = " +
      conexion.dbConn.escape(nid_inventario) +
      " where nid_prestamo = " +
      conexion.dbConn.escape(nid_prestamo);

    const results = gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("prestamos.js - actualizar_prestamo -> " + error);
    throw new Error("Error al actualizar el prestamo");
  }
}

async function obtener_prestamos() {
  try {
    const sql =
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) etiqueta_persona, i.descripcion etiqueta_inventario, " +
      " pr.nid_inventario, pr.nid_persona, pr.nid_prestamo, date_format(pr.fecha_fin, '%Y-%m-%d') fecha_fin, date_format(pr.fecha_inicio, '%Y-%m-%d') fecha_inicio " +
      " from " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".inventario i, " +
      constantes.ESQUEMA_BD +
      ".prestamos pr" +
      " where p.nid = pr.nid_persona  " +
      "   and i.nid_inventario = pr.nid_inventario " +
      "   and pr.activo = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("prestamos.js - obtener_prestamos -> " + error);
    throw new Error("Error al obtener los prestamos");
  }
}

async function obtener_prestamo(nid_prestamo) {
  try {
    const sql =
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) etiqueta_persona, i.descripcion etiqueta_inventario, " +
      " pr.nid_inventario, pr.nid_persona, pr.nid_prestamo, date_format(pr.fecha_fin, '%Y-%m-%d') fecha_fin, date_format(pr.fecha_inicio, '%Y-%m-%d') fecha_inicio " +
      " from " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".inventario i, " +
      constantes.ESQUEMA_BD +
      ".prestamos pr " +
      " where p.nid = pr.nid_persona  " +
      "   and i.nid_inventario = pr.nid_inventario " +
      "   and pr.nid_prestamo = " +
      conexion.dbConn.escape(nid_prestamo) +
      "   and pr.activo = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      console.log("No se ha encontrado el prestamo");
      throw new Error("No se ha encontrado el prestamo");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("prestamos.js - obtener_prestamo -> " + error);
    throw new Error("Error al obtener el prestamo");
  }
}

async function dar_baja_prestamo(nid_prestamo) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".prestamos set activo = 'N' where nid_prestamo = " +
      conexion.dbConn.escape(nid_prestamo);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("prestamos.js - dar_baja_prestamo -> " + error);
    throw new Error("Error al dar de baja el prestamo");
  }
}

module.exports.registrar_prestamo = registrar_prestamo;
module.exports.actualizar_prestamo = actualizar_prestamo;
module.exports.obtener_prestamos = obtener_prestamos;
module.exports.obtener_prestamo = obtener_prestamo;
module.exports.dar_baja_prestamo = dar_baja_prestamo;
