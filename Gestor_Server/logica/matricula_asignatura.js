const constantes = require("../constantes");
const conexion = require("../conexion");
const gestor_base_datos = require("./base_datos.js");

async function obtener_matriculas_asignaturas_alumno(nid_alumno, nid_curso) {
  try {
    const sql =
      "select m.nid as nid_matricula, " +
      "       ma.nid as nid_matricula_asignatura, " +
      "       ma.nid_asignatura, " +
      "       m.nid_curso, " +
      "       ma.nid_matricula, " +
      "       concat(p.nombr, ' ', p.apellido1, ' ', p.apellido2) as nombre_profesor " +
      "       a.descripcion as nombre_asignatura " +
      "       ma.fecha_alta, " +
      "       ma.fecha_baja, " +
      " from " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam, " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".asignatura a " +
      " where m.nid = ma.nid_matricula " +
      "   and ma.nid_asignatura = a.nid " +
      "   and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      "   and m.nid_persona = " +
      conexion.dbConn.escape(nid_alumno) +
      "   and ma.nid = pam.nid_matricula_asignatura ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - obtener_matriculas_asignaturas_alumno - Error en la consulta: " +
        error,
    );
    throw new Error(
      "Error en la consulta al obtener matriculas asignaturas alumno",
    );
  }
}

async function obtener_matricula_asignatura(nid_matricula_asignatura) {
  try {
    const sql =
      "select ma.nid as nid_matricula_asignatura, " +
      "       ma.nid_matricula, " +
      "       ma.nid_asignatura, " +
      "       ma.fecha_alta, " +
      "       ma.fecha_baja, " +
      " ma.fecha_actualizacion " +
      " from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma " +
      " where ma.nid = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log(
      "matricula_asignatura.js - obtener_matricula_asignatura - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta al obtener matricula asignatura");
  }
}

async function obtener_nid_matricula_asignatura(nid_matricula, nid_asignatura) {
  try {
    const sql =
      "select ma.nid as nid_matricula_asignatura " +
      " from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma " +
      " where ma.nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      " and ma.nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length == 0) {
      return null;
    } else {
      return results[0]["nid_matricula_asignatura"];
    }
  } catch (error) {
    console.log(
      "matricula_asignatura.js - obtener_nid_matricula_asignatura - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta al obtener nid matricula asignatura");
  }
}

async function actualizar_fecha_alta_matricula_asignatura(
  nid_matricula_asignatura,
  fecha_alta,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura set fecha_alta = " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_alta) +
      ", '') , '%Y-%m-%d') " +
      " where nid = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - actualizar_fecha_alta_matricula_asignatura - Error en la consulta: " +
        error,
    );
    throw new Error(
      "Error en la consulta al actualizar fecha alta matricula asignatura",
    );
  }
}

async function actualizar_fecha_baja_matricula_asignatura(
  nid_matricula_asignatura,
  fecha_baja,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura set fecha_baja = " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_baja) +
      ", '') , '%Y-%m-%d') " +
      " where nid = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - actualizar_fecha_baja_matricula_asignatura - Error en la consulta: " +
        error,
    );
    throw new Error(
      "Error en la consulta al actualizar fecha baja matricula asignatura",
    );
  }
}

async function add_asignatura(nid_matricula, nid_asignatura) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura(nid_matricula, nid_asignatura, fecha_alta) values(" +
      conexion.dbConn.escape(nid_matricula) +
      ", " +
      conexion.dbConn.escape(nid_asignatura) +
      ", sysdate())";

    const results = await gestor_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - add_asignatura - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta al añadir asignatura a matricula");
  }
}

async function eliminar_asignatura(nid_matricula, nid_asignatura) {
  try {
    const sql =
      "delete from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura where nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      ", " +
      conexion.dbConn.escape(nid_asignatura);

    const reseults = await gestor_base_datos.actualiza(sql);
    return reseults;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - eliminar_asignatura - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta al eliminar asignatura de matricula");
  }
}

async function dar_baja_asignatura(
  nid,
  nid_matricula,
  nid_asignatura,
  fecha_baja,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura set fecha_baja = " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_baja) +
      ", '') , '%Y-%m-%d') where nid_matricula = " +
      conexion.dbConn.escape(nid_matricula) +
      " and nid_asignatura = " +
      conexion.dbConn.escape(nid_asignatura) +
      " and nid = " +
      conexion.dbConn.escape(nid);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - dar_baja_asignatura - Error en la consulta: " +
        error,
    );
    throw new Error(
      "Error en la consulta al dar de baja asignatura de matricula",
    );
  }
}

async function modificar_sucio(nid_matricula_asignatura, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid = " +
      conexion.dbConn.escape(nid_matricula_asignatura);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - modificar_sucio - Error en la consulta: " +
        error,
    );
    throw new Error(
      "Error en la consulta al modificar el campo sucio de matricula asignatura",
    );
  }
}

