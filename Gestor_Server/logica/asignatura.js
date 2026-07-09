const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");

async function registrar_asignatura(descripcion) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".asignatura(descripcion) values(" +
      conexion.dbConn.escape(descripcion) +
      ")";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.error("Error en la función registrar_asignatura:", error);
    throw new Error("Error en la función registrar_asignatura");
  }
}

async function actualizar_asignatura(
  nid_asignatura,
  descripcion,
  tipo_asignatura,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".asignatura set descripcion = " +
      conexion.dbConn.escape(descripcion) +
      ", tipo_asignatura = " +
      conexion.dbConn.escape(tipo_asignatura) +
      ", fecha_actualizacion = sysdate()" +
      " where nid = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error en la función actualizar_asignatura:", error);
    throw new Error("Error en la función actualizar_asignatura");
  }
}

async function eliminar_asignatura(nid_asignatura) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      ".asignatura where nid = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error en la función eliminar_asignatura:", error);
    throw new Error("Error en la función eliminar_asignatura");
  }
}

async function existe_asignatura(nid_asignatura) {
  try {
    const sql =
      "select count(*) cont from " +
      constantes.ESQUEMA_BD +
      ".asignatura where nid = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["cont"] > 0;
  } catch (error) {
    console.error("Error en la función existe_asignatura:", error);
    throw new Error("Error en la función existe_asignatura");
  }
}

async function obtener_asignaturas() {
  try {
    const sql =
      "select nid, descripcion from " +
      constantes.ESQUEMA_BD +
      ".asignatura order by descripcion";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error en la función obtener_asignaturas:", error);
    throw new Error("Error en la función obtener_asignaturas");
  }
}

async function obtener_asignaturas_profesor(nid_profesor) {
  try {
    const sql =
      "select distinct a.* " +
      "from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".asignatura a " +
      "where pam.nid_matricula_asignatura = ma.nid " +
      " and ma.nid_asignatura = a.nid " +
      " and pam.nid_profesor = " +
      conexion.dbConn.escape(nid_profesor);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error en la función obtener_asignaturas_profesor:", error);
    throw new Error("Error en la función obtener_asignaturas_profesor");
  }
}

async function obtener_asignatura(nid_asignatura) {
  try {
    const sql =
      "select nid, descripcion, tipo_asignatura as tipo_asignatura, instrumento_banda, fecha_actualizacion from " +
      constantes.ESQUEMA_BD +
      ".asignatura where nid = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      throw new Error("Asignatura no encontrada");
    }
    return results[0];
  } catch (error) {
    console.error("Error en la función obtener_asignatura:", error);
    throw new Error("Error en la función obtener_asignatura");
  }
}

async function existe_profesor(nid_asignatura, nid_persona) {
  try {
    const sql =
      "select count(*) cont from " +
      constantes.ESQUEMA_BD +
      ".profesor where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " and nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["cont"] > 0;
  } catch (error) {
    console.error("Error en la función existe_profesor:", error);
    throw new Error("Error en la función existe_profesor");
  }
}

async function add_profesor(nid_asignatura, nid_persona) {
  try {
    let existe = await existe_profesor(nid_asignatura, nid_persona);
    if (existe) {
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".profesor set esBaja = 'N', sucio = 'S', " +
        " fecha_actualizacion = sysdate() " +
        "where nid_asignatura = " +
        conexion.dbConn.escape(nid_asignatura) +
        " and nid_persona = " +
        conexion.dbConn.escape(nid_persona);

      const results = await gestor_base_datos.actualiza(sql);
      return results;
    } else {
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".profesor(nid_asignatura, nid_persona) values(" +
        conexion.dbConn.escape(nid_asignatura) +
        ", " +
        conexion.dbConn.escape(nid_persona) +
        ")";

      const results = await gestor_base_datos.actualiza(sql);
      return results;
    }
  } catch (error) {
    console.error("Error en la función add_profesor:", error);
    throw new Error("Error en la función add_profesor");
  }
}

async function eliminar_profesor(nid_asignatura, nid_persona) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".profesor  set esBaja = 'S', sucio= 'S', " +
      " fecha_actualizacion = sysdate() " +
      " where nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " and nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error en la función eliminar_profesor:", error);
    throw new Error("Error en la función eliminar_profesor");
  }
}

async function obtener_profesor_asignatura(nid_asignatura, nid_persona) {
  try {
    const sql =
      "select p.* from " +
      constantes.ESQUEMA_BD +
      ".profesor p " +
      "  where p.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " and p.nid_persona = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.error("Error en la función obtener_profesor_asignatura:", error);
    throw new Error("Error en la función obtener_profesor_asignatura");
  }
}

