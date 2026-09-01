const { execFile } = require("child_process");
const { promisify } = require("util");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const cron = require("node-cron");
const serviceComun = require("./serviceComun");
const constantes = require("../constantes");

const execFileAsync = promisify(execFile);
const ESTADOS_FINALES = new Set([
  "IMPRESA",
  "RECHAZADA_CUOTA",
  "ERROR_FINAL",
  "CANCELADA",
]);
const MAX_PAGINAS_POR_ARCHIVO = 6;

function obtenerConfiguracion() {
  const cola = process.env.CUPS_PRINTER;
  const servidor = process.env.CUPS_SERVER;
  if (!cola || !servidor) {
    throw new Error(
      "Las variables CUPS_PRINTER y CUPS_SERVER son obligatorias",
    );
  }

  return {
    cola,
    servidor,
    lote: Number.parseInt(process.env.IMPRESION_LOTE || "5", 10),
    timeout: Number.parseInt(process.env.IMPRESION_TIMEOUT_MS || "30000", 10),
    maxBytes: Number.parseInt(
      process.env.IMPRESION_MAX_ARCHIVO_BYTES || "20971520",
      10,
    ),
  };
}

function extensionParaMime(mimeType) {
  const extensiones = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  const extension = extensiones[mimeType];
  if (!extension) {
    throw new Error("El tipo de archivo no está permitido para imprimir");
  }
  return extension;
}

async function descargarFichero(solicitud, fichero, directorioTemporal) {
  const nidArchivo = Number(fichero.nid_solicitud_impresion_archivo);
  if (!Number.isSafeInteger(nidArchivo) || nidArchivo < 1) {
    throw new Error("La solicitud contiene un identificador de archivo inválido");
  }

  const configuracion = obtenerConfiguracion();
  const respuesta = await serviceComun.fetchWithTimeout(
    constantes.URL_SERVICIO_MOVIL +
      "descargar_solicitud_impresion_archivo/" +
      nidArchivo,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.API_KEY_MOVIL,
      },
    },
    configuracion.timeout,
  );

  if (!respuesta.ok) {
    throw new Error("No se pudo descargar el archivo de la solicitud");
  }

  const contentLength = Number(respuesta.headers.get("content-length"));
  if (contentLength && contentLength > configuracion.maxBytes) {
    throw new Error("El archivo excede el tamaño máximo permitido");
  }

  const datos = Buffer.from(await respuesta.arrayBuffer());
  if (!datos.length || datos.length > configuracion.maxBytes) {
    throw new Error("El tamaño descargado no está permitido");
  }

  const tipoRecibido = (respuesta.headers.get("content-type") || "")
    .split(";")[0]
    .toLowerCase();
  if (tipoRecibido && tipoRecibido !== fichero.mime_type) {
    throw new Error("El tipo descargado no coincide con el archivo solicitado");
  }

  const rutaLocal = path.join(
    directorioTemporal,
    nidArchivo + extensionParaMime(fichero.mime_type),
  );
  await fs.writeFile(rutaLocal, datos, { mode: 0o600 });
  return { ...fichero, ruta_local: rutaLocal };
}

function validarOpciones(opciones) {
  const escala = Number(opciones.escala);
  if (!Number.isInteger(escala) || escala < 25 || escala > 200) {
    throw new Error("La escala de impresión debe estar entre 25 y 200");
  }

  if (
    opciones.rango_paginas &&
    !/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(opciones.rango_paginas)
  ) {
    throw new Error("El rango de páginas no es válido");
  }

  if (!opciones.rango_paginas) {
    throw new Error(
      "Debe indicar un rango de hasta " +
        MAX_PAGINAS_POR_ARCHIVO +
        " páginas para imprimir archivos PDF",
    );
  }

  let numeroPaginas = 0;
  for (const segmento of opciones.rango_paginas.split(",")) {
    const limites = segmento.split("-").map((valor) => Number.parseInt(valor, 10));
    const inicio = limites[0];
    const fin = limites.length === 2 ? limites[1] : inicio;
    if (
      !Number.isSafeInteger(inicio) ||
      !Number.isSafeInteger(fin) ||
      inicio < 1 ||
      fin < inicio
    ) {
      throw new Error("El rango de páginas no es válido");
    }

    for (let pagina = inicio; pagina <= fin; pagina += 1) {
      numeroPaginas += 1;
      if (numeroPaginas > MAX_PAGINAS_POR_ARCHIVO) {
        throw new Error(
          "No se pueden imprimir más de " +
            MAX_PAGINAS_POR_ARCHIVO +
            " páginas por archivo",
        );
      }
    }
  }
}

