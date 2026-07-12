const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const servicePersona = require("../services/servicePersona.js");
const gestor_base_datos = require("./base_datos.js");

async function requiere_actualizar_usuario(nidPersona, fechaActualizacion) {
  try {
    const consulta =
      "select count(*) num " +
      "from " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where p.nid " +
      conexion.dbConn.escape(nidPersona) +
      "  and p.fecha_actualizacion > " +
      conexion.dbConn.escape(fechaActualizacion);
    const results = await gestor_base_datos.consulta(consulta);
    return results[0]["num"] > 0;
  } catch (error) {
    console.log("Error al comprobar si requiere actualización: " + error);
    throw new Error("Error al comprobar si requiere actualización");
  }
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO); // Crear un objeto Date a partir de la fecha ISO
  const dia = fecha.getDate(); // Obtener el día
  const mes = fecha.getMonth() + 1; // Obtener el mes (0-11, por eso sumamos 1)
  const anio = fecha.getFullYear(); // Obtener el año

  // Formatear la fecha como "DD/MM/YYYY"
  return `${anio}-${mes.toString().padStart(2, "0")}-${dia
    .toString()
    .padStart(2, "0")}`;
}

async function actualizar_persona_objeto(persona) {
  try {
    const actualizarSQL =
      "update " +
      constantes.ESQUEMA_BD +
      ".persona set " +
      "nombre = " +
      conexion.dbConn.escape(persona.nombre) +
      ", " +
      "primer_apellido = " +
      conexion.dbConn.escape(persona.primer_apellido) +
      ", " +
      "segundo_apellido = " +
      conexion.dbConn.escape(persona.segundo_apellido) +
      ", " +
      "correo_electronico = " +
      conexion.dbConn.escape(persona.correo_electronico) +
      ", " +
      "fecha_nacimiento = " +
      conexion.dbConn.escape(formatearFecha(persona.fecha_nacimiento)) +
      ", " +
      "nif = " +
      conexion.dbConn.escape(persona.nif) +
      ", " +
      "nid_padre = " +
      conexion.dbConn.escape(persona.nid_padre) +
      ", " +
      "nid_madre = " +
      conexion.dbConn.escape(persona.nid_madre) +
      ", " +
      "telefono = " +
      conexion.dbConn.escape(persona.telefono) +
      ", " +
      "fecha_actualizacion = now() " +
      " where nid = " +
      conexion.dbConn.escape(persona.nid_persona);

    const results = await gestor_base_datos.actualiza(actualizarSQL);
    return results;
  } catch (error) {
    console.log("Error al actualizar la persona: " + error);
    throw new Error("Error al actualizar la persona");
  }
}

