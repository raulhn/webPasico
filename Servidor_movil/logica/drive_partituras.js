const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const HOSTS_VALIDOS = new Set(["drive.google.com", "docs.google.com"]);
const MIMES_IMPRIMIBLES = new Set([
  "application/pdf",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/tiff",
  "image/webp",
]);
const EXTENSIONES_MIME = {
  "application/pdf": ".pdf",
  "image/bmp": ".bmp",
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/tiff": ".tiff",
  "image/webp": ".webp",
};

function crearError(mensaje, codigo = "IMPRESION_DRIVE", estadoHttp = 400) {
  const error = new Error(mensaje);
  error.codigo = codigo;
  error.estadoHttp = estadoHttp;
  return error;
}

function tieneValor(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function normalizarMimeType(mimeType) {
  if (!tieneValor(mimeType)) {
    return null;
  }
  return mimeType.split(";")[0].trim().toLowerCase();
}

function esMimeImprimible(mimeType) {
  const mimeNormalizado = normalizarMimeType(mimeType);
  if (!mimeNormalizado) {
    return null;
  }
  return MIMES_IMPRIMIBLES.has(mimeNormalizado);
}

function normalizarPrivateKey(privateKey) {
  if (!tieneValor(privateKey)) {
    return "";
  }
  return privateKey.replace(/\\n/g, "\n");
}

function obtenerApiKeyDrive() {
  if (tieneValor(process.env.GOOGLE_DRIVE_API_KEY)) {
    return process.env.GOOGLE_DRIVE_API_KEY.trim();
  }
  if (tieneValor(process.env.GOOGLE_API_KEY)) {
    return process.env.GOOGLE_API_KEY.trim();
  }
  return "";
}

function obtenerClienteDrive() {
  if (
    tieneValor(process.env.GOOGLE_DRIVE_CLIENT_EMAIL) &&
    tieneValor(process.env.GOOGLE_DRIVE_PRIVATE_KEY)
  ) {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_DRIVE_CLIENT_EMAIL.trim(),
      null,
      normalizarPrivateKey(process.env.GOOGLE_DRIVE_PRIVATE_KEY),
      ["https://www.googleapis.com/auth/drive.readonly"],
    );

    return google.drive({ version: "v3", auth });
  }

  const apiKey = obtenerApiKeyDrive();
  if (apiKey) {
    return google.drive({ version: "v3", auth: apiKey });
  }

  return null;
}

function tieneConfiguracionDrive() {
  return obtenerClienteDrive() !== null;
}

function validarDriveId(driveId) {
  return /^[A-Za-z0-9_-]{10,}$/.test(driveId);
}

function construirUrlArchivo(driveId) {
  return "https://drive.google.com/file/d/" + driveId + "/view";
}

function construirUrlCarpeta(driveId) {
  return "https://drive.google.com/drive/folders/" + driveId;
}

function extraerIdRuta(pathname, expresion) {
  const coincidencia = pathname.match(expresion);
  return coincidencia ? coincidencia[1] : null;
}

function parsearUrlDrive(urlPartitura) {
  if (!tieneValor(urlPartitura)) {
    throw crearError(
      "Debe indicar una URL de Google Drive",
      "GOOGLE_DRIVE_URL_REQUERIDA",
      400,
    );
  }

  let url;
  try {
    url = new URL(urlPartitura.trim());
  } catch (error) {
    throw crearError(
      "La URL indicada no es válida",
      "GOOGLE_DRIVE_URL_INVALIDA",
      400,
    );
  }

  if (!HOSTS_VALIDOS.has(url.hostname)) {
    throw crearError(
      "Solo se aceptan URLs de Google Drive o Google Docs",
      "GOOGLE_DRIVE_HOST_INVALIDO",
      400,
    );
  }

  let tipo = null;
  let driveId = null;

  if (url.hostname === "drive.google.com") {
    driveId = extraerIdRuta(
      url.pathname,
      /^\/drive(?:\/u\/\d+)?\/folders\/([^/]+)/,
    );
    if (driveId) {
      tipo = "CARPETA";
    }

    if (!driveId) {
      driveId = extraerIdRuta(url.pathname, /^\/file\/d\/([^/]+)/);
      if (driveId) {
        tipo = "ARCHIVO";
      }
    }

    if (!driveId && (url.pathname === "/open" || url.pathname === "/uc")) {
      driveId = url.searchParams.get("id");
      if (driveId) {
        tipo = "ARCHIVO";
      }
    }
  }

  if (!driveId && url.hostname === "docs.google.com") {
    driveId = extraerIdRuta(
      url.pathname,
      /^\/(?:document|spreadsheets|presentation|drawings|forms)\/d\/([^/]+)/,
    );
    if (driveId) {
      tipo = "ARCHIVO";
    }
  }

  if (!driveId || !tipo || !validarDriveId(driveId)) {
    throw crearError(
      "La URL de Google Drive no tiene un identificador compatible",
      "GOOGLE_DRIVE_ID_INVALIDO",
      400,
    );
  }

  return {
    tipo,
    drive_id: driveId,
    url_normalizada:
      tipo === "CARPETA"
        ? construirUrlCarpeta(driveId)
        : construirUrlArchivo(driveId),
  };
}

