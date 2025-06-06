const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const persona = require("./persona.js");
const gestor_matricula = require("./matricula.js");
const parametros = require("./parametros.js");

const {
  obtener_instrumentos,
  registrar_instrumento_persona,
} = require("./musico.js");

function existe_persona_sin_foma_pago() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) num " +
        " from " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        "where m.nid_persona = p.nid and m.nid = ma.nid_matricula and nid_forma_pago is null",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]["num"] > 0);
        }
      }
    );
  });
}

function existe_socio(nid_forma_pago) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select count(*) cont " +
        "from " +
        constantes.ESQUEMA_BD +
        ".socios s, " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        "where s.nid_persona = p.nid " +
        "and p.nid_forma_pago = " +
        conexion.dbConn.escape(nid_forma_pago),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]["cont"] > 0);
        }
      }
    );
  });
}

function obtener_matricula_asignatura_activa(v_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select a.precio, m.precio_manual, a.nid " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        "where ma.nid_matricula = m.nid " +
        "and ma.nid_asignatura = a.nid " +
        "and m.nid_persona = " +
        conexion.dbConn.escape(v_persona) +
        " " +
        "and m.nid_curso = (select max(nid) from " +
        constantes.ESQUEMA_BD +
        ".curso) " +
        "and (ma.fecha_baja is null or ma.fecha_baja < sysdate())",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_matricula_asignatura(nid_matricula) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select a.precio, m.precio_manual, a.nid " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma, " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".asignatura a " +
        "where ma.nid_matricula = m.nid " +
        "and ma.nid_asignatura = a.nid " +
        "and m.nid = " +
        conexion.dbConn.escape(nid_matricula),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_siguiente_lote() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      " select ifnull(max(lote), 0) + 1 lote from pasico_gestor.remesa",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]["lote"]);
        }
      }
    );
  });
}

function registrar_remesa(
  v_persona,
  v_concepto,
  v_siguiente_lote,
  v_precio,
  v_nid_forma_pago
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      let persona_recuperada = await persona.obtener_persona(v_persona);

      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".remesa(nid_forma_pago, nid_persona, concepto, fecha, lote, precio, estado) " +
          "values(" +
          conexion.dbConn.escape(v_nid_forma_pago) +
          ", " +
          conexion.dbConn.escape(v_persona) +
          ", " +
          conexion.dbConn.escape(v_concepto) +
          " , sysdate(), " +
          conexion.dbConn.escape(v_siguiente_lote) +
          ", " +
          conexion.dbConn.escape(v_precio) +
          ", '" +
          constantes.ESTADO_REMESA_PENDIENTE +
          "')",
        (error, results, fields) => {
          if (error) {
            conexion.dbConn.rollback();
            console.log(error);
            reject();
          } else {
            conexion.dbConn.commit();
            resolve(results.insertId);
          }
        }
      );
    });
  });
}

function registrar_linea_remesa(v_remesa, v_precio, v_concepto) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".linea_remesa(nid_remesa, concepto, precio) " +
          "values(" +
          conexion.dbConn.escape(v_remesa) +
          ", " +
          conexion.dbConn.escape(v_concepto) +
          ", " +
          conexion.dbConn.escape(v_precio) +
          ")",
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve(results.insertId);
          }
        }
      );
    });
  });
}

function registrar_descuento(nid_remesa, concepto) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "insert into " +
        constantes.ESQUEMA_BD +
        ".remesa_descuento(nid_remesa, concepto) values(" +
        conexion.dbConn.escape(nid_remesa) +
        ", " +
        conexion.dbConn.escape(concepto) +
        ")",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          conexion.dbConn.rollback();
          reject();
        } else {
          conexion.dbConn.commit();
          resolve();
        }
      }
    );
  });
}

function obtener_matriculas_activas(nid_socio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select  p.nid nid_persona, m.nid nid_matricula, p.nid_forma_pago " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma " +
        "where m.nid_persona = p.nid " +
        "and m.nid = ma.nid_matricula " +
        "and m.nid_curso = (select max(nid) from " +
        constantes.ESQUEMA_BD +
        ".curso) " +
        "and (nid_persona = " +
        conexion.dbConn.escape(nid_socio) +
        " or nid_socio = " +
        conexion.dbConn.escape(nid_socio) +
        ") " +
        "and (ma.fecha_baja is null or ma.fecha_baja < sysdate()) " +
        "group by p.nid, m.nid, p.nid_forma_pago " +
        "order by p.fecha_nacimiento, p.nid",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_matriculas_activas_fecha(nid_socio, fecha_desde, fecha_hasta) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select  p.nid nid_persona, m.nid nid_matricula, p.nid_forma_pago " +
        "from " +
        constantes.ESQUEMA_BD +
        ".matricula m, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".matricula_asignatura ma " +
        "where m.nid_persona = p.nid " +
        "and m.nid = ma.nid_matricula " +
        "and m.nid_curso = (select max(nid) from " +
        constantes.ESQUEMA_BD +
        ".curso) " +
        "and (nid_persona = " +
        conexion.dbConn.escape(nid_socio) +
        " or nid_socio = " +
        conexion.dbConn.escape(nid_socio) +
        ") " +
        " and (ma.fecha_baja is null or ma.fecha_baja >= " +
        "str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_desde) +
        ", '') , '%Y-%m-%d')) " +
        " and " +
        " ma.fecha_alta <= " +
        "str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_hasta) +
        ", '') , '%Y-%m-%d') " +
        "group by p.nid, m.nid, p.nid_forma_pago " +
        "order by p.fecha_nacimiento, p.nid",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function comprueba_es_socio(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      " select 'S' " +
        "from " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        " where nid = " +
        conexion.dbConn.escape(nid_persona) +
        " and (exists (select '1' " +
        " from " +
        constantes.ESQUEMA_BD +
        ".socios s where s.nid_persona = p.nid) " +
        " or exists (select '1' from " +
        constantes.ESQUEMA_BD +
        ".socios s where s.nid_persona = p.nid_socio))",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results.length > 0);
        }
      }
    );
  });
}