async function actualizar_personas_sucias() {
  try {
    let respuesta = await servicePersona.obtenerPersonasSucias();

    let personas_sucias = respuesta.personas;
    if (personas_sucias.length === 0) {
      return;
    }
    for (let i = 0; i < personas_sucias.length; i++) {
      console.log("Actualizar persona " + personas_sucias[i].nid_persona);
      await actualizar_persona_objeto(personas_sucias[i]);
      console.log("Limpiar persona " + personas_sucias[i].nid_persona);
      await servicePersona.limpiarPersona(personas_sucias[i].nid_persona);
    }
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

async function existe_nif(nif) {
  try {
    await actualizar_personas_sucias();

    if (!nif || nif.length === 0) {
      return false;
    } else {
      const sql =
        "select count(*) cont from " +
        constantes.ESQUEMA_BD +
        ".persona where nif = " +
        conexion.dbConn.escape(nif);
      const results = await gestor_base_datos.consulta(sql);
      return results[0]["cont"] > 0;
    }
  } catch (error) {
    console.log("Error al comprobar si existe el NIF: " + error);
    throw new Error("Error al comprobar si existe el NIF");
  }
}

async function valida_nif(nif) {
  try {
    let bExisteNif = await existe_nif(nif);
    if (!bExisteNif) {
      const sql =
        "select " +
        constantes.ESQUEMA_BD +
        ".comprueba_nif(" +
        conexion.dbConn.escape(nif) +
        ") valido from dual";

      const results = await gestor_base_datos.consulta(sql);
      return results[0]["valido"] == "S";
    } else {
      throw new Error("El NIF/NIE ya existe");
    }
  } catch (error) {
    console.log("persona.js -> valida_nif Error al validar el NIF: " + error);
    throw new Error("Error al validar el NIF");
  }
}

async function existe_nid(nid_persona) {
  try {
    await actualizar_personas_sucias();
    const sql =
      "select count(*) cont from " +
      constantes.ESQUEMA_BD +
      ".persona where nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["cont"] > 0;
  } catch (error) {
    console.log("Error al comprobar si existe el NID: " + error);
    throw new Error("Error al comprobar si existe el NID");
  }
}

async function obtener_persona_apellidos(primer_apellido, segundo_apellido) {
  try {
    await actualizar_personas_sucias();
    const sql =
      "select concat(nombre, ' ', primer_apellido, ' ', segundo_apellido) etiqueta from " +
      constantes.ESQUEMA_BD +
      ".persona where upper(primer_apellido) = upper(" +
      conexion.dbConn.escape(primer_apellido) +
      ") and ifnull(upper(segundo_apellido), '') = ifnull(upper(" +
      conexion.dbConn.escape(segundo_apellido) +
      "), '')";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener persona por apellidos: " + error);
    throw new Error("Error al obtener persona por apellidos");
  }
}

async function existe_persona(
  nombre,
  primer_apellido,
  segundo_apellido,
  fecha_nacimiento,
) {
  try {
    await actualizar_personas_sucias();
    const sql =
      "select count(*) cont from " +
      constantes.ESQUEMA_BD +
      ".persona " +
      " where " +
      constantes.ESQUEMA_BD +
      ".initcap(nombre) = " +
      constantes.ESQUEMA_BD +
      ".initcap( " +
      conexion.dbConn.escape(nombre) +
      ") " +
      " and " +
      constantes.ESQUEMA_BD +
      ".initcap(primer_apellido) = " +
      constantes.ESQUEMA_BD +
      ".initcap( " +
      conexion.dbConn.escape(primer_apellido) +
      ") " +
      " and " +
      constantes.ESQUEMA_BD +
      ".initcap(segundo_apellido) = " +
      constantes.ESQUEMA_BD +
      ".initcap( " +
      conexion.dbConn.escape(segundo_apellido) +
      ") " +
      " and fecha_nacimiento = " +
      "str_to_date(nullif(" +
      conexion.dbConn.escape(fecha_nacimiento) +
      ", '') , '%Y-%m-%d')";

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["cont"] > 0;
  } catch (error) {
    console.log("Error al comprobar si existe la persona: " + error);
    throw new Error("Error al comprobar si existe la persona");
  }
}

async function registrar_persona(
  nombre,
  primer_apellido,
  segundo_apellido,
  telefono,
  fecha_nacimiento,
  nif,
  correo_electronico,
  codigo,
) {
  try {
    let bExiste_nif = await existe_nif(nif);
    let bExiste_persona = await existe_persona(
      nombre,
      primer_apellido,
      segundo_apellido,
      fecha_nacimiento,
    );
    if (!bExiste_nif && !bExiste_persona) {
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif, correo_electronico, codigo) " +
        " values(" +
        constantes.ESQUEMA_BD +
        ".initcap(" +
        conexion.dbConn.escape(nombre) +
        "), " +
        constantes.ESQUEMA_BD +
        ".initcap(" +
        conexion.dbConn.escape(primer_apellido) +
        "), " +
        constantes.ESQUEMA_BD +
        ".initcap(" +
        conexion.dbConn.escape(segundo_apellido) +
        ")," +
        "cast(nullif(cast(" +
        conexion.dbConn.escape(telefono) +
        " as char), '') as unsigned)" +
        "," +
        "str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_nacimiento) +
        ", '') , '%Y-%m-%d')" +
        ", " +
        "nullif(" +
        conexion.dbConn.escape(nif) +
        ", ''), " +
        conexion.dbConn.escape(correo_electronico) +
        "," +
        "nullif(cast(" +
        conexion.dbConn.escape(codigo) +
        " as char), ''))";
      const results = await gestor_base_datos.actualiza(sql);
      await actualizar_sucio(results.insertId, "S");
      return results.insertId;
    } else if (bExiste_nif) {
      throw new Error("Ya existe un nif registrado para esa persona");
    } else {
      throw new Error(
        "Existe una persona con mismo nombre, apellidos y fecha de nacimiento",
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar la persona");
  }
}

async function obtener_nid_persona(nif) {
  try {
    bExiste = await existe_nif(nif);
    if (bExiste) {
      const sql =
        "select nid from " +
        constantes.ESQUEMA_BD +
        ".persona where nif = " +
        conexion.dbConn.escape(nif);

      const results = await gestor_base_datos.consulta(sql);
      if (results.length < 1) {
        return "";
      } else {
        return results[0]["nid"];
      }
    } else {
      return "";
    }
  } catch (error) {
    console.log("Error al obtener el nid de la persona: " + error);
    throw new Error("Error al obtener el nid de la persona");
  }
}

async function obtener_padre(nid_persona) {
  try {
    bExiste = await existe_nid(nid_persona);
    if (bExiste) {
      const sql =
        "select nid_padre from " +
        constantes.ESQUEMA_BD +
        ".persona where nid = " +
        conexion.dbConn.escape(nid_persona);
      const results = await gestor_base_datos.consulta(sql);
      if (results.length < 1) {
        console.log("Error: No encontrada persona");
        throw new Error("No encontrada persona");
      } else {
        return results[0]["nid_padre"];
      }
    } else {
      throw new Error("No existe el nid de la persona");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el padre de la persona");
  }
}

async function obtener_madre(nid_persona) {
  try {
    bExiste = await existe_nid(nid_persona);
    if (bExiste) {
      const sql =
        "select nid_madre from " +
        constantes.ESQUEMA_BD +
        ".persona where nid = " +
        conexion.dbConn.escape(nid_persona);

      const results = await gestor_base_datos.consulta(sql);
      if (results.length < 1) {
        console.log("Error al obtener la madre de la persona: " + sql);
        throw new Error("Error al obtener la madre de la persona");
      } else {
        return results[0]["nid_madre"];
      }
    }
    throw new Error("No existe el nid de la persona");
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener la madre de la persona");
  }
}

async function obtener_hijos(nid_persona) {
  try {
    bExiste = await existe_nid(nid_persona);

    if (bExiste) {
      const sql =
        "select concat(ifnull(p.nif, ''), ' ',  ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ' , ifnull(p.segundo_apellido, '')) etiqueta, p.* from " +
        constantes.ESQUEMA_BD +
        ".persona p where nid_madre = " +
        conexion.dbConn.escape(nid_persona) +
        " or nid_padre = " +
        conexion.dbConn.escape(nid_persona);

      const results = await gestor_base_datos.consulta(sql);
      return results;
    } else {
      throw new Error("No existe el nid de la persona");
    }
  } catch (error) {
    console.log("Error al obtener los hijos de la persona: " + error);
    throw new Error("Error al obtener los hijos de la persona");
  }
}

async function registrar_padre(nid_persona, nid_padre) {
  try {
    bExiste = await existe_nid(nid_persona);

    if (bExiste) {
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".persona set nid_padre = nullif(cast(" +
        conexion.dbConn.escape(nid_padre) +
        " as char), ''), " +
        " fecha_actualizacion = now()" +
        " where nid = " +
        conexion.dbConn.escape(nid_persona);

      const results = await gestor_base_datos.actualiza(sql);
      return results;
    } else {
      throw new Error("Error al registrar el padre");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar el padre");
  }
}

async function registrar_madre(nid_persona, nid_madre) {
  try {
    bExiste = await existe_nid(nid_persona);

    if (bExiste) {
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".persona set nid_madre =  nullif(cast(" +
        conexion.dbConn.escape(nid_madre) +
        " as char), ''), " +
        " fecha_actualizacion = now()" +
        " where nid = " +
        conexion.dbConn.escape(nid_persona);

      const results = await gestor_base_datos.actualiza(sql);
      return results;
    } else {
      console.log(
        "Error al registrar la madre: No existe el nid de la persona",
      );
      throw new Error("Error al registrar la madre");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar la madre");
  }
}

async function obtener_personas() {
  try {
    await actualizar_personas_sucias();

    const sql =
      "select concat(ifnull(p.nif, ''), ' ',  ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ' , ifnull(p.segundo_apellido, '')) etiqueta, p.* from " +
      constantes.ESQUEMA_BD +
      ".persona p";
    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      throw new Error("No se han encontrado personas");
    } else {
      return results;
    }
  } catch (error) {
    console.log("Error al obtener las personas: " + error);
    throw new Error("Error al obtener las personas");
  }
}

async function obtener_todas_personas() {
  try {
    await actualizar_personas_sucias();

    const sql = "select p.* from " + constantes.ESQUEMA_BD + ".persona p";
    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      throw new Error("No se han encontrado personas");
    } else {
      return results;
    }
  } catch (error) {
    console.log("Error al obtener todas las personas: " + error);
    throw new Error("Error al obtener todas las personas");
  }
}

async function obtener_persona(nid) {
  try {
    await actualizar_personas_sucias();
    const sql =
      "select concat(ifnull(p.nif, ''), ' ',  ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ' , ifnull(p.segundo_apellido, '')) etiqueta, p.* from " +
      constantes.ESQUEMA_BD +
      ".persona p where nid = " +
      conexion.dbConn.escape(nid);
    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      throw new Error("No se ha encontrado la persona");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("Error al obtener la persona: " + error);
    throw new Error("Error al obtener la persona");
  }
}

async function obtener_objeto_persona(nid) {
  try {
    await actualizar_personas_sucias();
    const sql =
      "select p.* from " +
      constantes.ESQUEMA_BD +
      ".persona p where nid = " +
      conexion.dbConn.escape(nid);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      throw new Error("No se ha encontrado la persona");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("Error al obtener el objeto persona: " + error);
    throw new Error("Error al obtener el objeto persona");
  }
}

async function actualizar_persona_interfaz(persona) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".persona set " +
      "nombre = " +
      conexion.dbConn.escape(persona.nombre) +
      ", " +
      "primer_apellido = " +
      conexion.dbConn.escape(persona.primer_apellido) +
      ", " +
      "segundo_apellido = " +
      conexion.dbConn.escape(persona.segundo_apellido) +
      ", " +
      "correo_electronico = ifnull(nullif(" +
      conexion.dbConn.escape(persona.correo_electronico) +
      ", ''), correo_electronico), " +
      "fecha_nacimiento = ifnull(nullif(" +
      conexion.dbConn.escape(formatearFecha(persona.fecha_nacimiento)) +
      ", ''), fecha_nacimiento), " +
      "nif = ifnull(nullif(" +
      conexion.dbConn.escape(persona.nif) +
      ", ''), nif), " +
      "telefono = ifnull(nullif(" +
      conexion.dbConn.escape(persona.telefono) +
      ", ''), telefono)" +
      ", sucio = 'S', fecha_actualizacion = now() " +
      "where nid = " +
      conexion.dbConn.escape(persona.nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar la persona desde la interfaz: " + error);
    throw new Error("Error al actualizar la persona desde la interfaz");
  }
}

async function actualizar_persona(
  nid,
  nif,
  nombre,
  primer_apellido,
  segundo_apellido,
  telefono,
  fecha_nacimiento,
  correo_electronico,
  codigo,
  nid_socio,
) {
  try {
    let bExistePersona = await existe_nid(nid);
    if (bExistePersona) {
      const sql =
        "update " +
        constantes.ESQUEMA_BD +
        ".persona set" +
        " nif = " +
        "nullif(" +
        conexion.dbConn.escape(nif) +
        ", '')" +
        ", nombre = " +
        constantes.ESQUEMA_BD +
        ".initcap(" +
        conexion.dbConn.escape(nombre) +
        ")" +
        ", primer_apellido = " +
        constantes.ESQUEMA_BD +
        ".initcap(" +
        conexion.dbConn.escape(primer_apellido) +
        ")" +
        ", segundo_apellido = " +
        constantes.ESQUEMA_BD +
        ".initcap(" +
        conexion.dbConn.escape(segundo_apellido) +
        ")" +
        ", telefono = cast(nullif(cast(" +
        conexion.dbConn.escape(telefono) +
        " as char), '') as unsigned)" +
        ", fecha_nacimiento = str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_nacimiento) +
        ", '') , '%Y-%m-%d')" +
        ", correo_electronico = nullif(" +
        conexion.dbConn.escape(correo_electronico) +
        ", '')" +
        ", codigo = " +
        "nullif(cast(" +
        conexion.dbConn.escape(codigo) +
        " as char), '')" +
        ", nid_socio = " +
        "nullif(cast(" +
        conexion.dbConn.escape(nid_socio) +
        " as char), ''), " +
        " fecha_actualizacion = now(), sucio = 'S' " +
        " where nid = " +
        conexion.dbConn.escape(nid);

      const results = await gestor_base_datos.actualiza(sql);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error al actualizar la persona: " + error);
    return false;
  }
}

async function valida_iban(iban) {
  try {
    const sql =
      "select " +
      constantes.ESQUEMA_BD +
      ".comprueba_iban(" +
      conexion.dbConn.escape(iban) +
      ") valido from dual";

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["valido"] == "S";
  } catch (error) {
    console.log("Error al validar el IBAN: " + error);

    throw new Error("Error al validar el IBAN");
  }
}

async function registrar_forma_pago(nid_titular, iban) {
  try {
    bExistePersona = await existe_nid(nid_titular);
    bIbanValido = await valida_iban(iban);
    if (!bIbanValido) {
      throw new Error("El IBAN no es válido");
    } else if (bExistePersona) {
      const sql =
        "insert into " +
        constantes.ESQUEMA_BD +
        ".forma_pago(nid_titular, iban) values(" +
        conexion.dbConn.escape(nid_titular) +
        ", " +
        conexion.dbConn.escape(iban) +
        ")";

      const results = await gestor_base_datos.actualiza(sql);

      return results.insertId;
    } else {
      console.log("No existe el titular de la forma de pago");
      throw new Error("No existe el titular de la forma de pago");
    }
  } catch (error) {
    console.log("Error al registrar la forma de pago: " + error);
    throw new Error("Error al registrar la forma de pago");
  }
}

async function obtener_forma_pago(nid_titular) {
  try {
    const sql =
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido, ' - ', iban) etiqueta, fp.nid from " +
      constantes.ESQUEMA_BD +
      ".forma_pago fp, " +
      constantes.ESQUEMA_BD +
      ".persona p where fp.nid_titular = p.nid and fp.nid_titular = " +
      conexion.dbConn.escape(nid_titular);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener la forma de pago: " + error);
    throw new Error("Error al obtener la forma de pago");
  }
}

async function tiene_forma_pago(nid_titular) {
  try {
    const sql =
      "select count(*) cont from " +
      constantes.ESQUEMA_BD +
      ".persona where nid_forma_pago is not null";

    const results = await gestor_base_datos.consulta(sql);
    return results[0]["cont"] > 0;
  } catch (error) {
    console.log("Error al comprobar si tiene forma de pago: " + error);
    throw new Error("Error al comprobar si tiene forma de pago");
  }
}

async function obtener_pago_persona(nid_persona) {
  try {
    const sql =
      "select nid_forma_pago from " +
      constantes.ESQUEMA_BD +
      ".persona p where p.nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results[0];
  } catch (error) {
    console.log("Error al obtener el pago de la persona: " + error);
    throw new Error("Error al obtener el pago de la persona");
  }
}

async function obtener_formas_pago_persona(nid_persona) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".forma_pago fp " +
      " where fp.nid_titular = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener las formas de pago de la persona: " + error);
    throw new Error("Error al obtener las formas de pago de la persona");
  }
}

