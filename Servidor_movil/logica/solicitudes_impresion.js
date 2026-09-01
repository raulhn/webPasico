const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const gestor_base_datos = require("./base_datos.js");
const gestorPartituras = require("./partituras.js");
const gestorDrivePartituras = require("./drive_partituras.js");

const CONFIGURACION_DEFECTO = {
  max_solicitudes_pendientes: 3,
  max_solicitudes_ventana: 10,
  ventana_dias: 30,
  max_archivos_por_solicitud: 10,
  escala_minima: 25,
  escala_maxima: 200,
};
const ESTADOS_FINALES = new Set([
  "IMPRESA",
  "RECHAZADA_CUOTA",
  "ERROR_FINAL",
  "CANCELADA",
]);
const ESTADOS_CANCELABLES = new Set(["PENDIENTE", "REINTENTABLE"]);
const TRANSICIONES_ESTADO = {
  PENDIENTE: new Set(["RECLAMADA", "IMPRIMIENDO", "CANCELADA", "RECHAZADA_CUOTA"]),
  RECLAMADA: new Set(["IMPRIMIENDO", "REINTENTABLE", "ERROR_FINAL", "CANCELADA", "RECHAZADA_CUOTA"]),
  IMPRIMIENDO: new Set(["IMPRESA", "REINTENTABLE", "ERROR_FINAL"]),
  REINTENTABLE: new Set(["RECLAMADA", "IMPRIMIENDO", "CANCELADA", "ERROR_FINAL", "RECHAZADA_CUOTA"]),
  IMPRESA: new Set([]),
  RECHAZADA_CUOTA: new Set([]),
  ERROR_FINAL: new Set([]),
  CANCELADA: new Set([]),
};
const ESTADOS_ADMITIDOS = new Set(Object.keys(TRANSICIONES_ESTADO));
const REGLA_RANGO_PAGINAS = /^\d+(-\d+)?(,\d+(-\d+)?)*$/;
function obtenerDirectorioImpresion() {
  if (
    typeof process.env.IMPRESION_CACHE_DIR === "string" &&
    process.env.IMPRESION_CACHE_DIR.trim() !== ""
  ) {
    return path.resolve(process.env.IMPRESION_CACHE_DIR.trim());
  }
  return path.resolve(__dirname, "..", "impresion_cache");
}

function crearError(mensaje, codigo = "SOLICITUD_IMPRESION", estadoHttp = 400) {
  const error = new Error(mensaje);
  error.codigo = codigo;
  error.estadoHttp = estadoHttp;
  return error;
}

function escapeSql(valor) {
  return conexion.dbConn.escape(valor);
}

function obtenerIntPositivo(valor, nombreCampo) {
  const numero = Number.parseInt(valor, 10);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw crearError(
      "El campo " + nombreCampo + " debe ser un entero positivo",
      "VALIDACION_CONFIGURACION",
      400,
    );
  }
  return numero;
}

function crearHashIdempotencia(valor) {
  return crypto.createHash("sha256").update(String(valor)).digest("hex");
}

function normalizarEstado(estado) {
  const estadoNormalizado = String(estado || "").trim().toUpperCase();
  if (!ESTADOS_ADMITIDOS.has(estadoNormalizado)) {
    throw crearError(
      "El estado de la solicitud de impresión no es válido",
      "ESTADO_INVALIDO",
      400,
    );
  }
  return estadoNormalizado;
}

function obtenerBaseUrlDescarga() {
  const baseUrl =
    process.env.URL_SERVICIO_MOVIL_EXTERNA ||
    process.env.IMPRESION_DOWNLOAD_BASE_URL ||
    "";

  if (typeof baseUrl !== "string" || baseUrl.trim() === "") {
    return "";
  }

  return baseUrl.trim().replace(/\/+$/, "");
}

function construirEndpointDescargaArchivo(nidSolicitudImpresionArchivo) {
  return (
    "/descargar_solicitud_impresion_archivo/" +
    String(nidSolicitudImpresionArchivo)
  );
}

function mapearArchivoSolicitud(archivo, opciones = {}) {
  const resultado = {
    nid_solicitud_impresion_archivo: archivo.nid_solicitud_impresion_archivo,
    nid_solicitud_impresion: archivo.nid_solicitud_impresion,
    nid_partitura: archivo.nid_partitura,
    drive_file_id: archivo.drive_file_id,
    drive_parent_id: archivo.drive_parent_id,
    nombre_archivo: archivo.nombre_archivo,
    mime_type: archivo.mime_type,
    size_bytes: archivo.size_bytes,
    orden: archivo.orden,
    fecha_creacion: archivo.fecha_creacion,
    fecha_descarga: archivo.fecha_descarga,
  };

  if (opciones.incluirEndpointDescarga) {
    const endpointDescarga = construirEndpointDescargaArchivo(
      archivo.nid_solicitud_impresion_archivo,
    );
    resultado.endpoint_descarga = endpointDescarga;
    resultado.descarga = {
      metodo: "API_KEY",
      requiere_api_key: true,
      endpoint: endpointDescarga,
    };

    const baseUrlDescarga = obtenerBaseUrlDescarga();
    if (baseUrlDescarga) {
      resultado.url_descarga = baseUrlDescarga + endpointDescarga;
      resultado.descarga.url = resultado.url_descarga;
    }
  }

  if (opciones.incluirRutaLocal) {
    resultado.ruta_local = archivo.ruta_local;
  }

  return resultado;
}

function parsearJsonSeguro(valor, valorPorDefecto) {
  if (!valor) {
    return valorPorDefecto;
  }
  if (typeof valor === "object") {
    return valor;
  }
  try {
    return JSON.parse(valor);
  } catch (error) {
    return valorPorDefecto;
  }
}

function construirNombreActor(fila) {
  if (!fila) {
    return null;
  }

  const partes = [fila.nombre_actor, fila.primer_apellido_actor, fila.segundo_apellido_actor]
    .filter(Boolean)
    .map((parte) => String(parte).trim())
    .filter((parte) => parte !== "");

  if (partes.length === 0) {
    return null;
  }
  return partes.join(" ");
}