function obtener_nid_socio(nid_persona) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select nid_persona from " +
        constantes.ESQUEMA_BD +
        ".socios where nid_persona = " +
        conexion.dbConn.escape(nid_persona),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          if (results.length > 0) {
            resolve(results[0]["nid_persona"]);
          } else {
            conexion.dbConn.query(
              "select nid_socio from " +
                constantes.ESQUEMA_BD +
                ".persona where nid = " +
                conexion.dbConn.escape(nid_persona),
              (error, results, fields) => {
                if (error) {
                  console.log(error);
                  reject(error);
                } else {
                  resolve(results[0]["nid_socio"]);
                }
              }
            );
          }
        }
      }
    );
  });
}

async function precio_matricula(nid_matricula, num_familiar) {
  try {
    var valor_recuperado = await parametros.obtener_valor(
      "REBAJA_VIENTO_CUERDA"
    );
    const REBAJA_VIENTO_CUERDA = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor("SUMA_PRECIO_NO_SOCIO");
    const SUMA_PRECIO_NO_SOCIO = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor(
      "PRECIO_INSTRUMENTO_BANDA"
    );
    const PRECIO_INSTRUMENTO_BANDA = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor(
      "PRECIO_INSTRUMENTO_NO_BANDA"
    );
    const PRECIO_INSTRUMENTO_NO_BANDA = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor("PRECIO_LENGUAJE");
    const PRECIO_LENGUAJE = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor(
      "PORCENTAJE_DESCUENTO_FAMILIA"
    );
    const PORCENTAJE_FAMILIA = valor_recuperado["valor"];

    const ASIGNATURA_INSTRUMENTO_BANDA = 1;
    const ASIGNATURA_INSTRUMENTO_NO_BANDA = 2;
    const ASIGNATURA_LENGUAJE = 0;
    const ASIGNATURA_BANDA = 3;

    let v_precio_persona = 0;

    let instrumento_banda = 0;
    let instrumento_cuerda = 0;

    let asignaturas_precio =
      await gestor_matricula.obtener_asignaturas_matricula_activas(
        nid_matricula
      );
    let datos_matricula = await gestor_matricula.obtener_matricula(
      nid_matricula
    );

    var resumen_matricula = new Object();
    resumen_matricula.precio = 0;
    resumen_matricula.nid_matricula = nid_matricula;

    var info = "";

    let descuentos = [];
    let linea_remesas = [];

    // Obtiene si es socio //
    var es_socio = await comprueba_es_socio(datos_matricula["nid_persona"]);

    if (
      datos_matricula["precio_manual"] != null &&
      datos_matricula["precio_manual"] != ""
    ) {
      var linea_remesa = new Object();

      var comentario_manual = datos_matricula["comentario_precio_manual"];

      if (
        comentario_manual === null ||
        comentario_manual === undefined ||
        comentario_manual.length == 0
      ) {
        comentario_manual = "";
      } else {
        comentario_manual = " - " + comentario_manual;
      }

      linea_remesa.precio = datos_matricula["precio_manual"];
      linea_remesa.concepto =
        "Precio para el alumno " +
        datos_matricula["nombre_alumno"] +
        comentario_manual;

      linea_remesas.push(linea_remesa);

      resumen_matricula.precio = linea_remesa.precio;
    } else {
      for (let z = 0; z < asignaturas_precio.length; z++) {
        v_precio_persona = 0;
        var linea_remesa = new Object();

        v_tipo_asignatura = asignaturas_precio[z]["tipo_asignatura"];

        if (v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_BANDA && es_socio) {
          instrumento_banda = 1;
          v_precio_persona = PRECIO_INSTRUMENTO_BANDA;
          info = "Precio Instrumento de Banda";
        } else if (
          v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_BANDA &&
          !es_socio
        ) {
          v_precio_persona = PRECIO_INSTRUMENTO_NO_BANDA;
          info =
            "Precio Instrumento no de Banda al no estar asociado a un Socio";
        } else if (v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_NO_BANDA) {
          instrumento_cuerda = 1;
          v_precio_persona = PRECIO_INSTRUMENTO_NO_BANDA;
          info = "Precio Instrumento no de Banda";
        } else if (v_tipo_asignatura == ASIGNATURA_LENGUAJE) {
          v_precio_persona = PRECIO_LENGUAJE;
          info = "Precio Lenguaje Musical";
        } else if ((v_tipo_asignatura = ASIGNATURA_BANDA)) {
          v_precio_persona = 0;
          info = "Precio Banda / Conjunto";
        }

        linea_remesa.precio = v_precio_persona;
        linea_remesa.concepto =
          "Precio para el alumno " +
          datos_matricula["nombre_alumno"] +
          " en la asignatura " +
          asignaturas_precio[z]["nombre_asignatura"] +
          " (" +
          info +
          ")";
        linea_remesas.push(linea_remesa);

        resumen_matricula.precio =
          parseFloat(v_precio_persona) + parseFloat(resumen_matricula.precio);
      }

      // Descuento por familia //
      if (num_familiar > 0 && es_socio) {
        let descuento_familiar = parseFloat(PORCENTAJE_FAMILIA) * num_familiar;
        let num_miembro = num_familiar + 1;
        resumen_matricula.precio =
          parseFloat(resumen_matricula.precio) * (1 - descuento_familiar / 100);

        descuentos.push(
          "Descuento por familiar " +
            descuento_familiar +
            "% " +
            num_miembro +
            "º miembro"
        );
      }

      // Se comprueba si se añade el extra por no ser socio //
      if (!es_socio) {
        resumen_matricula.precio =
          parseFloat(resumen_matricula.precio) +
          parseFloat(SUMA_PRECIO_NO_SOCIO);
        descuentos.push(
          SUMA_PRECIO_NO_SOCIO + "€ - Precio extra por no ser socio "
        );
      }

      // Descuento por instrumento de banda y cuerda //
      if (instrumento_banda && instrumento_cuerda && es_socio) {
        resumen_matricula.precio =
          parseFloat(resumen_matricula.precio) -
          parseFloat(REBAJA_VIENTO_CUERDA);
        descuentos.push(
          "-" +
            REBAJA_VIENTO_CUERDA +
            "€ - Descuento por instrumento de banda y cuerda"
        );
      }
    }

    resumen_matricula.descuentos = descuentos;
    resumen_matricula.linea_remesas = linea_remesas;

    return resumen_matricula;
  } catch (error) {
    console.log("Error en precio_matricula: ", error);
    throw new Error("Error al calcular el precio de la matrícula");
  }
}