async function obtener_forma_pago_nid(nid_forma_pago) {
  try {
    const sql =
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido, ' - ', iban) etiqueta, fp.* from " +
      constantes.ESQUEMA_BD +
      ".forma_pago fp, " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where fp.nid_titular = p.nid and fp.nid = " +
      conexion.dbConn.escape(nid_forma_pago);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      console.log("No encontrada forma de pago");
      throw new Error("No encontrada forma de pago");
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("Error al obtener la forma de pago por nid: " + error);
    throw new Error("Error al obtener la forma de pago por nid");
  }
}

async function obtener_formas_pago() {
  try {
    const sql =
      "select concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido, ' - ', iban) etiqueta, fp.nid from " +
      constantes.ESQUEMA_BD +
      ".forma_pago fp, " +
      constantes.ESQUEMA_BD +
      ".persona p " +
      "where fp.nid_titular = p.nid and fp.activo = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener las formas de pago: " + error);
    throw new Error("Error al obtener las formas de pago");
  }
}

async function asociar_pago_persona(nid_persona, nid_forma_pago) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".persona set nid_forma_pago = " +
      conexion.dbConn.escape(nid_forma_pago) +
      " where nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al asociar el pago a la persona: " + error);
    throw new Error("Error al asociar el pago a la persona");
  }
}