function construirArgumentosCups(solicitud, fichero) {
  if (fichero.mime_type === "application/pdf") {
    validarOpciones(solicitud.opciones);
  }

  const argumentos = [
    "-d",
    obtenerConfiguracion().cola,
    "-o",
    "scaling=" + solicitud.opciones.escala,
  ];

  if (solicitud.opciones.rango_paginas && fichero.mime_type === "application/pdf") {
    argumentos.push("-o", "page-ranges=" + solicitud.opciones.rango_paginas);
  }

  argumentos.push(fichero.ruta_local);
  return argumentos;
}

async function llamarServicioMovil(ruta, opciones) {
  const respuesta = await serviceComun.fetchWithTimeout(
    constantes.URL_SERVICIO_MOVIL + ruta,
    {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY_MOVIL,
        ...(opciones.headers || {}),
      },
    },
    obtenerConfiguracion().timeout,
  );

  if (!respuesta.ok) {
    throw new Error("Servidor_movil respondió con HTTP " + respuesta.status);
  }

  const resultado = await respuesta.json();
  if (resultado.error) {
    throw new Error(resultado.mensaje || "Servidor_movil rechazó la solicitud");
  }
  return resultado;
}

async function reclamarSolicitudes() {
  const configuracion = obtenerConfiguracion();
  const resultado = await llamarServicioMovil(
    "reclamar_solicitudes_impresion",
    {
      method: "POST",
      body: JSON.stringify({ limite: configuracion.lote }),
    },
  );
  return resultado.solicitudes || [];
}

async function actualizarSolicitud(nidSolicitud, estado, datos = {}) {
  return llamarServicioMovil("actualizar_solicitud_impresion", {
    method: "POST",
    body: JSON.stringify({
      nid_solicitud_impresion: nidSolicitud,
      estado,
      ...datos,
    }),
  });
}

async function imprimirSolicitud(solicitud) {
  if (ESTADOS_FINALES.has(solicitud.estado)) {
    return;
  }

  const directorioTemporal = await fs.mkdtemp(
    path.join(os.tmpdir(), "pasico-impresion-"),
  );
  await actualizarSolicitud(solicitud.nid_solicitud_impresion, "IMPRIMIENDO");
  let trabajoCups;

  try {
    for (const fichero of solicitud.archivos) {
      const ficheroTemporal = await descargarFichero(
        solicitud,
        fichero,
        directorioTemporal,
      );
      const argumentos = construirArgumentosCups(solicitud, ficheroTemporal);
      const { stdout } = await execFileAsync("lp", argumentos, {
        timeout: obtenerConfiguracion().timeout,
        env: {
          ...process.env,
          CUPS_SERVER: obtenerConfiguracion().servidor,
        },
      });
      const coincidencia = stdout.match(/request id is ([^\s]+)/i);
      trabajoCups = coincidencia ? coincidencia[1] : trabajoCups;
    }

    await actualizarSolicitud(solicitud.nid_solicitud_impresion, "IMPRESA", {
      trabajo_cups: trabajoCups,
    });
  } catch (error) {
    console.error(
      "Error al imprimir solicitud " + solicitud.nid_solicitud_impresion + ":",
      error.message,
    );
    await actualizarSolicitud(solicitud.nid_solicitud_impresion, "REINTENTABLE", {
      mensaje_error: error.message,
    });
  } finally {
    await fs.rm(directorioTemporal, { recursive: true, force: true });
  }
}

let procesoEnCurso = false;

async function procesarSolicitudesImpresion() {
  if (procesoEnCurso) {
    return;
  }

  procesoEnCurso = true;
  try {
    const solicitudes = await reclamarSolicitudes();
    for (const solicitud of solicitudes) {
      await imprimirSolicitud(solicitud);
    }
  } catch (error) {
    console.error("Error al sincronizar solicitudes de impresión:", error.message);
  } finally {
    procesoEnCurso = false;
  }
}

function iniciarProcesoImpresion() {
  try {
    obtenerConfiguracion();
  } catch (error) {
    console.error("La impresión remota queda deshabilitada:", error.message);
    return;
  }

  cron.schedule("*/1 * * * *", procesarSolicitudesImpresion);
  procesarSolicitudesImpresion();
}

module.exports.iniciarProcesoImpresion = iniciarProcesoImpresion;
module.exports.procesarSolicitudesImpresion = procesarSolicitudesImpresion;
module.exports.construirArgumentosCups = construirArgumentosCups;