async function precio_matricula_fecha(
  nid_matricula,
  num_familiar,
  fecha_desde,
  fecha_hasta
) {
  try {
    var v_fecha_desde_original = new Date(fecha_desde);
    var v_fecha_hasta_original = new Date(fecha_hasta);

    var v_fecha_desde = v_fecha_desde_original;
    var v_fecha_hasta = v_fecha_hasta_original;

    if (
      v_fecha_desde.getMonth() !== v_fecha_hasta.getMonth() ||
      v_fecha_desde.getFullYear() !== v_fecha_hasta.getFullYear()
    ) {
      throw new Error("Las fechas desde y hasta son de un mes distinto");
    }

    var diasMes = new Date(
      v_fecha_desde.getFullYear(),
      Number(v_fecha_desde.getMonth()) + 1,
      0
    ).getDate();

    var valor_recuperado = await parametros.obtener_valor(
      "REBAJA_VIENTO_CUERDA"
    );
    const REBAJA_VIENTO_CUERDA = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor("SUMA_PRECIO_NO_SOCIO");
    const SUMA_PRECIO_NO_SOCIO = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor(
      "PRECIO_INSTRUMENTO_BANDA"
    );
    const PRECIO_INSTRUMENTO_BANDA = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor(
      "PRECIO_INSTRUMENTO_NO_BANDA"
    );
    const PRECIO_INSTRUMENTO_NO_BANDA = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor("PRECIO_LENGUAJE");
    const PRECIO_LENGUAJE = valor_recuperado["valor"];

    valor_recuperado = await parametros.obtener_valor(
      "PORCENTAJE_DESCUENTO_FAMILIA"
    );
    const PORCENTAJE_FAMILIA = valor_recuperado["valor"];

    const ASIGNATURA_INSTRUMENTO_BANDA = 1;
    const ASIGNATURA_INSTRUMENTO_NO_BANDA = 2;
    const ASIGNATURA_LENGUAJE = 0;
    const ASIGNATURA_BANDA = 3;

    let v_precio_persona = 0;

    let instrumento_banda = 0;
    let instrumento_cuerda = 0;

    let asignaturas_precio =
      await gestor_matricula.obtener_asignaturas_matricula_activas_fecha(
        nid_matricula,
        fecha_desde,
        fecha_hasta
      );
    let datos_matricula = await gestor_matricula.obtener_matricula(
      nid_matricula
    );

    var resumen_matricula = new Object();
    resumen_matricula.precio = 0;
    resumen_matricula.nid_matricula = nid_matricula;

    var info = "";

    let descuentos = [];
    let linea_remesas = [];

    // Obtiene si es socio //
    var es_socio = await comprueba_es_socio(datos_matricula["nid_persona"]);

    if (
      datos_matricula["precio_manual"] != null &&
      datos_matricula["precio_manual"] != ""
    ) {
      var linea_remesa = new Object();

      linea_remesa.precio = datos_matricula["precio_manual"];

      var diferencia_dias = Math.round(
        (v_fecha_hasta - v_fecha_desde) / (24 * 3600 * 1000)
      );

      let proporcion = Math.round(Number(diasMes) / 3);
      let v_diferencia_dias = Number(diferencia_dias);

      let v_precio_persona = Number(linea_remesa.precio);

      if (proporcion > v_diferencia_dias) {
        // Si lleva menos de un tercio de mes, no se cobra el mes
        linea_remesa.precio = 0;
      } else if (proporcion * 2 > v_diferencia_dias) {
        // Si lleva menos de dos tercios de mes, se cobra medio mes
        linea_remesa.precio = v_precio_persona / 2;
      } else {
        linea_remesa.precio = v_precio_persona;
      }

      var comentario_manual = datos_matricula["comentario_precio_manual"];

      if (
        comentario_manual === null ||
        comentario_manual === undefined ||
        comentario_manual.length == 0
      ) {
        comentario_manual = "";
      } else {
        comentario_manual = " - " + comentario_manual;
      }

      linea_remesa.concepto =
        "Precio para el alumno " +
        datos_matricula["nombre_alumno"] +
        comentario_manual;

      linea_remesas.push(linea_remesa);

      resumen_matricula.precio = v_precio_persona;
    } else {
      for (let z = 0; z < asignaturas_precio.length; z++) {
        v_fecha_desde = v_fecha_desde_original;
        v_fecha_hasta = v_fecha_hasta_original;

        let v_cadena_fecha_inicio = asignaturas_precio[z]["fecha_alta"];
        let v_cadena_fecha_fin = asignaturas_precio[z]["fecha_baja"];

        let v_fecha_fin;
        let v_fecha_inicio;

        if (
          v_cadena_fecha_fin !== null &&
          v_cadena_fecha_fin !== undefined &&
          v_cadena_fecha_fin.length > 0
        ) {
          v_fecha_fin = new Date(v_cadena_fecha_fin);

          if (v_fecha_fin < v_fecha_hasta) {
            v_fecha_hasta = v_fecha_fin;
          }
        }

        v_fecha_inicio = new Date(v_cadena_fecha_inicio);

        if (v_fecha_inicio > v_fecha_desde) {
          v_fecha_desde = v_fecha_inicio;
        }

        v_precio_persona = 0;
        var linea_remesa = new Object();

        v_tipo_asignatura = asignaturas_precio[z]["tipo_asignatura"];

        if (v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_BANDA && es_socio) {
          instrumento_banda = 1;
          v_precio_persona = PRECIO_INSTRUMENTO_BANDA;
          info = "Precio Instrumento de Banda";
        } else if (
          v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_BANDA &&
          !es_socio
        ) {
          v_precio_persona = PRECIO_INSTRUMENTO_NO_BANDA;
          info =
            "Precio Instrumento no de Banda al no estar asociado a un Socio";
        } else if (v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_NO_BANDA) {
          instrumento_cuerda = 1;
          v_precio_persona = PRECIO_INSTRUMENTO_NO_BANDA;
          info = "Precio Instrumento no de Banda";
        } else if (v_tipo_asignatura == ASIGNATURA_LENGUAJE) {
          v_precio_persona = PRECIO_LENGUAJE;
          info = "Precio Lenguaje Musical";
        } else if ((v_tipo_asignatura = ASIGNATURA_BANDA)) {
          v_precio_persona = 0;
          info = "Precio Banda / Conjunto";
        }

        var diferencia_dias = Math.round(
          (v_fecha_hasta - v_fecha_desde) / (24 * 3600 * 1000)
        );

        let proporcion = Math.round(Number(diasMes) / 3);
        let v_diferencia_dias = Number(diferencia_dias);

        if (proporcion > v_diferencia_dias) {
          // Si lleva menos de un tercio de mes, no se cobra el mes
          linea_remesa.precio = 0;
        } else if (proporcion * 2 > v_diferencia_dias) {
          // Si lleva menos de dos tercios de mes, se cobra medio mes
          linea_remesa.precio = v_precio_persona / 2;
        } else {
          linea_remesa.precio = v_precio_persona;
        }

        linea_remesa.concepto =
          "Precio para el alumno " +
          datos_matricula["nombre_alumno"] +
          " en la asignatura " +
          asignaturas_precio[z]["nombre_asignatura"] +
          " (" +
          info +
          ")";
        linea_remesas.push(linea_remesa);

        resumen_matricula.precio =
          parseFloat(v_precio_persona) + parseFloat(resumen_matricula.precio);
      }

      // Descuento por familia //
      if (num_familiar > 0 && es_socio) {
        let descuento_familiar = parseFloat(PORCENTAJE_FAMILIA) * num_familiar;
        let num_miembro = num_familiar + 1;
        resumen_matricula.precio =
          parseFloat(resumen_matricula.precio) * (1 - descuento_familiar / 100);

        descuentos.push(
          "Descuento por familiar " +
            descuento_familiar +
            "% " +
            num_miembro +
            "º miembro"
        );
      }

      // Se comprueba si se añade el extra por no ser socio //
      if (!es_socio) {
        resumen_matricula.precio =
          parseFloat(resumen_matricula.precio) +
          parseFloat(SUMA_PRECIO_NO_SOCIO);
        descuentos.push(
          SUMA_PRECIO_NO_SOCIO + "€ - Precio extra por no ser socio "
        );
      }

      // Descuento por instrumento de banda y cuerda //
      if (instrumento_banda && instrumento_cuerda && es_socio) {
        resumen_matricula.precio =
          parseFloat(resumen_matricula.precio) -
          parseFloat(REBAJA_VIENTO_CUERDA);
        descuentos.push(
          "-" +
            REBAJA_VIENTO_CUERDA +
            "€ - Descuento por instrumento de banda y cuerda"
        );
      }
    }

    resumen_matricula.descuentos = descuentos;
    resumen_matricula.linea_remesas = linea_remesas;

    return resumen_matricula;
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar el precio de la mensualidad");
  }
}