function normalizarConfiguracion(fila) {
  const base = fila || {};
  return {
    nid_configuracion_cuota_impresion:
      base.nid_configuracion_cuota_impresion || null,
    max_solicitudes_pendientes:
      Number.parseInt(
        base.max_solicitudes_pendientes ||
          CONFIGURACION_DEFECTO.max_solicitudes_pendientes,
        10,
      ) || CONFIGURACION_DEFECTO.max_solicitudes_pendientes,
    max_solicitudes_ventana:
      Number.parseInt(
        base.max_solicitudes_ventana ||
          CONFIGURACION_DEFECTO.max_solicitudes_ventana,
        10,
      ) || CONFIGURACION_DEFECTO.max_solicitudes_ventana,
    ventana_dias:
      Number.parseInt(base.ventana_dias || CONFIGURACION_DEFECTO.ventana_dias, 10) ||
      CONFIGURACION_DEFECTO.ventana_dias,
    max_archivos_por_solicitud:
      Number.parseInt(
        base.max_archivos_por_solicitud ||
          CONFIGURACION_DEFECTO.max_archivos_por_solicitud,
        10,
      ) || CONFIGURACION_DEFECTO.max_archivos_por_solicitud,
    escala_minima:
      Number.parseInt(base.escala_minima || CONFIGURACION_DEFECTO.escala_minima, 10) ||
      CONFIGURACION_DEFECTO.escala_minima,
    escala_maxima:
      Number.parseInt(base.escala_maxima || CONFIGURACION_DEFECTO.escala_maxima, 10) ||
      CONFIGURACION_DEFECTO.escala_maxima,
    creado_por_usuario: base.creado_por_usuario || null,
    actualizado_por_usuario: base.actualizado_por_usuario || null,
    fecha_creacion: base.fecha_creacion || null,
    fecha_actualizacion: base.fecha_actualizacion || null,
    persistida: Boolean(base.nid_configuracion_cuota_impresion),
  };
}

function validarConfiguracionEntrada(configuracion) {
  const configuracionNormalizada = {
    max_solicitudes_pendientes: obtenerIntPositivo(
      configuracion.max_solicitudes_pendientes,
      "max_solicitudes_pendientes",
    ),
    max_solicitudes_ventana: obtenerIntPositivo(
      configuracion.max_solicitudes_ventana,
      "max_solicitudes_ventana",
    ),
    ventana_dias: obtenerIntPositivo(configuracion.ventana_dias, "ventana_dias"),
    max_archivos_por_solicitud: obtenerIntPositivo(
      configuracion.max_archivos_por_solicitud,
      "max_archivos_por_solicitud",
    ),
    escala_minima: obtenerIntPositivo(configuracion.escala_minima, "escala_minima"),
    escala_maxima: obtenerIntPositivo(configuracion.escala_maxima, "escala_maxima"),
  };

  if (
    configuracionNormalizada.max_solicitudes_ventana <
    configuracionNormalizada.max_solicitudes_pendientes
  ) {
    throw crearError(
      "max_solicitudes_ventana no puede ser menor que max_solicitudes_pendientes",
      "VALIDACION_CONFIGURACION",
      400,
    );
  }

  if (configuracionNormalizada.escala_minima > configuracionNormalizada.escala_maxima) {
    throw crearError(
      "escala_minima no puede ser mayor que escala_maxima",
      "VALIDACION_CONFIGURACION",
      400,
    );
  }

  return configuracionNormalizada;
}

function abrirConexion() {
  return new Promise((resolve, reject) => {
    conexion.pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(connection);
    });
  });
}