async function actualizar_user_pasarela_pago(nid_persona, nid_user_pasarela) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".persona set nid_pasarela_pago = " +
      conexion.dbConn.escape(nid_user_pasarela) +
      " where nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar el usuario de pasarela de pago: " + error);
    throw new Error("Error al actualizar el usuario de pasarela de pago");
  }
}

async function actualizar_metodo_pasarela_pago(
  nid_forma_pago,
  nid_metodo_pasarela_pago,
) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".forma_pago set nid_metodo_pasarela_pago = " +
      conexion.dbConn.escape(nid_metodo_pasarela_pago) +
      " where nid = " +
      conexion.dbConn.escape(nid_forma_pago);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar el método de pasarela de pago: " + error);
    throw new Error("Error al actualizar el método de pasarela de pago");
  }
}

async function actualizar_forma_pago(nid_forma_pago, activo) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".forma_pago set activo = " +
      conexion.dbConn.escape(activo) +
      " where nid = " +
      conexion.dbConn.escape(nid_forma_pago);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar la forma de pago: " + error);
    throw new Error("Error al actualizar la forma de pago");
  }
}

async function existe_forma_pago(nid_forma_pago) {
  try {
    const sql =
      "select count(*) num from " +
      constantes.ESQUEMA_BD +
      ".forma_pago where nid = " +
      conexion.dbConn.escape(nid_forma_pago);

    const results = await gestor_base_datos.consulta(sql);
    return Number(results[0]["num"]) > 0;
  } catch (error) {
    console.log("Error al comprobar si existe la forma de pago: " + error);
    throw new Error("Error al comprobar si existe la forma de pago");
  }
}