function eliminar_descuento_lote(v_lote) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "delete from " +
        constantes.ESQUEMA_BD +
        ".remesa_descuento " +
        " where nid_remesa in (select nid_remesa from " +
        constantes.ESQUEMA_BD +
        ".remesa where lote = " +
        conexion.dbConn.escape(v_lote) +
        ")",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

function eliminar_linea_remesa_lote(v_lote) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "delete from " +
        constantes.ESQUEMA_BD +
        ".linea_remesa " +
        " where nid_remesa in (select nid_remesa from " +
        constantes.ESQUEMA_BD +
        ".remesa where lote = " +
        conexion.dbConn.escape(v_lote) +
        ")",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

function limpiar_lote(v_lote) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(async () => {
      try {
        await eliminar_descuento_lote(v_lote);
        await eliminar_linea_remesa_lote(v_lote);
        conexion.dbConn.query(
          "delete from " +
            constantes.ESQUEMA_BD +
            ".remesa " +
            " where lote = " +
            conexion.dbConn.escape(v_lote),
          (error, results, fields) => {
            if (error) {
              console.log(error);
              reject();
              conexion.dbConn.rollback();
            } else {
              conexion.dbConn.commit();
              resolve();
            }
          }
        );
      } catch (error) {
        conexion.dbConn.rollback();
        reject();
      }
    });
  });
}

