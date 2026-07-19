const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const gestor_base_datos = require("./base_datos.js");

async function crear_grupo(nombre, nid_profesor, nid_asignatura) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".grupos(nombre, nid_profesor, nid_asignatura) values(" +
      conexion.dbConn.escape(nombre) +
      ", " +
      conexion.dbConn.escape(nid_profesor) +
      ", " +
      conexion.dbConn.escape(nid_asignatura) +
      ")";
    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (err) {
    console.log("grupos.js -> crear_grupo: Error al crear grupo: " + err);
    throw new Error("Se ha producido un error al insertar el grupo");
  }
}

async function borrar_grupo(nid_grupo) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA +
      ".grupos set borrado = 'S' where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (err) {
    console.log("grupos.js -> borrar_grupo: Error al borrar grupo: " + err);
    throw new Error("Se ha producido un error al borrar el grupo");
  }
}

async function add_alumno(nid_grupo, nid_matricula_asignatura) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA +
      ".grupo_matricula_asignatura(nid_grupo, nid_matricula_asignatura) values(" +
      conexion.dbConn.escape(nid_grupo) +
      ", " +
      conexion.dbConn.escape(nid_matricula_asignatura) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (err) {
    console.log(
      "grupos.js -> add_alumno: Error al añadir alumno al grupo: " + err,
    );
    throw new Error("Se ha producido un error al añadir el alumno al grupo");
  }
}

async function eliminar_alumno(nid_grupo, nid_matricula_asignatura) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA +
      ".grupo_matricula_asignatura where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo) +
      " and nid_matricula_asignatura = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (err) {
    console.log(
      "grupos.js -> eliminar_alumno: Error al eliminar alumno del grupo: " +
        err,
    );
    throw new Error("Se ha producido un error al eliminar el alumno del grupo");
  }
}

async function es_profesor(nid_grupo, nid_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".grupos where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo) +
      " and nid_profesor = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results.length > 0;
  } catch (err) {
    console.log(
      "grupos.js -> es_profesor: Error al comprobar si la persona es profesor del grupo: " +
        err,
    );
    throw new Error(
      "Se ha producido un error al comprobar si la persona es profesor del grupo",
    );
  }
}

async function obtener_alumnos_grupo(nid_grupo) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA +
      ".grupo_matricula_asignatura where nid_grupo = " +
      conexion.dbConn.escape(nid_grupo);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (err) {
    console.log(
      "grupos.js -> obtener_alumnos_grupo: Error al obtener alumnos del grupo: " +
        err,
    );
    throw new Error(
      "Se ha producido un error al obtener los alumnos del grupo",
    );
  }
}

async function obtener_grupos(nid_profesor) {
  try {
    const sql =
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) as profesor, g.* from " +
      constantes.ESQUEMA +
      ".grupos g, " +
      constantes.ESQUEMA +
      ".persona p where nid_profesor = " +
      conexion.dbConn.escape(nid_profesor) +
      " and g.nid_profesor = p.nid_persona " +
      " and borrado = 'N'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (err) {
    console.log(
      "grupos.js -> obtener_grupos: Error al obtener grupos del profesor: " +
        err,
    );
    throw new Error(
      "Se ha producido un error al obtener los grupos del profesor",
    );
  }
}

module.exports.crear_grupo = crear_grupo;
module.exports.borrar_grupo = borrar_grupo;
module.exports.obtener_grupos = obtener_grupos;
module.exports.add_alumno = add_alumno;
module.exports.eliminar_alumno = eliminar_alumno;
module.exports.es_profesor = es_profesor;
module.exports.obtener_alumnos_grupo = obtener_alumnos_grupo;
