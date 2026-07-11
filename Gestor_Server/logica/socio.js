const gestor_base_datos = require("./base_datos.js");
const mysql = require("mysql");
const constantes = require("../constantes.js");
const persona = require("./persona.js");
const gestor_matricula = require("./matricula.js");

// Return the count of socios for a given person ID
async function existe_socio(nid_persona) {
  try {
    const sql = "select count(*) cont from " + constantes.ESQUEMA_BD + ".socios where nid_persona = " + mysql.escape(nid_persona);
    const results = await gestor_base_datos.consulta(sql);
    return results[0]["cont"];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Get the next available socio number
async function obtener_siguiente_num_socio() {
  try {
    const sql = "select max(num_socio) + 1 siguiente_num from " + constantes.ESQUEMA_BD + ".socios";
    const results = await gestor_base_datos.consulta(sql);
    return results[0]["siguiente_num"];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Insert a new socio record
async function guardar_socio(nid_persona, num_socio, fecha_alta) {
  try {
    const sql = "insert into " + constantes.ESQUEMA_BD + ".socios(nid_persona, num_socio, fecha_alta) values(" +
      mysql.escape(nid_persona) + ", " +
      mysql.escape(num_socio) + ", " +
      "str_to_date(substr(nullif(" + mysql.escape(fecha_alta) + ", ''), 1, 10) , '%Y-%m-%d'))";
    console.log("socio -> guardar_socio: fecha_alta: ", fecha_alta);
    console.log("socio -> guardar_socio: nid_persona: ", nid_persona);
    console.log(sql);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el socio");
  }
}

// Public API to register a socio, ensuring related validations
async function registrar_socio(nid_persona, num_socio, fecha_alta) {
  try {
    let bExistePersona = await persona.existe_nid(nid_persona);
    let bExisteSocio = await existe_socio(nid_persona);

    if (!bExistePersona) {
      throw new Error("No existe la persona");
    } else if (bExisteSocio) {
      throw new Error("El socio ya está registrado");
    } else {
      if (num_socio == "") {
        num_socio = await obtener_siguiente_num_socio();
      }

      await guardar_socio(nid_persona, num_socio, fecha_alta);
      await actualizar_sucio(nid_persona, "S");
      return;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el socio");
  }
}

// Update an existing socio record
async function realiza_actualizacion_socio(nid_persona, num_socio, fecha_alta, fecha_baja) {
  try {
    const sql = "update " + constantes.ESQUEMA_BD + ".socios set fecha_baja = str_to_date(substr(nullif(" +
      mysql.escape(fecha_baja) + ", ''), 1, 10) , '%Y-%m-%d')," +
      " fecha_alta =  str_to_date(substr(nullif(" +
      mysql.escape(fecha_alta) + ", ''), 1, 10) , '%Y-%m-%d'), " +
      " num_socio = " + mysql.escape(num_socio) + ", fecha_actualizacion = sysdate(), sucio = 'S' where nid_persona = " + mysql.escape(nid_persona);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log(error);
    throw new Error("Error al guardar el socio");
  }
}

// Public API to update a socio, with validation and error handling
async function actualizar_socio(nid_persona, num_socio, fecha_alta, fecha_baja) {
  try {
    console.log("Comprueba si existe socio", nid_persona);
    let bExisteSocio = await existe_socio(nid_persona);
    if (bExisteSocio > 0) {
      await realiza_actualizacion_socio(
        nid_persona,
        num_socio,
        fecha_alta,
        fecha_baja,
      );

      await actualizar_sucio(nid_persona, "S");
      return;
    } else {
      throw new Error("No existe socio");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al actualizar el socio");
  }
}

// Retrieve all socios with related person data
async function obtener_socios() {
  try {
    const sql = "select p.*, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
      constantes.ESQUEMA_BD + ".socios s, " + constantes.ESQUEMA_BD + ".persona p where s.nid_persona = p.nid";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Retrieve socios that are currently active (no fecha_baja or future)
async function obtener_socios_alta() {
  try {
    const sql = "select concat(ifnull(p.nif, ''), ' ', ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ', ifnull(p.segundo_apellido, '')) etiqueta, p.*, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
      constantes.ESQUEMA_BD + ".socios s, " + constantes.ESQUEMA_BD + ".persona p where s.nid_persona = p.nid and (s.fecha_baja is null or s.fecha_baja > sysdate())";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Retrieve socios that have been deactivated (fecha_baja <= sysdate)
async function obtener_socios_baja() {
  try {
    const sql = "select *, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja from " +
      constantes.ESQUEMA_BD + ".socios s, " + constantes.ESQUEMA_BD + ".persona p where s.nid_persona = p.nid and s.fecha_baja <= sysdate()";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Retrieve a single socio by person ID
async function obtener_socio(nid_persona) {
  try {
    const sql = "select s.nid_persona, s.num_socio, date_format(s.fecha_alta, '%Y-%m-%d') fecha_alta, date_format(s.fecha_baja, '%Y-%m-%d') fecha_baja, fecha_actualizacion from " +
      constantes.ESQUEMA_BD + ".socios s where nid_persona = " + mysql.escape(nid_persona);
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Mark a socio as dirty (sucio)
async function actualizar_sucio(nid_persona, sucio) {
  try {
    const sql = "update " + constantes.ESQUEMA_BD + ".socios set sucio = " + mysql.escape(sucio) + " where nid_persona = " + mysql.escape(nid_persona);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Retrieve all dirty socios
async function obtener_sucios() {
  try {
    const sql = "select s.* from " + constantes.ESQUEMA_BD + ".socios s where s.sucio = 'S'";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Update the person record with the socio reference
async function actualizar_socio_persona(nid_persona, nid_socio) {
  try {
    const sql = "update " + constantes.ESQUEMA_BD + ".persona set nid_socio = " + mysql.escape(nid_socio) + ", sucio = 'S', fecha_actualizacion = now() where nid = " + mysql.escape(nid_persona);
    await gestor_base_datos.actualiza(sql);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Retrieve a socio, resolving by related person data if necessary
async function recuperar_socio(nid_persona) {
  try {
    let socio = await obtener_socio(nid_persona);
    if (socio.length > 0) {
      return socio[0];
    } else {
      let persona_recuperada = await persona.obtener_persona(nid_persona);
      if (persona_recuperada.nid_socio) {
        let socios_asociado = await obtener_socio(persona_recuperada.nid_socio);
        if (socios_asociado.length > 0) {
          return socios_asociado[0];
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el socio");
  }
}

// Retrieve a socio that is still active (fecha_baja is null or in the future)
async function recuperar_socio_alta(nid_persona) {
  try {
    let socio = await recuperar_socio(nid_persona);
    if (
      socio &&
      (!socio.fecha_baja || new Date(socio.fecha_baja) > new Date())
    ) {
      return socio;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el socio");
  }
}

// Retrieve students without a socio for a given course
async function obtener_alumnos_sin_socio(nid_curso) {
  try {
    const sql = " select p.nid, p.nombre, p.primer_apellido, p.segundo_apellido, p.correo_electronico, p.telefono, p.nif " +
      " from " + constantes.ESQUEMA_BD + ".matricula_asignatura ma, " + constantes.ESQUEMA_BD + ".matricula m, " + constantes.ESQUEMA_BD + ".persona p " +
      " where ma.nid_matricula = m.nid and m.nid_curso  = " + mysql.escape(nid_curso) +
      "   and m.nid_persona = p.nid and (ma.fecha_baja is null or ma.fecha_baja > now())" +
      "   and (" +
      "     ( not exists (select 1 from " + constantes.ESQUEMA_BD + ".socios s where p.nid = s.nid_persona and (s.fecha_baja is null or s.fecha_baja > now())) )" +
      "     and (not exists (select 1 from " + constantes.ESQUEMA_BD + ".socios s where p.nid_socio = s.nid_persona and (s.fecha_baja is null or s.fecha_baja > now())))" +
      " ) group by p.nid, p.nombre, p.primer_apellido, p.segundo_apellido, p.correo_electronico, p.telefono, p.nif";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("socio.js -> obtener_alumnos_sin_socio:", error);
    throw "Se ha producido un error al obtener los alumnos sin socio";
  }
}

// Retrieve socios without a payment method
async function obtener_socios_sin_forma_pago() {
  try {
    const sql = "select p.* from " + constantes.ESQUEMA_BD + ".socios s, pasico_gestor.persona p where s.nid_persona = p.nid and s.fecha_baja is null and nid_forma_pago is null";
    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports.existe_socio = existe_socio;
module.exports.registrar_socio = registrar_socio;
module.exports.actualizar_socio = actualizar_socio;

module.exports.obtener_socios = obtener_socios;
module.exports.obtener_socios_alta = obtener_socios_alta;
module.exports.obtener_socios_baja = obtener_socios_baja;
module.exports.obtener_socio = obtener_socio;
module.exports.actualizar_sucio = actualizar_sucio;
module.exports.obtener_sucios = obtener_sucios;
module.exports.actualizar_socio_persona = actualizar_socio_persona;

module.exports.recuperar_socio = recuperar_socio;
module.exports.recuperar_socio_alta = recuperar_socio_alta;
module.exports.obtener_alumnos_sin_socio = obtener_alumnos_sin_socio;
module.exports.obtener_socios_sin_forma_pago = obtener_socios_sin_forma_pago;