async function registrar_remesa_matriculas(v_concepto) {
  try {
    let personas_matricula_activa =
      await gestor_matricula.obtener_personas_con_matricula_activa();
    var v_siguiente_lote = await obtener_siguiente_lote();
    for (let i = 0; i < personas_matricula_activa.length; i++) {
      let nid_persona = personas_matricula_activa[i]["nid"];
      let nid_matricula = personas_matricula_activa[i]["nid_matricula"];

      await registrar_remesa_persona(
        nid_matricula,
        v_concepto,
        v_siguiente_lote
      );
    }

    return;
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar la remesa");
  }
}

async function registrar_remesa_matriculas_fecha(
  v_concepto,
  fecha_desde,
  fecha_hasta
) {
  try {
    let personas_matricula_activa =
      await gestor_matricula.obtener_personas_matricula_activa_fecha(
        fecha_desde,
        fecha_hasta
      );
    var v_siguiente_lote = await obtener_siguiente_lote();
    for (let i = 0; i < personas_matricula_activa.length; i++) {
      let nid_matricula = personas_matricula_activa[i]["nid_matricula"];

      await registrar_remesa_persona_fecha(
        nid_matricula,
        v_concepto,
        v_siguiente_lote,
        fecha_desde,
        fecha_hasta
      );
    }

    return;
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar la remesa");
  }
}

async function registrar_remesa_persona(nid_matricula, v_concepto, lote) {
  try {
    let v_matricula = await gestor_matricula.obtener_matricula(nid_matricula);
    let nid_persona = v_matricula["nid_persona"];

    let bEs_socio = await comprueba_es_socio(nid_persona);
    let persona_recuperada = await persona.obtener_persona(nid_persona);

    if (bEs_socio) {
      let nid_socio = await obtener_nid_socio(nid_persona);
      let v_personas_activas = await obtener_matriculas_activas(nid_socio);

      var v_resumen_matricula = null;

      if (v_personas_activas !== undefined) {
        for (let i = 0; i < v_personas_activas.length; i++) {
          if (v_personas_activas[i]["nid_matricula"] == nid_matricula) {
            v_resumen_matricula = await precio_matricula(nid_matricula, i);
            let v_precio_remesa = v_resumen_matricula.precio;
            let nid_remesa = await registrar_remesa(
              persona_recuperada["nid"],
              v_concepto,
              lote,
              v_precio_remesa,
              persona_recuperada["nid_forma_pago"]
            );

            for (let z = 0; z < v_resumen_matricula.linea_remesas.length; z++) {
              await registrar_linea_remesa(
                nid_remesa,
                v_resumen_matricula.linea_remesas[z].precio,
                v_resumen_matricula.linea_remesas[z].concepto
              );
            }

            for (let z = 0; z < v_resumen_matricula.descuentos.length; z++) {
              await registrar_descuento(
                nid_remesa,
                v_resumen_matricula.descuentos[z]
              );
            }
            return;
          }
        }
      }
    } else {
      v_resumen_matricula = await precio_matricula(nid_matricula, 0);
      let v_precio_remesa = v_resumen_matricula.precio;
      let nid_remesa = await registrar_remesa(
        persona_recuperada["nid"],
        v_concepto,
        lote,
        v_precio_remesa,
        persona_recuperada["nid_forma_pago"]
      );

      for (let z = 0; z < v_resumen_matricula.linea_remesas.length; z++) {
        await registrar_linea_remesa(
          nid_remesa,
          v_resumen_matricula.linea_remesas[z].precio,
          v_resumen_matricula.linea_remesas[z].concepto
        );
      }

      for (let z = 0; z < v_resumen_matricula.descuentos.length; z++) {
        await registrar_descuento(
          nid_remesa,
          v_resumen_matricula.descuentos[z]
        );
      }
      return;
    }
  } catch (error) {
    console.log("remesa.js - registrar_remesa_persona -> " + error);
    throw new Error("Error al registrar la remesa");
  }
}