function ejecutarQuery(connection, sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

function beginTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function commit(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

function rollback(connection) {
  return new Promise((resolve) => {
    connection.rollback(() => resolve());
  });
}

async function withTransaction(handler) {
  const connection = await abrirConexion();
  try {
    await beginTransaction(connection);
    const resultado = await handler(connection);
    await commit(connection);
    return resultado;
  } catch (error) {
    await rollback(connection);
    throw error;
  } finally {
    connection.release();
  }
}

async function obtenerConfiguracionCuotaInterna(connection) {
  const sql =
    "SELECT * FROM " +
    constantes.ESQUEMA +
    ".configuracion_cuota_impresion ORDER BY nid_configuracion_cuota_impresion DESC LIMIT 1";
  const filas = connection
    ? await ejecutarQuery(connection, sql)
    : await gestor_base_datos.consulta(sql);
  return normalizarConfiguracion(filas[0]);
}

async function obtenerConfiguracionCuota() {
  return obtenerConfiguracionCuotaInterna();
}

async function guardarConfiguracionCuota(nidUsuarioActor, configuracion) {
  const configuracionNormalizada = validarConfiguracionEntrada(configuracion);

  const resultado = await withTransaction(async (connection) => {
    const filas = await ejecutarQuery(
      connection,
      "SELECT nid_configuracion_cuota_impresion FROM " +
        constantes.ESQUEMA +
        ".configuracion_cuota_impresion ORDER BY nid_configuracion_cuota_impresion DESC LIMIT 1 FOR UPDATE",
    );

    if (filas.length === 0) {
      await ejecutarQuery(
        connection,
        "INSERT INTO " +
          constantes.ESQUEMA +
          ".configuracion_cuota_impresion (max_solicitudes_pendientes, max_solicitudes_ventana, ventana_dias, max_archivos_por_solicitud, escala_minima, escala_maxima, creado_por_usuario, actualizado_por_usuario) VALUES (" +
          escapeSql(configuracionNormalizada.max_solicitudes_pendientes) +
          ", " +
          escapeSql(configuracionNormalizada.max_solicitudes_ventana) +
          ", " +
          escapeSql(configuracionNormalizada.ventana_dias) +
          ", " +
          escapeSql(configuracionNormalizada.max_archivos_por_solicitud) +
          ", " +
          escapeSql(configuracionNormalizada.escala_minima) +
          ", " +
          escapeSql(configuracionNormalizada.escala_maxima) +
          ", " +
          escapeSql(nidUsuarioActor) +
          ", " +
          escapeSql(nidUsuarioActor) +
          ")",
      );
    } else {
      await ejecutarQuery(
        connection,
        "UPDATE " +
          constantes.ESQUEMA +
          ".configuracion_cuota_impresion SET max_solicitudes_pendientes = " +
          escapeSql(configuracionNormalizada.max_solicitudes_pendientes) +
          ", max_solicitudes_ventana = " +
          escapeSql(configuracionNormalizada.max_solicitudes_ventana) +
          ", ventana_dias = " +
          escapeSql(configuracionNormalizada.ventana_dias) +
          ", max_archivos_por_solicitud = " +
          escapeSql(configuracionNormalizada.max_archivos_por_solicitud) +
          ", escala_minima = " +
          escapeSql(configuracionNormalizada.escala_minima) +
          ", escala_maxima = " +
          escapeSql(configuracionNormalizada.escala_maxima) +
          ", actualizado_por_usuario = " +
          escapeSql(nidUsuarioActor) +
          " WHERE nid_configuracion_cuota_impresion = " +
          escapeSql(filas[0].nid_configuracion_cuota_impresion),
      );
    }

    return obtenerConfiguracionCuotaInterna(connection);
  });

  return resultado;
}

async function obtenerPartituraObligatoria(nidPartitura) {
  const partitura = await gestorPartituras.obtenerPartitura(nidPartitura);
  if (!partitura || !partitura.nid_partitura) {
    throw crearError("La partitura indicada no existe", "PARTITURA_NO_ENCONTRADA", 404);
  }

  if (!partitura.url_partitura) {
    throw crearError(
      "La partitura no tiene una URL de Google Drive asociada",
      "PARTITURA_SIN_URL",
      400,
    );
  }

  return partitura;
}

async function inspeccionarPartitura(datos) {
  let partitura = null;
  let urlPartitura = datos && datos.url_partitura ? String(datos.url_partitura).trim() : "";

  if (datos && datos.nid_partitura) {
    partitura = await obtenerPartituraObligatoria(datos.nid_partitura);
    urlPartitura = partitura.url_partitura;
  }

  if (!urlPartitura) {
    throw crearError(
      "Debe indicar nid_partitura o url_partitura",
      "PARTITURA_REQUERIDA",
      400,
    );
  }

  const inspeccion = await gestorDrivePartituras.inspeccionarUrlDrive(urlPartitura);
  if (
    partitura &&
    inspeccion.tipo === "ARCHIVO" &&
    inspeccion.archivos.length === 1 &&
    (!inspeccion.archivos[0].nombre_archivo ||
      inspeccion.archivos[0].nombre_archivo === inspeccion.archivos[0].drive_file_id)
  ) {
    inspeccion.archivos[0].nombre_archivo = partitura.titulo || inspeccion.archivos[0].drive_file_id;
  }

  return {
    partitura,
    inspeccion,
  };
}

function normalizarIdempotencyKey(datos, headers) {
  const valorCabecera = headers && headers["idempotency-key"];
  const valor = datos.idempotency_key || datos.idempotencyKey || valorCabecera;
  if (!valor || String(valor).trim() === "") {
    throw crearError(
      "Debe indicar idempotency_key en el cuerpo o en la cabecera idempotency-key",
      "IDEMPOTENCY_KEY_REQUERIDA",
      400,
    );
  }
  return crearHashIdempotencia(String(valor).trim());
}

function normalizarOpciones(datos, configuracion) {
  const origenOpciones = datos.opciones && typeof datos.opciones === "object" ? datos.opciones : datos;
  const escala = Number.parseInt(origenOpciones.escala, 10);
  if (!Number.isInteger(escala)) {
    throw crearError("La escala es obligatoria", "ESCALA_REQUERIDA", 400);
  }

  if (escala < configuracion.escala_minima || escala > configuracion.escala_maxima) {
    throw crearError(
      "La escala debe estar entre " +
        configuracion.escala_minima +
        " y " +
        configuracion.escala_maxima,
      "ESCALA_INVALIDA",
      400,
    );
  }

  const rangoPaginasValor =
    origenOpciones.rango_paginas || origenOpciones.rangoPaginas || null;
  const rangoPaginas = rangoPaginasValor
    ? String(rangoPaginasValor).replace(/\s+/g, "")
    : null;

  if (rangoPaginas && !REGLA_RANGO_PAGINAS.test(rangoPaginas)) {
    throw crearError(
      "El rango de páginas indicado no es válido",
      "RANGO_PAGINAS_INVALIDO",
      400,
    );
  }

  return {
    escala,
    rango_paginas: rangoPaginas,
  };
}

function normalizarSeleccionArchivos(archivos, inspeccion) {
  let seleccion = Array.isArray(archivos) ? archivos.slice() : [];
  if (seleccion.length === 0 && inspeccion.tipo === "ARCHIVO") {
    seleccion = [inspeccion.archivos[0].drive_file_id];
  }

  if (seleccion.length === 0) {
    throw crearError(
      "Debe seleccionar al menos un archivo de la partitura",
      "ARCHIVOS_REQUERIDOS",
      400,
    );
  }

  const resultado = [];
  const vistos = new Set();

  for (let i = 0; i < seleccion.length; i++) {
    const elemento = seleccion[i];
    const driveFileId =
      typeof elemento === "string"
        ? elemento.trim()
        : elemento && elemento.drive_file_id
          ? String(elemento.drive_file_id).trim()
          : "";

    if (!driveFileId) {
      throw crearError(
        "Cada archivo seleccionado debe incluir drive_file_id",
        "ARCHIVO_SELECCION_INVALIDO",
        400,
      );
    }

    if (vistos.has(driveFileId)) {
      throw crearError(
        "No se puede repetir un archivo en la misma solicitud",
        "ARCHIVO_DUPLICADO",
        400,
      );
    }
    vistos.add(driveFileId);

    resultado.push({
      drive_file_id: driveFileId,
      orden: i + 1,
    });
  }

  return resultado;
}

function validarArchivosSeleccionados(inspeccion, seleccion, configuracion, partitura) {
  if (seleccion.length > configuracion.max_archivos_por_solicitud) {
    throw crearError(
      "Se supera el máximo de archivos permitidos por solicitud",
      "MAXIMO_ARCHIVOS_SUPERADO",
      400,
    );
  }

  const mapaArchivos = new Map();
  for (let i = 0; i < inspeccion.archivos.length; i++) {
    mapaArchivos.set(inspeccion.archivos[i].drive_file_id, inspeccion.archivos[i]);
  }

  return seleccion.map((archivoSeleccionado) => {
    const metadata = mapaArchivos.get(archivoSeleccionado.drive_file_id);
    if (!metadata) {
      throw crearError(
        "Alguno de los archivos seleccionados no pertenece a la URL de Google Drive registrada",
        "ARCHIVO_NO_PERTENECE_A_PARTITURA",
        400,
      );
    }

    if (metadata.imprimible === false) {
      throw crearError(
        "Todos los archivos seleccionados deben ser PDF o imagen",
        "ARCHIVO_NO_IMPRIMIBLE",
        400,
      );
    }

    return {
      drive_file_id: metadata.drive_file_id,
      drive_parent_id: metadata.drive_parent_id,
      nombre_archivo:
        metadata.nombre_archivo || partitura.titulo || metadata.drive_file_id,
      mime_type: metadata.mime_type,
      size_bytes: metadata.size_bytes,
      web_view_link: metadata.web_view_link,
      orden: archivoSeleccionado.orden,
    };
  });
}

async function obtenerSolicitudPorIdempotenciaTx(connection, nidUsuario, idempotencyKey) {
  const filas = await ejecutarQuery(
    connection,
    "SELECT * FROM " +
      constantes.ESQUEMA +
      ".solicitudes_impresion WHERE nid_usuario = " +
      escapeSql(nidUsuario) +
      " AND idempotency_key = " +
      escapeSql(idempotencyKey) +
      " LIMIT 1 FOR UPDATE",
  );
  return filas.length > 0 ? filas[0] : null;
}

async function obtenerArchivosSolicitudTx(connection, nidSolicitud) {
  return ejecutarQuery(
    connection,
    "SELECT * FROM " +
      constantes.ESQUEMA +
      ".solicitud_impresion_archivos WHERE nid_solicitud_impresion = " +
      escapeSql(nidSolicitud) +
      " ORDER BY orden ASC, nid_solicitud_impresion_archivo ASC",
  );
}

function mismaSolicitud(existing, archivosExistentes, datosNuevaSolicitud) {
  if (String(existing.nid_partitura) !== String(datosNuevaSolicitud.nid_partitura)) {
    return false;
  }
  if (String(existing.origen_drive_tipo) !== String(datosNuevaSolicitud.origen_drive_tipo)) {
    return false;
  }
  if (String(existing.origen_drive_id) !== String(datosNuevaSolicitud.origen_drive_id)) {
    return false;
  }

  const opcionesExistentes = parsearJsonSeguro(existing.opciones, {});
  if (JSON.stringify(opcionesExistentes) !== JSON.stringify(datosNuevaSolicitud.opciones)) {
    return false;
  }

  const actuales = archivosExistentes.map((archivo) => archivo.drive_file_id);
  const nuevas = datosNuevaSolicitud.archivos.map((archivo) => archivo.drive_file_id);
  return JSON.stringify(actuales) === JSON.stringify(nuevas);
}

async function contarSolicitudesPendientesTx(connection, nidUsuario) {
  const filas = await ejecutarQuery(
    connection,
    "SELECT count(*) total FROM " +
      constantes.ESQUEMA +
      ".solicitudes_impresion WHERE nid_usuario = " +
      escapeSql(nidUsuario) +
      " AND estado IN ('PENDIENTE', 'RECLAMADA', 'IMPRIMIENDO', 'REINTENTABLE')",
  );
  return Number.parseInt(filas[0].total, 10) || 0;
}

async function contarSolicitudesVentanaTx(connection, nidUsuario, ventanaDias) {
  const filas = await ejecutarQuery(
    connection,
    "SELECT count(*) total FROM " +
      constantes.ESQUEMA +
      ".solicitudes_impresion WHERE nid_usuario = " +
      escapeSql(nidUsuario) +
      " AND estado NOT IN ('CANCELADA', 'RECHAZADA_CUOTA', 'ERROR_FINAL')" +
      " AND fecha_solicitud >= date_sub(now(), interval " +
      escapeSql(ventanaDias) +
      " day)",
  );
  return Number.parseInt(filas[0].total, 10) || 0;
}

async function validarCuotaTx(connection, nidUsuario, configuracion) {
  const solicitudesPendientes = await contarSolicitudesPendientesTx(connection, nidUsuario);
  if (solicitudesPendientes >= configuracion.max_solicitudes_pendientes) {
    throw crearError(
      "Has superado el máximo de solicitudes pendientes permitidas",
      "CUOTA_IMPRESION_SUPERADA",
      409,
    );
  }

  const solicitudesVentana = await contarSolicitudesVentanaTx(
    connection,
    nidUsuario,
    configuracion.ventana_dias,
  );
  if (solicitudesVentana >= configuracion.max_solicitudes_ventana) {
    throw crearError(
      "Has superado la cuota de solicitudes de impresión disponible",
      "CUOTA_IMPRESION_SUPERADA",
      409,
    );
  }
}

async function insertarAuditoriaEstadoTx(connection, datos) {
  await ejecutarQuery(
    connection,
    "INSERT INTO " +
      constantes.ESQUEMA +
      ".solicitud_impresion_estado_auditoria (nid_solicitud_impresion, estado_anterior, estado_nuevo, detalle, trabajo_cups, tipo_actor, nid_usuario_actor, referencia_actor) VALUES (" +
      escapeSql(datos.nid_solicitud_impresion) +
      ", " +
      escapeSql(datos.estado_anterior || null) +
      ", " +
      escapeSql(datos.estado_nuevo) +
      ", " +
      escapeSql(datos.detalle || null) +
      ", " +
      escapeSql(datos.trabajo_cups || null) +
      ", " +
      escapeSql(datos.tipo_actor) +
      ", " +
      escapeSql(datos.nid_usuario_actor || null) +
      ", " +
      escapeSql(datos.referencia_actor || null) +
      ")",
  );
}

async function obtenerSolicitudDetalle(nidSolicitud, nidUsuario, opciones = {}) {
  const condiciones = [
    "s.nid_solicitud_impresion = " + escapeSql(nidSolicitud),
  ];
  if (nidUsuario) {
    condiciones.push("s.nid_usuario = " + escapeSql(nidUsuario));
  }

  const sqlSolicitud =
    "SELECT s.*, p.titulo partitura_titulo, p.autor partitura_autor, p.url_partitura partitura_url, p.nid_categoria partitura_nid_categoria " +
    "FROM " +
    constantes.ESQUEMA +
    ".solicitudes_impresion s " +
    "INNER JOIN " +
    constantes.ESQUEMA +
    ".partituras p ON p.nid_partitura = s.nid_partitura " +
    "WHERE " +
    condiciones.join(" AND ") +
    " LIMIT 1";

  const solicitudes = await gestor_base_datos.consulta(sqlSolicitud);
  if (solicitudes.length === 0) {
    throw crearError(
      "No se ha encontrado la solicitud de impresión indicada",
      "SOLICITUD_NO_ENCONTRADA",
      404,
    );
  }

  const solicitud = solicitudes[0];
  const archivos = await gestor_base_datos.consulta(
    "SELECT nid_solicitud_impresion_archivo, nid_solicitud_impresion, nid_partitura, drive_file_id, drive_parent_id, nombre_archivo, mime_type, size_bytes, ruta_local, orden, fecha_creacion, fecha_descarga FROM " +
      constantes.ESQUEMA +
      ".solicitud_impresion_archivos WHERE nid_solicitud_impresion = " +
      escapeSql(nidSolicitud) +
      " ORDER BY orden ASC, nid_solicitud_impresion_archivo ASC",
  );
  const auditoria = await gestor_base_datos.consulta(
    "SELECT a.*, u.nombre nombre_actor, u.primer_apellido primer_apellido_actor, u.segundo_apellido segundo_apellido_actor FROM " +
      constantes.ESQUEMA +
      ".solicitud_impresion_estado_auditoria a LEFT JOIN " +
      constantes.ESQUEMA +
      ".usuarios u ON u.nid_usuario = a.nid_usuario_actor WHERE a.nid_solicitud_impresion = " +
      escapeSql(nidSolicitud) +
      " ORDER BY a.fecha_estado ASC, a.nid_solicitud_impresion_estado ASC",
  );

  return {
    nid_solicitud_impresion: solicitud.nid_solicitud_impresion,
    nid_usuario: solicitud.nid_usuario,
    estado: solicitud.estado,
    idempotency_key: solicitud.idempotency_key,
    opciones: parsearJsonSeguro(solicitud.opciones, {}),
    origen_drive_tipo: solicitud.origen_drive_tipo,
    origen_drive_id: solicitud.origen_drive_id,
    origen_drive: {
      tipo: solicitud.origen_drive_tipo,
      id: solicitud.origen_drive_id,
    },
    trabajo_cups: solicitud.trabajo_cups,
    intentos: solicitud.intentos,
    mensaje_error: solicitud.mensaje_error,
    fecha_solicitud: solicitud.fecha_solicitud,
    fecha_reclamacion: solicitud.fecha_reclamacion,
    fecha_cancelacion: solicitud.fecha_cancelacion,
    fecha_actualizacion: solicitud.fecha_actualizacion,
    partitura: {
      nid_partitura: solicitud.nid_partitura,
      titulo: solicitud.partitura_titulo,
      autor: solicitud.partitura_autor,
      nid_categoria: solicitud.partitura_nid_categoria,
    },
    archivos: archivos.map((archivo) => mapearArchivoSolicitud(archivo, opciones)),
    auditoria: auditoria.map((evento) => ({
      nid_solicitud_impresion_estado: evento.nid_solicitud_impresion_estado,
      estado_anterior: evento.estado_anterior,
      estado_nuevo: evento.estado_nuevo,
      detalle: evento.detalle,
      trabajo_cups: evento.trabajo_cups,
      tipo_actor: evento.tipo_actor,
      nid_usuario_actor: evento.nid_usuario_actor,
      actor: construirNombreActor(evento),
      referencia_actor: evento.referencia_actor,
      fecha_estado: evento.fecha_estado,
    })),
  };
}

async function crearSolicitudImpresion(nidUsuario, datos, headers = {}) {
  const partitura = await obtenerPartituraObligatoria(datos.nid_partitura);
  const configuracion = await obtenerConfiguracionCuota();
  const inspeccion = await inspeccionarPartitura({
    nid_partitura: datos.nid_partitura,
  });
  const archivosSeleccionados = normalizarSeleccionArchivos(datos.archivos, inspeccion.inspeccion);
  const archivosValidados = validarArchivosSeleccionados(
    inspeccion.inspeccion,
    archivosSeleccionados,
    configuracion,
    partitura,
  );
  const opciones = normalizarOpciones(datos, configuracion);
  const idempotencyKey = normalizarIdempotencyKey(datos, headers);

  const resultado = await withTransaction(async (connection) => {
    const existente = await obtenerSolicitudPorIdempotenciaTx(
      connection,
      nidUsuario,
      idempotencyKey,
    );

    if (existente) {
      const archivosExistentes = await obtenerArchivosSolicitudTx(
        connection,
        existente.nid_solicitud_impresion,
      );
      const coincide = mismaSolicitud(existente, archivosExistentes, {
        nid_partitura: partitura.nid_partitura,
        origen_drive_tipo: inspeccion.inspeccion.tipo,
        origen_drive_id: inspeccion.inspeccion.drive_id,
        opciones,
        archivos: archivosValidados,
      });

      if (!coincide) {
        throw crearError(
          "La idempotency_key ya se ha usado con otra solicitud distinta",
          "IDEMPOTENCY_KEY_REUTILIZADA",
          409,
        );
      }

      return {
        nid_solicitud_impresion: existente.nid_solicitud_impresion,
        idempotente: true,
      };
    }

    await validarCuotaTx(connection, nidUsuario, configuracion);

    const insercion = await ejecutarQuery(
      connection,
      "INSERT INTO " +
        constantes.ESQUEMA +
        ".solicitudes_impresion (nid_usuario, nid_partitura, estado, idempotency_key, opciones, origen_drive_tipo, origen_drive_id) VALUES (" +
        escapeSql(nidUsuario) +
        ", " +
        escapeSql(partitura.nid_partitura) +
        ", 'PENDIENTE', " +
        escapeSql(idempotencyKey) +
        ", " +
        escapeSql(JSON.stringify(opciones)) +
        ", " +
        escapeSql(inspeccion.inspeccion.tipo) +
        ", " +
        escapeSql(inspeccion.inspeccion.drive_id) +
        ")",
    );

    for (let i = 0; i < archivosValidados.length; i++) {
      const archivo = archivosValidados[i];
      await ejecutarQuery(
        connection,
        "INSERT INTO " +
          constantes.ESQUEMA +
          ".solicitud_impresion_archivos (nid_solicitud_impresion, nid_partitura, drive_file_id, drive_parent_id, nombre_archivo, mime_type, size_bytes, orden) VALUES (" +
          escapeSql(insercion.insertId) +
          ", " +
          escapeSql(partitura.nid_partitura) +
          ", " +
          escapeSql(archivo.drive_file_id) +
          ", " +
          escapeSql(archivo.drive_parent_id || null) +
          ", " +
          escapeSql(archivo.nombre_archivo) +
          ", " +
          escapeSql(archivo.mime_type || null) +
          ", " +
          escapeSql(archivo.size_bytes || null) +
          ", " +
          escapeSql(archivo.orden) +
          ")",
      );
    }

    await insertarAuditoriaEstadoTx(connection, {
      nid_solicitud_impresion: insercion.insertId,
      estado_anterior: null,
      estado_nuevo: "PENDIENTE",
      detalle: "Solicitud registrada por el usuario",
      tipo_actor: "USUARIO",
      nid_usuario_actor: nidUsuario,
      referencia_actor: null,
      trabajo_cups: null,
    });

    return {
      nid_solicitud_impresion: insercion.insertId,
      idempotente: false,
    };
  });

  const solicitud = await obtenerSolicitudDetalle(resultado.nid_solicitud_impresion, nidUsuario);
  solicitud.idempotente = resultado.idempotente;
  return solicitud;
}

async function listarSolicitudesUsuario(nidUsuario) {
  const solicitudes = await gestor_base_datos.consulta(
    "SELECT s.nid_solicitud_impresion, s.nid_usuario, s.estado, s.idempotency_key, s.opciones, s.origen_drive_tipo, s.origen_drive_id, s.trabajo_cups, s.intentos, s.mensaje_error, s.fecha_solicitud, s.fecha_reclamacion, s.fecha_cancelacion, s.fecha_actualizacion, s.nid_partitura, p.titulo partitura_titulo, p.autor partitura_autor, count(a.nid_solicitud_impresion_archivo) total_archivos FROM " +
      constantes.ESQUEMA +
      ".solicitudes_impresion s INNER JOIN " +
      constantes.ESQUEMA +
      ".partituras p ON p.nid_partitura = s.nid_partitura LEFT JOIN " +
      constantes.ESQUEMA +
      ".solicitud_impresion_archivos a ON a.nid_solicitud_impresion = s.nid_solicitud_impresion WHERE s.nid_usuario = " +
      escapeSql(nidUsuario) +
      " GROUP BY s.nid_solicitud_impresion ORDER BY s.fecha_solicitud DESC, s.nid_solicitud_impresion DESC",
  );

  return solicitudes.map((solicitud) => ({
    nid_solicitud_impresion: solicitud.nid_solicitud_impresion,
    estado: solicitud.estado,
    idempotency_key: solicitud.idempotency_key,
    opciones: parsearJsonSeguro(solicitud.opciones, {}),
    origen_drive_tipo: solicitud.origen_drive_tipo,
    origen_drive_id: solicitud.origen_drive_id,
    trabajo_cups: solicitud.trabajo_cups,
    intentos: solicitud.intentos,
    mensaje_error: solicitud.mensaje_error,
    fecha_solicitud: solicitud.fecha_solicitud,
    fecha_reclamacion: solicitud.fecha_reclamacion,
    fecha_cancelacion: solicitud.fecha_cancelacion,
    fecha_actualizacion: solicitud.fecha_actualizacion,
    total_archivos: Number.parseInt(solicitud.total_archivos, 10) || 0,
    partitura: {
      nid_partitura: solicitud.nid_partitura,
      titulo: solicitud.partitura_titulo,
      autor: solicitud.partitura_autor,
    },
  }));
}

async function obtenerSolicitudUsuario(nidUsuario, nidSolicitud) {
  return obtenerSolicitudDetalle(nidSolicitud, nidUsuario);
}

async function actualizarEstadoSolicitud(nidSolicitud, nuevoEstado, datosActualizacion, actor) {
  await withTransaction(async (connection) => {
    const filas = await ejecutarQuery(
      connection,
      "SELECT * FROM " +
        constantes.ESQUEMA +
        ".solicitudes_impresion WHERE nid_solicitud_impresion = " +
        escapeSql(nidSolicitud) +
        " LIMIT 1 FOR UPDATE",
    );

    if (filas.length === 0) {
      throw crearError(
        "No se ha encontrado la solicitud de impresión indicada",
        "SOLICITUD_NO_ENCONTRADA",
        404,
      );
    }

    const actual = filas[0];
    const estadoAnterior = actual.estado;

    if (estadoAnterior !== nuevoEstado) {
      if (ESTADOS_FINALES.has(estadoAnterior)) {
        throw crearError(
          "La solicitud ya está en un estado final",
          "SOLICITUD_FINALIZADA",
          409,
        );
      }

      const transiciones = TRANSICIONES_ESTADO[estadoAnterior] || new Set();
      if (!transiciones.has(nuevoEstado)) {
        throw crearError(
          "La transición de estado solicitada no está permitida",
          "TRANSICION_ESTADO_INVALIDA",
          409,
        );
      }
    }

    const camposUpdate = [
      "estado = " + escapeSql(nuevoEstado),
      "fecha_actualizacion = current_timestamp",
    ];

    if (datosActualizacion && Object.prototype.hasOwnProperty.call(datosActualizacion, "trabajo_cups")) {
      camposUpdate.push(
        "trabajo_cups = " + escapeSql(datosActualizacion.trabajo_cups || null),
      );
    }

    if (datosActualizacion && Object.prototype.hasOwnProperty.call(datosActualizacion, "mensaje_error")) {
      camposUpdate.push(
        "mensaje_error = " + escapeSql(datosActualizacion.mensaje_error || null),
      );
    } else if (["RECLAMADA", "IMPRIMIENDO", "IMPRESA"].includes(nuevoEstado)) {
      camposUpdate.push("mensaje_error = null");
    }

    if (nuevoEstado === "RECLAMADA") {
      camposUpdate.push("fecha_reclamacion = current_timestamp");
      camposUpdate.push("intentos = intentos + 1");
    }

    if (nuevoEstado === "CANCELADA") {
      camposUpdate.push("fecha_cancelacion = current_timestamp");
    }

    await ejecutarQuery(
      connection,
      "UPDATE " +
        constantes.ESQUEMA +
        ".solicitudes_impresion SET " +
        camposUpdate.join(", ") +
        " WHERE nid_solicitud_impresion = " +
        escapeSql(nidSolicitud),
    );

    await insertarAuditoriaEstadoTx(connection, {
      nid_solicitud_impresion: nidSolicitud,
      estado_anterior: estadoAnterior,
      estado_nuevo: nuevoEstado,
      detalle:
        (datosActualizacion && datosActualizacion.detalle) ||
        (datosActualizacion && datosActualizacion.mensaje_error) ||
        null,
      trabajo_cups:
        datosActualizacion && Object.prototype.hasOwnProperty.call(datosActualizacion, "trabajo_cups")
          ? datosActualizacion.trabajo_cups || null
          : actual.trabajo_cups || null,
      tipo_actor: actor.tipo_actor,
      nid_usuario_actor: actor.nid_usuario_actor || null,
      referencia_actor: actor.referencia_actor || null,
    });
  });

  return obtenerSolicitudDetalle(nidSolicitud);
}

async function cancelarSolicitudUsuario(nidUsuario, nidSolicitud) {
  await withTransaction(async (connection) => {
    const filas = await ejecutarQuery(
      connection,
      "SELECT * FROM " +
        constantes.ESQUEMA +
        ".solicitudes_impresion WHERE nid_solicitud_impresion = " +
        escapeSql(nidSolicitud) +
        " AND nid_usuario = " +
        escapeSql(nidUsuario) +
        " LIMIT 1 FOR UPDATE",
    );

    if (filas.length === 0) {
      throw crearError(
        "No se ha encontrado la solicitud de impresión indicada",
        "SOLICITUD_NO_ENCONTRADA",
        404,
      );
    }

    if (!ESTADOS_CANCELABLES.has(filas[0].estado)) {
      throw crearError(
        "La solicitud ya no puede cancelarse en su estado actual",
        "SOLICITUD_NO_CANCELABLE",
        409,
      );
    }

    await ejecutarQuery(
      connection,
      "UPDATE " +
        constantes.ESQUEMA +
        ".solicitudes_impresion SET estado = 'CANCELADA', fecha_cancelacion = current_timestamp, fecha_actualizacion = current_timestamp WHERE nid_solicitud_impresion = " +
        escapeSql(nidSolicitud),
    );

    await insertarAuditoriaEstadoTx(connection, {
      nid_solicitud_impresion: nidSolicitud,
      estado_anterior: filas[0].estado,
      estado_nuevo: "CANCELADA",
      detalle: "Solicitud cancelada por el usuario",
      trabajo_cups: filas[0].trabajo_cups || null,
      tipo_actor: "USUARIO",
      nid_usuario_actor: nidUsuario,
      referencia_actor: null,
    });
  });

  return obtenerSolicitudDetalle(nidSolicitud, nidUsuario);
}

function clasificarErrorPreparacion(error) {
  const permanentes = new Set([
    "DRIVE_NO_ENCONTRADO",
    "MIME_NO_IMPRIMIBLE",
    "GOOGLE_DRIVE_ID_INVALIDO",
    "GOOGLE_DRIVE_URL_INVALIDA",
    "GOOGLE_DRIVE_HOST_INVALIDO",
  ]);
  if (error && error.codigo && permanentes.has(error.codigo)) {
    return "ERROR_FINAL";
  }
  return "REINTENTABLE";
}

async function prepararArchivosSolicitud(solicitud) {
  const directorioSolicitud = path.join(
    obtenerDirectorioImpresion(),
    String(solicitud.nid_solicitud_impresion),
  );

  await fs.promises.mkdir(directorioSolicitud, { recursive: true });

  for (let i = 0; i < solicitud.archivos.length; i++) {
    const archivo = solicitud.archivos[i];
    if (archivo.ruta_local && fs.existsSync(archivo.ruta_local)) {
      continue;
    }

    const nombreBase =
      String(archivo.orden || i + 1).padStart(2, "0") +
      "_" +
      (archivo.nombre_archivo || solicitud.partitura.titulo || archivo.drive_file_id);

    const descarga = await gestorDrivePartituras.descargarArchivoDrive(
      archivo.drive_file_id,
      directorioSolicitud,
      nombreBase,
      {
        nombre_archivo: archivo.nombre_archivo,
        mime_type: archivo.mime_type,
      },
    );

    await gestor_base_datos.actualiza(
      "UPDATE " +
        constantes.ESQUEMA +
        ".solicitud_impresion_archivos SET ruta_local = " +
        escapeSql(descarga.ruta_local) +
        ", nombre_archivo = " +
        escapeSql(descarga.nombre_archivo) +
        ", mime_type = " +
        escapeSql(descarga.mime_type || null) +
        ", size_bytes = " +
        escapeSql(descarga.size_bytes || null) +
        ", fecha_descarga = current_timestamp WHERE nid_solicitud_impresion_archivo = " +
        escapeSql(archivo.nid_solicitud_impresion_archivo),
    );
  }

  return obtenerSolicitudDetalle(solicitud.nid_solicitud_impresion, null, {
    incluirEndpointDescarga: true,
  });
}

async function reclamarSolicitudesPendientes(limite) {
  const cantidad = Number.parseInt(limite, 10);
  const limiteNormalizado = Number.isInteger(cantidad)
    ? Math.min(Math.max(cantidad, 1), 25)
    : 5;

  const idsReclamados = await withTransaction(async (connection) => {
    const filas = await ejecutarQuery(
      connection,
      "SELECT nid_solicitud_impresion FROM " +
        constantes.ESQUEMA +
        ".solicitudes_impresion WHERE estado IN ('PENDIENTE', 'REINTENTABLE')" +
        " OR (estado = 'RECLAMADA' AND fecha_reclamacion is not null AND fecha_reclamacion <= date_sub(now(), interval 10 minute))" +
        " ORDER BY fecha_solicitud ASC, nid_solicitud_impresion ASC LIMIT " +
        escapeSql(limiteNormalizado) +
        " FOR UPDATE",
    );

    const ids = [];
    for (let i = 0; i < filas.length; i++) {
      const nidSolicitud = filas[i].nid_solicitud_impresion;
      ids.push(nidSolicitud);

      const solicitudActual = await ejecutarQuery(
        connection,
        "SELECT estado, trabajo_cups FROM " +
          constantes.ESQUEMA +
          ".solicitudes_impresion WHERE nid_solicitud_impresion = " +
          escapeSql(nidSolicitud) +
          " LIMIT 1",
      );

      await ejecutarQuery(
        connection,
        "UPDATE " +
          constantes.ESQUEMA +
          ".solicitudes_impresion SET estado = 'RECLAMADA', fecha_reclamacion = current_timestamp, fecha_actualizacion = current_timestamp, intentos = intentos + 1, mensaje_error = null WHERE nid_solicitud_impresion = " +
          escapeSql(nidSolicitud),
      );

      await insertarAuditoriaEstadoTx(connection, {
        nid_solicitud_impresion: nidSolicitud,
        estado_anterior: solicitudActual[0].estado,
        estado_nuevo: "RECLAMADA",
        detalle: "Solicitud reclamada por Gestor_Server",
        trabajo_cups: solicitudActual[0].trabajo_cups || null,
        tipo_actor: "API_KEY",
        nid_usuario_actor: null,
        referencia_actor: "API_KEY_MOVIL",
      });
    }

    return ids;
  });

  const solicitudes = [];
  for (let i = 0; i < idsReclamados.length; i++) {
    const nidSolicitud = idsReclamados[i];
    try {
      const detalle = await obtenerSolicitudDetalle(nidSolicitud);
      const preparada = await prepararArchivosSolicitud(detalle);
      solicitudes.push(preparada);
    } catch (error) {
      console.error("solicitudes_impresion -> reclamarSolicitudesPendientes:", error);
      const estadoError = clasificarErrorPreparacion(error);
      await actualizarEstadoSolicitud(
        nidSolicitud,
        estadoError,
        {
          detalle: "Error preparando los archivos para impresión",
          mensaje_error: error.message,
        },
        {
          tipo_actor: "SISTEMA",
          nid_usuario_actor: null,
          referencia_actor: "PREPARACION_IMPRESION",
        },
      );
    }
  }

  return solicitudes;
}

async function actualizarSolicitudDesdeApi(datos) {
  const nidSolicitud = datos.nid_solicitud_impresion;
  if (!nidSolicitud) {
    throw crearError(
      "Debe indicar nid_solicitud_impresion",
      "SOLICITUD_REQUERIDA",
      400,
    );
  }

  const nuevoEstado = normalizarEstado(datos.estado);
  return actualizarEstadoSolicitud(
    nidSolicitud,
    nuevoEstado,
    {
      trabajo_cups: datos.trabajo_cups,
      mensaje_error: datos.mensaje_error,
      detalle: datos.detalle || null,
    },
    {
      tipo_actor: "API_KEY",
      nid_usuario_actor: null,
      referencia_actor: "API_KEY_MOVIL",
    },
  );
}

async function obtenerArchivoSolicitudImpresion(nidSolicitudImpresionArchivo) {
  const archivos = await gestor_base_datos.consulta(
    "SELECT a.*, s.nid_usuario, s.nid_solicitud_impresion, s.estado, p.titulo partitura_titulo " +
      "FROM " +
      constantes.ESQUEMA +
      ".solicitud_impresion_archivos a " +
      "INNER JOIN " +
      constantes.ESQUEMA +
      ".solicitudes_impresion s ON s.nid_solicitud_impresion = a.nid_solicitud_impresion " +
      "INNER JOIN " +
      constantes.ESQUEMA +
      ".partituras p ON p.nid_partitura = a.nid_partitura " +
      "WHERE a.nid_solicitud_impresion_archivo = " +
      escapeSql(nidSolicitudImpresionArchivo) +
      " LIMIT 1",
  );

  if (archivos.length === 0) {
    throw crearError(
      "No se ha encontrado el archivo de impresión indicado",
      "ARCHIVO_SOLICITUD_NO_ENCONTRADO",
      404,
    );
  }

  const archivo = archivos[0];

  return {
    nombre_archivo:
      archivo.nombre_archivo ||
      archivo.partitura_titulo ||
      archivo.drive_file_id ||
      "archivo_impresion",
    mime_type: archivo.mime_type || "application/octet-stream",
    size_bytes: archivo.size_bytes,
    nid_solicitud_impresion_archivo: archivo.nid_solicitud_impresion_archivo,
    nid_solicitud_impresion: archivo.nid_solicitud_impresion,
    estado: archivo.estado,
  };
}

async function descargarArchivoSolicitudImpresion(nidSolicitudImpresionArchivo) {
  const archivo = await obtenerArchivoSolicitudImpresion(
    nidSolicitudImpresionArchivo,
  );
  const descarga = await gestorDrivePartituras.obtenerArchivoDriveComoStream(
    archivo.drive_file_id,
    {
      nombre_archivo: archivo.nombre_archivo,
      mime_type: archivo.mime_type,
    },
  );

  return {
    ...archivo,
    ...descarga,
  };
}

module.exports.obtenerConfiguracionCuota = obtenerConfiguracionCuota;
module.exports.guardarConfiguracionCuota = guardarConfiguracionCuota;
module.exports.inspeccionarPartitura = inspeccionarPartitura;
module.exports.crearSolicitudImpresion = crearSolicitudImpresion;
module.exports.listarSolicitudesUsuario = listarSolicitudesUsuario;
module.exports.obtenerSolicitudUsuario = obtenerSolicitudUsuario;
module.exports.cancelarSolicitudUsuario = cancelarSolicitudUsuario;
module.exports.reclamarSolicitudesPendientes = reclamarSolicitudesPendientes;
module.exports.actualizarSolicitudDesdeApi = actualizarSolicitudDesdeApi;
module.exports.obtenerArchivoSolicitudImpresion = obtenerArchivoSolicitudImpresion;
module.exports.descargarArchivoSolicitudImpresion =
  descargarArchivoSolicitudImpresion;