async function obtener_profesores() {
  try {
    const sql =
      "select p.*, a.nid nid_asignatura, a.descripcion from " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".asignatura a, " +
      constantes.ESQUEMA_BD +
      ".profesor pr where p.nid = pr.nid_persona and pr.esBaja = 'N' and pr.nid_asignatura = a.nid";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error en la función obtener_profesores:", error);
    throw new Error("Error en la función obtener_profesores");
  }
}

async function obtener_profesores_distinct() {
  try {
    const sql =
      "select distinct p.* from " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".asignatura a, " +
      constantes.ESQUEMA_BD +
      ".profesor pr where p.nid = pr.nid_persona and pr.esBaja = 'N' and pr.nid_asignatura = a.nid";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error en la función obtener_profesores_distinct:", error);
    throw new Error("Error en la función obtener_profesores_distinct");
  }
}

async function obtener_profesores_asignatura(nid_asignatura) {
  try {
    const sql =
      "select p.*, p.nid nid_persona, concat(ifnull(p.nif, ' '), ' ',  p.nombre, ' ', ifnull(p.primer_apellido, ' '), ' ' , ifnull(p.segundo_apellido, ' ')) etiqueta, a.nid nid_asignatura, a.descripcion from " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".asignatura a, " +
      constantes.ESQUEMA_BD +
      ".profesor pr where p.nid = pr.nid_persona and pr.nid_asignatura = a.nid  and pr.esBaja = 'N' and " +
      "a.nid = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error en la función obtener_profesores_asignatura:", error);
    throw new Error("Error en la función obtener_profesores_asignatura");
  }
}

async function obtener_profesores_asignatura_curso(nid_asignatura, nid_curso) {
  try {
    const sql =
      "select p.nid, concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) etiqueta " +
      "from pasico_gestor.persona p,                                                                " +
      "	 pasico_gestor.matricula m,                                                               " +
      "	 pasico_gestor.matricula_asignatura ma,                                                   " +
      "	 pasico_gestor.profesor_alumno_matricula pam                                              " +
      "where p.nid = pam.nid_profesor                                                               " +
      "  and m.nid = ma.nid_matricula                                                               " +
      "  and pam.nid_matricula_asignatura = ma.nid                                                  " +
      "  and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " " +
      "  and ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      "   " +
      "group by p.nid, concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido)  ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error(
      "Error en la función obtener_profesores_asignatura_curso:",
      error,
    );
    throw new Error("Error en la función obtener_profesores_asignatura_curso");
  }
}

async function modificar_sucio(nid_asignatura, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".asignatura set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error en la función modificar_sucio:", error);
    throw new Error("Error en la función modificar_sucio");
  }
}

async function modificar_sucio_profesor(nid_profesor, nid_asignatura, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".profesor set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid_persona = " +
      conexion.dbConn.escape(nid_profesor) +
      " and nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.error("Error en la función modificar_sucio_profesor:", error);
    throw new Error("Error en la función modificar_sucio_profesor");
  }
}

async function obtener_profesores_sucios() {
  try {
    const sql =
      "select p.* from " +
      constantes.ESQUEMA_BD +
      ".profesor p " +
      " where p.sucio = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error en la función obtener_profesores_sucios:", error);
    throw new Error("Error en la función obtener_profesores_sucios");
  }
}

async function obtener_asignaturas_sucias() {
  try {
    const sql =
      "select a.* from " +
      constantes.ESQUEMA_BD +
      ".asignatura a " +
      " where a.sucio = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.error("Error en la función obtener_asignaturas_sucias:", error);
    throw new Error("Error en la función obtener_asignaturas_sucias");
  }
}

module.exports.registrar_asignatura = registrar_asignatura;
module.exports.actualizar_asignatura = actualizar_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.existe_asignatura = existe_asignatura;

module.exports.obtener_asignaturas_profesor = obtener_asignaturas_profesor;
module.exports.obtener_asignaturas = obtener_asignaturas;
module.exports.obtener_asignatura = obtener_asignatura;

module.exports.add_profesor = add_profesor;
module.exports.eliminar_profesor = eliminar_profesor;

module.exports.obtener_profesores = obtener_profesores;
module.exports.obtener_profesores_distinct = obtener_profesores_distinct;
module.exports.obtener_profesores_asignatura = obtener_profesores_asignatura;

module.exports.obtener_profesores_asignatura_curso =
  obtener_profesores_asignatura_curso;

module.exports.obtener_profesor_asignatura = obtener_profesor_asignatura;

module.exports.modificar_sucio = modificar_sucio;
module.exports.modificar_sucio_profesor = modificar_sucio_profesor;

module.exports.obtener_profesores_sucios = obtener_profesores_sucios;
module.exports.obtener_asignaturas_sucias = obtener_asignaturas_sucias;