function manejarErrorDrive(error, mensajeBase) {
  if (error && error.codigo) {
    throw error;
  }

  const codigo =
    error && error.code
      ? Number(error.code)
      : error && error.response && error.response.status
        ? Number(error.response.status)
        : 0;
  if (codigo === 404) {
    throw crearError(
      "No se ha encontrado el recurso de Google Drive",
      "DRIVE_NO_ENCONTRADO",
      404,
    );
  }

  if (codigo === 401 || codigo === 403) {
    throw crearError(
      "No se puede acceder al recurso de Google Drive con la configuración actual",
      "DRIVE_ACCESO_DENEGADO",
      403,
    );
  }

  console.error("drive_partituras -> manejarErrorDrive:", error);
  throw crearError(
    mensajeBase || "Error al consultar Google Drive",
    "DRIVE_ERROR",
    502,
  );
}

function normalizarArchivoDrive(archivo) {
  const mimeType = normalizarMimeType(archivo.mimeType);
  const driveParentId =
    Array.isArray(archivo.parents) && archivo.parents.length > 0
      ? archivo.parents[0]
      : null;

  return {
    drive_file_id: archivo.id,
    drive_parent_id: driveParentId,
    nombre_archivo: archivo.name || archivo.id,
    mime_type: mimeType,
    size_bytes: archivo.size ? Number(archivo.size) : null,
    web_view_link: archivo.webViewLink || construirUrlArchivo(archivo.id),
    imprimible: esMimeImprimible(mimeType),
  };
}

async function obtenerMetadataArchivo(driveFileId) {
  const drive = obtenerClienteDrive();
  if (!drive) {
    return null;
  }

  try {
    const respuesta = await drive.files.get({
      fileId: driveFileId,
      fields: "id, name, mimeType, parents, size, webViewLink",
      supportsAllDrives: true,
    });
    return normalizarArchivoDrive(respuesta.data);
  } catch (error) {
    manejarErrorDrive(error, "Error al obtener los metadatos del archivo");
  }
}

async function listarArchivosCarpeta(driveFolderId) {
  if (!tieneConfiguracionDrive()) {
    throw crearError(
      "La inspección de carpetas públicas requiere GOOGLE_DRIVE_API_KEY o una cuenta de servicio de solo lectura",
      "CONFIGURACION_DRIVE_NO_DISPONIBLE",
      503,
    );
  }

  const drive = obtenerClienteDrive();
  const archivos = [];
  let pageToken = null;

  try {
    do {
      const respuesta = await drive.files.list({
        q:
          "'" +
          driveFolderId +
          "' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'",
        fields: "nextPageToken, files(id, name, mimeType, parents, size, webViewLink)",
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        orderBy: "name",
        pageSize: 200,
        pageToken,
      });

      const ficherosPagina = respuesta.data.files || [];
      for (let i = 0; i < ficherosPagina.length; i++) {
        archivos.push(normalizarArchivoDrive(ficherosPagina[i]));
      }

      pageToken = respuesta.data.nextPageToken || null;
    } while (pageToken);
  } catch (error) {
    manejarErrorDrive(error, "Error al listar la carpeta de Google Drive");
  }

  return archivos;
}

async function inspeccionarUrlDrive(urlPartitura) {
  const recurso = parsearUrlDrive(urlPartitura);

  if (recurso.tipo === "ARCHIVO") {
    const metadata = await obtenerMetadataArchivo(recurso.drive_id);
    const archivo = metadata || {
      drive_file_id: recurso.drive_id,
      drive_parent_id: null,
      nombre_archivo: recurso.drive_id,
      mime_type: null,
      size_bytes: null,
      web_view_link: recurso.url_normalizada,
      imprimible: true,
      metadatos_parciales: true,
    };

    return {
      tipo: recurso.tipo,
      drive_id: recurso.drive_id,
      url_normalizada: recurso.url_normalizada,
      requiere_configuracion: false,
      archivos: [archivo],
    };
  }

  const archivos = await listarArchivosCarpeta(recurso.drive_id);
  return {
    tipo: recurso.tipo,
    drive_id: recurso.drive_id,
    url_normalizada: recurso.url_normalizada,
    requiere_configuracion: false,
    archivos,
  };
}