async function obtener_matriculas_asignaturas_sucias() {
  try {
    const sql =
      "select ma.*  " +
      "from  " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma " +
      "where ma.sucio = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - obtener_matriculas_asignaturas_sucias - Error en la consulta: " +
        error,
    );
    throw new Error(
      "Error en la consulta al obtener matriculas asignaturas sucias",
    );
  }
}

async function obtener_alumnos_sin_profesor(nid_curso, nid_asignatura) {
  try {
    const sql =
      "select distinct p.*, a.nid nid_asignatura, a.descripcion descripcion_asignatura, m.nid nid_matricula " +
      "from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".asignatura a " +
      "where m.nid = ma.nid_matricula " +
      "and p.nid = m.nid_persona " +
      "and ma.nid_asignatura = a.nid " +
      "and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " " +
      "and (a.nid = " +
      conexion.dbConn.escape(nid_asignatura) +
      " or " +
      conexion.dbConn.escape(nid_asignatura) +
      " = 0) " +
      "and not exists( select 1 " +
      "                from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam " +
      "                where pam.nid_matricula_asignatura = ma.nid ) ";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - obtener_alumnos_sin_profesor - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta al obtener alumnos sin profesor");
  }
}

async function obtener_alumnos_sin_profesor_alta(nid_curso, nid_asignatura) {
  try {
    const sql =
      "select distinct p.*, a.nid nid_asignatura, a.descripcion descripcion_asignatura, m.nid nid_matricula " +
      "from " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma, " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".asignatura a " +
      "where m.nid = ma.nid_matricula " +
      "and p.nid = m.nid_persona " +
      "and ma.nid_asignatura = a.nid " +
      "and m.nid_curso = " +
      conexion.dbConn.escape(nid_curso) +
      " " +
      "and (a.nid = " +
      conexion.dbConn.escape(nid_asignatura) +
      " or " +
      conexion.dbConn.escape(nid_asignatura) +
      " = 0) " +
      "and not exists( select 1 " +
      "                from " +
      constantes.ESQUEMA_BD +
      ".profesor_alumno_matricula pam " +
      "                where pam.nid_matricula_asignatura = ma.nid " +
      "and (pam.fecha_baja is null or pam.fecha_baja >= sysdate()) )";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - obtener_alumnos_sin_profesor_alta - Error en la consulta: " +
        error,
    );
    throw new Error(
      "Error en la consulta al obtener alumnos sin profesor alta",
    );
  }
}

async function obtener_alumnos_sin_pago(nid_curso) {
  try {
    const sql =
      "select p.nid, p.nombre, p.primer_apellido, p.segundo_apellido, p.correo_electronico, p.telefono, p.nif from " +
      constantes.ESQUEMA_BD +
      ".persona p, " +
      constantes.ESQUEMA_BD +
      ".matricula m, " +
      constantes.ESQUEMA_BD +
      ".matricula_asignatura ma " +
      "where m.nid_persona = p.nid " +
      " and ma.nid_matricula = m.nid " +
      " and ((ma.fecha_baja is null) or (ma.fecha_baja > now()))" +
      " and p.nid_forma_pago is null" +
      " group by p.nid, p.nombre, p.primer_apellido, p.segundo_apellido, p.correo_electronico, p.telefono, p.nif";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(
      "matricula_asignatura.js - obtener_alumnos_sin_pago - Error en la consulta: " +
        error,
    );
    throw new Error("Error en la consulta al obtener alumnos sin pago");
  }
}

module.exports.obtener_matriculas_asignaturas_alumno =
  obtener_matriculas_asignaturas_alumno;

module.exports.obtener_matricula_asignatura = obtener_matricula_asignatura;
module.exports.obtener_nid_matricula_asignatura =
  obtener_nid_matricula_asignatura;

module.exports.actualizar_fecha_alta_matricula_asignatura =
  actualizar_fecha_alta_matricula_asignatura;
module.exports.actualizar_fecha_baja_matricula_asignatura =
  actualizar_fecha_baja_matricula_asignatura;

module.exports.add_asignatura = add_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.dar_baja_asignatura = dar_baja_asignatura;

module.exports.modificar_sucio = modificar_sucio;

module.exports.obtener_matriculas_asignaturas_sucias =
  obtener_matriculas_asignaturas_sucias;

module.exports.obtener_alumnos_sin_profesor = obtener_alumnos_sin_profesor;
module.exports.obtener_alumnos_sin_profesor_alta =
  obtener_alumnos_sin_profesor_alta;
module.exports.obtener_alumnos_sin_profesor_baja =
  obtener_alumnos_sin_profesor_baja;
module.exports.obtener_alumnos_sin_pago = obtener_alumnos_sin_pago;