async function actualizar_sucio(nid_persona, sucio) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".persona set sucio = " +
      conexion.dbConn.escape(sucio) +
      " where nid = " +
      conexion.dbConn.escape(nid_persona);

    const results = await gestor_base_datos.actualiza(sql);
    return results;
  } catch (error) {
    console.log("Error al actualizar el sucio: " + error);
    throw new Error("Error al actualizar el sucio");
  }
}

async function obtener_personas_sucias() {
  try {
    const sql =
      "select p.* from " +
      constantes.ESQUEMA_BD +
      ".persona p where p.sucio = 'S'";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener las personas sucias: " + error);
    throw new Error("Error al obtener las personas sucias");
  }
}

async function obtener_persona_nif(nif) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".persona where nif = " +
      conexion.dbConn.escape(nif);

    const results = await gestor_base_datos.consulta(sql);
    if (results.length < 1) {
      return null;
    } else {
      return results[0];
    }
  } catch (error) {
    console.log("Error al obtener la persona por nif: " + error);
    throw new Error("Error al obtener la persona por nif");
  }
}

async function obtener_personas_nombre(
  nombre,
  primer_apellido,
  segundo_apellido,
) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".persona where upper(nombre) = upper(" +
      conexion.dbConn.escape(nombre) +
      ") and upper(primer_apellido) = upper(" +
      conexion.dbConn.escape(primer_apellido) +
      ") and ifnull(upper(segundo_apellido), '') = ifnull(upper(" +
      conexion.dbConn.escape(segundo_apellido) +
      "), '')";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener la persona por nombre: " + error);
    throw new Error("Error al obtener la persona por nombre");
  }
}