async function registrar_remesa_persona_fecha(
  nid_matricula,
  v_concepto,
  lote,
  fecha_desde,
  fecha_hasta
) {
  try {
    let v_matricula = await gestor_matricula.obtener_matricula(nid_matricula);
    let nid_persona = v_matricula["nid_persona"];

    let bEs_socio = await comprueba_es_socio(nid_persona);
    let persona_recuperada = await persona.obtener_persona(nid_persona);

    if (bEs_socio) {
      let nid_socio = await obtener_nid_socio(nid_persona);
      let v_personas_activas = await obtener_matriculas_activas_fecha(
        nid_socio,
        fecha_desde,
        fecha_hasta
      );

      var v_resumen_matricula = null;

      if (v_personas_activas !== undefined) {
        if (v_personas_activas.length > 0) {
          for (let i = 0; i < v_personas_activas.length; i++) {
            if (v_personas_activas[i]["nid_matricula"] == nid_matricula) {
              v_resumen_matricula = await precio_matricula_fecha(
                nid_matricula,
                i,
                fecha_desde,
                fecha_hasta
              );
              let v_precio_remesa = v_resumen_matricula.precio;
              let nid_remesa = await registrar_remesa(
                persona_recuperada["nid"],
                v_concepto,
                lote,
                v_precio_remesa,
                persona_recuperada["nid_forma_pago"]
              );

              for (
                let z = 0;
                z < v_resumen_matricula.linea_remesas.length;
                z++
              ) {
                await registrar_linea_remesa(
                  nid_remesa,
                  v_resumen_matricula.linea_remesas[z].precio,
                  v_resumen_matricula.linea_remesas[z].concepto
                );
              }

              for (let z = 0; z < v_resumen_matricula.descuentos.length; z++) {
                await registrar_descuento(
                  nid_remesa,
                  v_resumen_matricula.descuentos[z]
                );
              }
              return;
            }
          }
        } else {
          console.log(
            "remesa.js - registrar_remesa_persona_fecha -> No se han encontrado personas activas para el socio " +
              nid_socio
          );
          throw new Error("No se ha podido registrar la remesa");
        }
      } else {
        console.log(
          "remesa.js - registrar_remesa_persona_fecha -> No se han econtrado personas"
        );
        throw new Error("No se ha podido registrar la remesa");
      }
    } else {
      v_resumen_matricula = await precio_matricula_fecha(
        nid_matricula,
        0,
        fecha_desde,
        fecha_hasta
      );
      let v_precio_remesa = v_resumen_matricula.precio;
      let nid_remesa = await registrar_remesa(
        persona_recuperada["nid"],
        v_concepto,
        lote,
        v_precio_remesa,
        persona_recuperada["nid_forma_pago"]
      );

      for (let z = 0; z < v_resumen_matricula.linea_remesas.length; z++) {
        await registrar_linea_remesa(
          nid_remesa,
          v_resumen_matricula.linea_remesas[z].precio,
          v_resumen_matricula.linea_remesas[z].concepto
        );
      }

      for (let z = 0; z < v_resumen_matricula.descuentos.length; z++) {
        await registrar_descuento(
          nid_remesa,
          v_resumen_matricula.descuentos[z]
        );
      }
      return;
    }
  } catch (error) {
    console.log("remesa.js - registrar_remesa_persona_fecha -> " + error);
    throw new Error("Error al registrar la remesa");
  }
}

function obtener_remesas(fecha_desde, fecha_hasta) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago " +
        ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha, p.*, fp.iban " +
        "from " +
        constantes.ESQUEMA_BD +
        ".remesa r, " +
        constantes.ESQUEMA_BD +
        ".persona p, " +
        constantes.ESQUEMA_BD +
        ".forma_pago fp " +
        "where r.fecha >= str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_desde) +
        ", '') , '%Y-%m-%d') " +
        "and r.fecha <= str_to_date(nullif(" +
        conexion.dbConn.escape(fecha_hasta) +
        ", '') , '%Y-%m-%d') " +
        "and p.nid = r.nid_persona " +
        "and fp.nid = p.nid_forma_pago ",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_remesa(lote) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago " +
        ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha, " +
        "fp.iban, concat(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) etiqueta_nombre from " +
        constantes.ESQUEMA_BD +
        ".remesa r, " +
        constantes.ESQUEMA_BD +
        ".forma_pago fp, " +
        constantes.ESQUEMA_BD +
        ".persona p " +
        " where r.nid_forma_pago = fp.nid and lote = " +
        conexion.dbConn.escape(lote) +
        " and r.nid_persona = p.nid",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_remesa_pendiente(lote) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago " +
        ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha from " +
        constantes.ESQUEMA_BD +
        ".remesa r where r.lote = " +
        conexion.dbConn.escape(lote) +
        " and r.estado = '" +
        constantes.ESTADO_REMESA_PENDIENTE +
        "'",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_remesa_estado(lote, estado) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago " +
        ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha from " +
        constantes.ESQUEMA_BD +
        ".remesa r where lote = " +
        conexion.dbConn.escape(lote) +
        " and estado = " +
        conexion.dbConn.escape(estado),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_lineas_remesa(nid_remesa) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".linea_remesa where nid_remesa = " +
        conexion.dbConn.escape(nid_remesa),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

function obtener_descuentos_remesa(nid_remesa) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select * from " +
        constantes.ESQUEMA_BD +
        ".remesa_descuento where nid_remesa = " +
        conexion.dbConn.escape(nid_remesa),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results);
        }
      }
    );
  });
}