function limpiarNombreArchivo(nombreArchivo) {
  const nombreBase = String(nombreArchivo || "archivo_drive")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return nombreBase || "archivo_drive";
}

function obtenerExtension(nombreArchivo, mimeType) {
  const extensionExistente = path.extname(nombreArchivo || "");
  if (extensionExistente) {
    return extensionExistente;
  }

  const mimeNormalizado = normalizarMimeType(mimeType);
  return EXTENSIONES_MIME[mimeNormalizado] || "";
}

async function descargarArchivoDrive(
  driveFileId,
  directorioDestino,
  nombrePreferido,
  metadata = {},
) {
  const drive = obtenerClienteDrive();
  if (!drive) {
    throw crearError(
      "La descarga requiere GOOGLE_DRIVE_API_KEY o una cuenta de servicio de solo lectura",
      "CONFIGURACION_DRIVE_NO_DISPONIBLE",
      503,
    );
  }

  let respuesta;
  try {
    respuesta = await drive.files.get(
      {
        fileId: driveFileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "arraybuffer",
      },
    );
  } catch (error) {
    manejarErrorDrive(error, "Error al descargar el fichero de Google Drive");
  }

  const mimeType = normalizarMimeType(
    respuesta.headers["content-type"] || metadata.mime_type,
  );
  if (mimeType && mimeType.indexOf("text/html") === 0) {
    throw crearError(
      "Google Drive devolvió HTML en lugar del fichero imprimible",
      "DRIVE_RESPUESTA_HTML",
      502,
    );
  }

  if (mimeType && !esMimeImprimible(mimeType)) {
    throw crearError(
      "El fichero de Google Drive no tiene un formato imprimible soportado",
      "MIME_NO_IMPRIMIBLE",
      400,
    );
  }

  const nombreSeguro = limpiarNombreArchivo(
    nombrePreferido || metadata.nombre_archivo || driveFileId,
  );
  const extension = obtenerExtension(nombreSeguro, mimeType);
  const nombreFinal = path.extname(nombreSeguro)
    ? nombreSeguro
    : nombreSeguro + extension;

  await fs.promises.mkdir(directorioDestino, { recursive: true });
  const rutaLocal = path.resolve(directorioDestino, nombreFinal);
  const contenido = Buffer.from(respuesta.data);
  await fs.promises.writeFile(rutaLocal, contenido);

  return {
    ruta_local: rutaLocal,
    nombre_archivo: nombreFinal,
    mime_type: mimeType,
    size_bytes: contenido.length,
  };
}

async function obtenerArchivoDriveComoStream(driveFileId, metadata = {}) {
  const drive = obtenerClienteDrive();
  if (!drive) {
    throw crearError(
      "La descarga requiere GOOGLE_DRIVE_API_KEY o una cuenta de servicio de solo lectura",
      "CONFIGURACION_DRIVE_NO_DISPONIBLE",
      503,
    );
  }

  let respuesta;
  try {
    respuesta = await drive.files.get(
      {
        fileId: driveFileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "stream",
      },
    );
  } catch (error) {
    manejarErrorDrive(error, "Error al descargar el fichero de Google Drive");
  }

  const mimeType = normalizarMimeType(
    respuesta.headers["content-type"] || metadata.mime_type,
  );
  if (mimeType && mimeType.indexOf("text/html") === 0) {
    throw crearError(
      "Google Drive devolvió HTML en lugar del fichero imprimible",
      "DRIVE_RESPUESTA_HTML",
      502,
    );
  }

  if (mimeType && !esMimeImprimible(mimeType)) {
    throw crearError(
      "El fichero de Google Drive no tiene un formato imprimible soportado",
      "MIME_NO_IMPRIMIBLE",
      400,
    );
  }

  const sizeBytes = Number.parseInt(respuesta.headers["content-length"], 10);
  return {
    stream: respuesta.data,
    mime_type: mimeType,
    size_bytes:
      Number.isSafeInteger(sizeBytes) && sizeBytes >= 0 ? sizeBytes : null,
  };
}

module.exports.crearError = crearError;
module.exports.tieneConfiguracionDrive = tieneConfiguracionDrive;
module.exports.parsearUrlDrive = parsearUrlDrive;
module.exports.esMimeImprimible = esMimeImprimible;
module.exports.inspeccionarUrlDrive = inspeccionarUrlDrive;
module.exports.descargarArchivoDrive = descargarArchivoDrive;
module.exports.obtenerArchivoDriveComoStream = obtenerArchivoDriveComoStream;