async function obtener_personas_apellidos(primer_apellido, segundo_apellido) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".persona where upper(primer_apellido) = upper(" +
      conexion.dbConn.escape(primer_apellido) +
      ") and ifnull(upper(segundo_apellido), '') = ifnull(upper(" +
      conexion.dbConn.escape(segundo_apellido) +
      "), '')";

    const results = await gestor_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("Error al obtener la persona por apellidos: " + error);
    throw new Error("Error al obtener la persona por apellidos");
  }
}

module.exports.registrar_persona = registrar_persona;
module.exports.actualizar_persona = actualizar_persona;
module.exports.actualizar_persona_interfaz = actualizar_persona_interfaz;

module.exports.existe_nif = existe_nif;
module.exports.valida_nif = valida_nif;
module.exports.existe_nid = existe_nid;
module.exports.obtener_persona_apellidos = obtener_persona_apellidos;
module.exports.obtener_nid_persona = obtener_nid_persona;
module.exports.obtener_objeto_persona = obtener_objeto_persona;

module.exports.obtener_padre = obtener_padre;
module.exports.obtener_madre = obtener_madre;
module.exports.obtener_hijos = obtener_hijos;

module.exports.registrar_padre = registrar_padre;
module.exports.registrar_madre = registrar_madre;

module.exports.obtener_personas = obtener_personas;
module.exports.obtener_todas_personas = obtener_todas_personas;
module.exports.obtener_persona = obtener_persona;

module.exports.registrar_forma_pago = registrar_forma_pago;
module.exports.obtener_forma_pago = obtener_forma_pago;
module.exports.obtener_formas_pago_persona = obtener_formas_pago_persona;
module.exports.obtener_forma_pago_nid = obtener_forma_pago_nid;
module.exports.tiene_forma_pago = tiene_forma_pago;
module.exports.obtener_pago_persona = obtener_pago_persona;
module.exports.obtener_formas_pago = obtener_formas_pago;
module.exports.asociar_pago_persona = asociar_pago_persona;

module.exports.actualizar_user_pasarela_pago = actualizar_user_pasarela_pago;
module.exports.actualizar_metodo_pasarela_pago =
  actualizar_metodo_pasarela_pago;
module.exports.actualizar_forma_pago = actualizar_forma_pago;

module.exports.existe_forma_pago = existe_forma_pago;
module.exports.actualizar_sucio = actualizar_sucio;

module.exports.obtener_personas_sucias = obtener_personas_sucias;

module.exports.obtener_persona_nif = obtener_persona_nif;
module.exports.obtener_personas_nombre = obtener_personas_nombre;
module.exports.obtener_personas_apellidos = obtener_personas_apellidos;