async function obtener_precio_matricula(nid_matricula) {
  try {
    let v_matricula = await gestor_matricula.obtener_matricula(nid_matricula);
    let nid_persona = v_matricula["nid_persona"];

    // Comprueba si es socio o tiene un socio asociado //
    let bEs_socio = await comprueba_es_socio(nid_persona);

    if (bEs_socio) {
      let nid_socio = await obtener_nid_socio(nid_persona);
      let v_personas_activas = await obtener_matriculas_activas(nid_socio);

      var v_resumen_matricula = null;

      if (v_personas_activas !== undefined) {
        for (let i = 0; i < v_personas_activas.length; i++) {
          if (v_personas_activas[i]["nid_matricula"] == nid_matricula) {
            v_resumen_matricula = await precio_matricula(nid_matricula, i);
            return v_resumen_matricula;
          }
        }
      }
    } else {
      v_resumen_matricula = await precio_matricula(nid_matricula, 0);
      return v_resumen_matricula;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al recupera el precio de la matricula");
  }
}

async function obtener_precio_matricula_fecha(
  nid_matricula,
  fecha_desde,
  fecha_hasta
) {
  try {
    let v_matricula = await gestor_matricula.obtener_matricula(nid_matricula);
    let nid_persona = v_matricula["nid_persona"];

    // Comprueba si es socio o tiene un socio asociado //
    let bEs_socio = await comprueba_es_socio(nid_persona);

    if (bEs_socio) {
      let nid_socio = await obtener_nid_socio(nid_persona);
      let v_personas_activas = await obtener_matriculas_activas_fecha(
        nid_socio,
        fecha_desde,
        fecha_hasta
      );

      var v_resumen_matricula = null;

      if (v_personas_activas !== undefined) {
        for (let i = 0; i < v_personas_activas.length; i++) {
          if (v_personas_activas[i]["nid_matricula"] == nid_matricula) {
            v_resumen_matricula = await precio_matricula_fecha(
              nid_matricula,
              i,
              fecha_desde,
              fecha_hasta
            );
            return v_resumen_matricula;
          }
        }
      }
    } else {
      v_resumen_matricula = await precio_matricula(nid_matricula, 0);
      return v_resumen_matricula;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al recupera el precio de la matricula");
  }
}

function obtener_ultimo_lote() {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select ifnull(max(lote), 0) ultimo_lote from " +
        constantes.ESQUEMA_BD +
        ".remesa",
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(results[0]["ultimo_lote"]);
        }
      }
    );
  });
}

function obtener_remesa_nid(nid_remesa) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "select r.nid_remesa, r.nid_forma_pago, r.nid_persona, r.concepto, r.lote, r.precio, r.estado, r.anotaciones, r.nid_cobro_pasarela_pago " +
        ", DATE_FORMAT(r.fecha, '%d/%m/%Y') fecha from " +
        constantes.ESQUEMA_BD +
        ".remesa r where nid_remesa = " +
        conexion.dbConn.escape(nid_remesa),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          console.log("Resultados: " + results);
          console.log("Resultados: " + results.length);
          console.log("Resultados: " + results[0].concepto);
          if (results.length == 0) {
            reject("No se ha encontrado la remesa");
          } else {
            resolve(results[0]);
          }
        }
      }
    );
  });
}

async function obtener_concepto(nid_remesa) {
  try {
    var v_remesa = await obtener_remesa_nid(nid_remesa);

    var concepto = v_remesa.concepto;
    console.log("Concepto de la remesa: " + concepto);
    console.log("Remesa: " + v_remesa);
    return concepto;
  } catch (error) {
    console.log(error);
    throw new Error("Error al recuperar el concepto de la remesa");
  }
}

function actualizar_estado(nid_remesa, estado, anotaciones) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() =>
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".remesa set estado = " +
          conexion.dbConn.escape(estado) +
          ", anotaciones = " +
          conexion.dbConn.escape(anotaciones) +
          " where nid_remesa = " +
          conexion.dbConn.escape(nid_remesa),
        (error, results, fields) => {
          if (error) {
            console.log(error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      )
    );
  });
}

async function aprobar_remesas(lote, anotaciones) {
  try {
    let remesas = await obtener_remesa_pendiente(lote);

    for (let i = 0; i < remesas.length; i++) {
      await actualizar_estado(
        remesas[i]["nid_remesa"],
        constantes.ESTADO_REMESA_PAGADO,
        anotaciones
      );
    }
    return;
  } catch (error) {
    console.log("remesa.js - aprobar_remesas -> " + error);
    throw new Error("Error al aprobar las remesas");
  }
}

async function rechazar_remesa(nid_remesa, anotaciones) {
  try {
    await actualizar_estado(
      nid_remesa,
      constantes.ESTADO_REMESA_RECHAZADO,
      anotaciones
    );
    return;
  } catch (error) {
    console.log("remesa.js - rechazar_remesa -> " + error);
    throw new Error("Error al rechazar la remesa");
  }
}

async function aprobar_remesa(nid_remesa, anotaciones) {
  try {
    await actualizar_estado(
      nid_remesa,
      constantes.ESTADO_REMESA_PAGADO,
      anotaciones
    );
    return;
  } catch (error) {
    console.log("remesa.js - aprobar_remesa -> " + error);
    throw new Error("Error al aprobar la remesa");
  }
}

async function remesa_erronea(nid_remesa, anotaciones) {
  try {
    await actualizar_estado(
      nid_remesa,
      constantes.ESTADO_REMESA_ERRONEO,
      anotaciones
    );
    return;
  } catch (error) {
    console.log("remesa.js - remesa_erronea -> " + error);
    throw new Error("Error al aprobar la remesa");
  }
}

function actualizar_id_cobro_pasarela_pago(nid_remesa, nid_cobro_pasarela) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "update " +
          constantes.ESQUEMA_BD +
          ".remesa set nid_cobro_pasarela_pago = " +
          conexion.dbConn.escape(nid_cobro_pasarela) +
          " where nid_remesa = " +
          conexion.dbConn.escape(nid_remesa),
        (error, results, fields) => {
          if (error) {
            console.log(
              "remesa.js - actualizar_id_cobro_pasarela_pago -> " + error
            );
            conexion.dbConn.rollback();
            reject("Error al actualizar el cobro");
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function actualizar_remesa(nid_remesa, precio, concepto, estado) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "update " +
        constantes.ESQUEMA_BD +
        ".remesa set precio = " +
        conexion.dbConn.escape(precio) +
        ", concepto = " +
        conexion.dbConn.escape(concepto) +
        ", estado = " +
        conexion.dbConn.escape(estado) +
        " where nid_remesa = " +
        conexion.dbConn.escape(nid_remesa),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

function actualizar_linea_remesa(nid_linea_remesa, concepto, precio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "update " +
        constantes.ESQUEMA_BD +
        ".linea_remesa set concepto = " +
        conexion.dbConn.escape(concepto) +
        ", precio = " +
        conexion.dbConn.escape(precio) +
        " where nid_linea_remesa = " +
        conexion.dbConn.escape(nid_linea_remesa),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

function actualizar_remesa_descuento(nid_remesa_descuento, concepto) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "update " +
        constantes.ESQUEMA_BD +
        ".remesa_descuento set concepto = " +
        conexion.dbConn.escape(concepto) +
        " where nid_remesa_descuento = " +
        conexion.dbConn.escape(nid_remesa_descuento),
      (error, results, fields) => {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve();
        }
      }
    );
  });
}

function actualizacion_remesa(v_remesa, v_linea_remesa, v_descuento_remesa) {
  return new Promise((resolve, reject) => {
    try {
      conexion.dbConn.beginTransaction(async () => {
        await actualizar_remesa(
          v_remesa.nid_remesa,
          v_remesa.precio,
          v_remesa.concepto,
          v_remesa.estado
        );

        for (let i = 0; i < v_linea_remesa.length; i++) {
          await actualizar_linea_remesa(
            v_linea_remesa[i].nid_linea_remesa,
            v_linea_remesa[i].concepto,
            v_linea_remesa[i].precio
          );
        }

        for (let i = 0; i < v_descuento_remesa; i++) {
          await actualizar_remesa_descuento(
            v_descuento_remesa[i].nid_descuento_remesa,
            v_descuento_remesa[i].concepto
          );
        }

        conexion.dbConn.commit();
        resolve();
      });
    } catch (error) {
      conexion.dbConn.rollback();
      console.log("remesa.js - actualizacion_remesa -> " + error);
      reject("Error al actualizar la remesa");
    }
  });
}

function nueva_linea_remesa(nid_remesa, concepto, precio) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".linea_remesa (nid_remesa, concepto, precio) values (" +
          conexion.dbConn.escape(nid_remesa) +
          ", " +
          conexion.dbConn.escape(concepto) +
          ", " +
          conexion.dbConn.escape(precio) +
          ")",
        (error, results, fields) => {
          if (error) {
            console.log("remesa.js - nueva_linea_remesa -> " + error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function nuevo_descuento_remesa(nid_remesa, concepto) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "insert into " +
          constantes.ESQUEMA_BD +
          ".remesa_descuento (nid_remesa, concepto) values (" +
          conexion.dbConn.escape(nid_remesa) +
          ", " +
          conexion.dbConn.escape(concepto) +
          ")",
        (error, results, fields) => {
          if (error) {
            console.log("remesa.js - nuevo_descuento_remesa -> " + error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function eliminar_linea_remesa(nid_linea_remesa) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".linea_remesa where nid_linea_remesa = " +
          conexion.dbConn.escape(nid_linea_remesa),
        (error, results, fields) => {
          if (error) {
            console.log("remesa.js - eliminar_linea_remesa -> " + error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

function eliminar_descuento_remesa(nid_descuento_remesa) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.beginTransaction(() => {
      conexion.dbConn.query(
        "delete from " +
          constantes.ESQUEMA_BD +
          ".remesa_descuento where nid_remesa_descuento = " +
          conexion.dbConn.escape(nid_descuento_remesa),
        (error, results, fields) => {
          if (error) {
            console.log("remesa.js - eliminar_descuento_remesa -> " + error);
            conexion.dbConn.rollback();
            reject();
          } else {
            conexion.dbConn.commit();
            resolve();
          }
        }
      );
    });
  });
}

module.exports.registrar_remesa = registrar_remesa;
module.exports.registrar_remesa_persona = registrar_remesa_persona;
module.exports.registrar_remesa_matriculas = registrar_remesa_matriculas;
module.exports.registrar_remesa_matriculas_fecha =
  registrar_remesa_matriculas_fecha;

module.exports.obtener_remesas = obtener_remesas;
module.exports.obtener_precio_matricula = obtener_precio_matricula;
module.exports.obtener_remesa = obtener_remesa;
module.exports.obtener_remesa_estado = obtener_remesa_estado;

module.exports.obtener_lineas_remesa = obtener_lineas_remesa;
module.exports.obtener_descuentos_remesa = obtener_descuentos_remesa;
module.exports.obtener_ultimo_lote = obtener_ultimo_lote;
module.exports.obtener_remesa_nid = obtener_remesa_nid;

module.exports.obtener_concepto = obtener_concepto;

module.exports.aprobar_remesas = aprobar_remesas;
module.exports.rechazar_remesa = rechazar_remesa;
module.exports.aprobar_remesa = aprobar_remesa;
module.exports.remesa_erronea = remesa_erronea;

module.exports.actualizar_id_cobro_pasarela_pago =
  actualizar_id_cobro_pasarela_pago;

module.exports.obtener_precio_matricula_fecha = obtener_precio_matricula_fecha;

module.exports.actualizacion_remesa = actualizacion_remesa;

module.exports.nueva_linea_remesa = nueva_linea_remesa;
module.exports.nuevo_descuento_remesa = nuevo_descuento_remesa;

module.exports.eliminar_linea_remesa = eliminar_linea_remesa;
module.exports.eliminar_descuento_remesa = eliminar_descuento_remesa;
