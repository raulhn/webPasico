function normalizarTexto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function normalizarIdentificador(valor) {
  if (typeof valor === "string") {
    return valor.trim();
  }

  if (typeof valor === "number" && Number.isFinite(valor)) {
    return String(valor);
  }

  return "";
}

function obtenerEntero(valor) {
  const numero = Number.parseInt(valor, 10);
  return Number.isFinite(numero) ? numero : null;
}

function extraerArray(datos, claves = []) {
  if (Array.isArray(datos)) {
    return datos;
  }

  for (let i = 0; i < claves.length; i += 1) {
    const valor = datos?.[claves[i]];
    if (Array.isArray(valor)) {
      return valor;
    }
  }

  return [];
}

function obtenerNombreDesdeRuta(ruta) {
  const texto = normalizarTexto(ruta);
  if (!texto) {
    return "";
  }

  const segmentos = texto.split("/").filter(Boolean);
  return segmentos.length > 0 ? segmentos[segmentos.length - 1] : texto;
}

function esRutaAbsoluta(ruta) {
  const texto = normalizarTexto(ruta);
  return texto.startsWith("/") || /^[A-Za-z]:[\\/]/.test(texto);
}

function parsearOpciones(opciones) {
  if (!opciones) {
    return {};
  }

  if (typeof opciones === "string") {
    try {
      return JSON.parse(opciones);
    } catch {
      return {};
    }
  }

  return typeof opciones === "object" ? opciones : {};
}

function obtenerColorEstadoSolicitud(estado) {
  switch ((estado || "").toUpperCase()) {
    case "COMPLETADA":
    case "FINALIZADA":
      return "#2e7d32";
    case "CANCELADA":
      return "#b71c1c";
    case "ERROR":
    case "FALLIDA":
    case "RECHAZADA":
      return "#ef6c00";
    default:
      return "#1565c0";
  }
}

export function normalizarArchivosImpresion(archivos) {
  return extraerArray(archivos).reduce((resultado, archivo, indice) => {
    if (typeof archivo === "string") {
      const nombre = obtenerNombreDesdeRuta(archivo) || `Archivo ${indice + 1}`;
      const rutaRelativa = esRutaAbsoluta(archivo) ? "" : archivo;
      resultado.push({
        id: `${nombre}-${indice}`,
        etiqueta: nombre,
        descripcion: rutaRelativa || nombre,
        ruta: archivo,
        rutaRelativa,
        referenciaServidor: rutaRelativa || nombre,
        paginas: null,
        seleccionadoPorDefecto: extraerArray(archivos).length === 1,
        original: { ruta: archivo },
      });
      return resultado;
    }

    if (!archivo || typeof archivo !== "object") {
      return resultado;
    }

    const ruta =
      normalizarTexto(archivo.ruta) ||
      normalizarTexto(archivo.path) ||
      normalizarTexto(archivo.url);
    const rutaRelativaCandidata =
      normalizarTexto(archivo.ruta_relativa) ||
      normalizarTexto(archivo.relative_path) ||
      ruta;
    const rutaRelativa = esRutaAbsoluta(rutaRelativaCandidata)
      ? ""
      : rutaRelativaCandidata;
    const etiqueta =
      normalizarTexto(archivo.etiqueta) ||
      normalizarTexto(archivo.nombre_mostrar) ||
      normalizarTexto(archivo.nombre_archivo) ||
      normalizarTexto(archivo.nombre) ||
      normalizarTexto(archivo.filename) ||
      obtenerNombreDesdeRuta(rutaRelativa) ||
      `Archivo ${indice + 1}`;
    const paginas =
      obtenerEntero(archivo.paginas) ||
      obtenerEntero(archivo.total_paginas) ||
      null;

    let descripcion = normalizarTexto(archivo.descripcion);
    if (!descripcion) {
      const fragmentos = [];
      if (rutaRelativa && rutaRelativa !== etiqueta) {
        fragmentos.push(rutaRelativa);
      }
      if (paginas) {
        fragmentos.push(`${paginas} pág.`);
      }
      descripcion = fragmentos.join(" · ");
    }

    resultado.push({
      id:
        normalizarTexto(archivo.id) ||
        normalizarTexto(archivo.identificador) ||
        normalizarTexto(archivo.nid_archivo) ||
        normalizarTexto(archivo.drive_file_id) ||
        rutaRelativa ||
        `${etiqueta}-${indice}`,
      etiqueta,
      descripcion,
      ruta,
      rutaRelativa,
      referenciaServidor:
        normalizarTexto(archivo.referencia) ||
        normalizarTexto(archivo.drive_file_id) ||
        normalizarTexto(archivo.file_id) ||
        normalizarTexto(archivo.id_archivo) ||
        rutaRelativa ||
        etiqueta,
      paginas,
      seleccionadoPorDefecto: Boolean(
        archivo.seleccionado_por_defecto ||
          archivo.default ||
          archivo.recomendado ||
          extraerArray(archivos).length === 1
      ),
      original: archivo,
    });

    return resultado;
  }, []);
}

export function normalizarCuotaImpresion(cuota, indice = 0) {
  if (!cuota || typeof cuota !== "object") {
    return null;
  }

  const limite =
    obtenerEntero(cuota.limite) ||
    obtenerEntero(cuota.limite_mensual) ||
    obtenerEntero(cuota.maximo) ||
    null;
  const usadas =
    obtenerEntero(cuota.usadas) ||
    obtenerEntero(cuota.consumidas) ||
    obtenerEntero(cuota.solicitudes_mes) ||
    null;
  const disponibles =
    obtenerEntero(cuota.disponibles) ||
    obtenerEntero(cuota.restantes) ||
    (limite !== null && usadas !== null ? Math.max(limite - usadas, 0) : null);

  return {
    id:
      normalizarTexto(cuota.id) ||
      normalizarTexto(cuota.nid_cuota_impresion) ||
      `cuota-${indice}`,
    titulo:
      normalizarTexto(cuota.titulo) ||
      normalizarTexto(cuota.nombre) ||
      normalizarTexto(cuota.descripcion) ||
      "Cuota de impresión",
    periodo:
      normalizarTexto(cuota.periodo) ||
      normalizarTexto(cuota.mes) ||
      normalizarTexto(cuota.descripcion_periodo),
    limite,
    usadas,
    disponibles,
  };
}

export function obtenerCuotaDestacada(respuesta) {
  const cuotaDirecta = normalizarCuotaImpresion(
    respuesta?.cuota || respuesta?.quota || null
  );
  if (cuotaDirecta) {
    return cuotaDirecta;
  }

  const cuotas = extraerArray(respuesta, ["cuotas", "items", "data", "quotas"])
    .map((item, indice) => normalizarCuotaImpresion(item, indice))
    .filter(Boolean);

  return cuotas.length > 0 ? cuotas[0] : null;
}

export function normalizarInspeccionImpresion(respuesta, partitura = null) {
  const datos = respuesta?.inspeccion || respuesta || {};
  const archivos = normalizarArchivosImpresion(
    datos.archivos ||
      datos.ficheros ||
      datos.files ||
      datos.pdfs ||
      datos.partitura?.archivos ||
      []
  );
  const escalaPorcentaje =
    obtenerEntero(
      datos.escala_porcentaje_predeterminada || datos.escala_porcentaje
    ) || 100;

  return {
    archivos,
    carpeta:
      normalizarTexto(datos.carpeta) ||
      normalizarTexto(datos.directorio) ||
      normalizarTexto(datos.ruta_carpeta),
    mensaje:
      normalizarTexto(datos.mensaje) || normalizarTexto(respuesta?.mensaje),
    rangoPaginas:
      normalizarTexto(datos.rango_paginas_predeterminado) ||
      normalizarTexto(datos.rango_paginas),
    escalaPorcentaje,
    cuota: obtenerCuotaDestacada(datos) || obtenerCuotaDestacada(respuesta),
    documento:
      normalizarTexto(datos.documento) ||
      normalizarTexto(datos.nombre_documento) ||
      normalizarTexto(partitura?.titulo),
  };
}

export function normalizarSolicitudImpresion(solicitud, indice = 0) {
  const datos = solicitud?.solicitud || solicitud || {};
  const opciones = parsearOpciones(datos.opciones);
  const estado = (
    normalizarTexto(datos.estado) ||
    normalizarTexto(datos.status) ||
    "PENDIENTE"
  ).toUpperCase();
  const archivos = normalizarArchivosImpresion(
    datos.archivos ||
      opciones.archivos ||
      opciones.archivos_seleccionados ||
      opciones.ficheros ||
      []
  );

  return {
    id:
      normalizarIdentificador(datos.id) ||
      normalizarIdentificador(datos.nid_solicitud_impresion) ||
      `solicitud-${indice}`,
    estado,
    estadoEtiqueta: estado.split("_").join(" "),
    mensaje:
      normalizarTexto(datos.mensaje) ||
      normalizarTexto(datos.detalle) ||
      normalizarTexto(datos.resultado),
    mensajeError:
      normalizarTexto(datos.mensaje_error) || normalizarTexto(datos.error),
    fechaSolicitud:
      normalizarTexto(datos.fecha_solicitud) ||
      normalizarTexto(datos.fecha_creacion) ||
      normalizarTexto(datos.created_at),
    fechaActualizacion:
      normalizarTexto(datos.fecha_actualizacion) ||
      normalizarTexto(datos.updated_at),
    trabajoCups:
      normalizarTexto(datos.trabajo_cups) ||
      normalizarTexto(datos.cups_job_id),
    partitura: {
      titulo:
        normalizarTexto(datos.partitura?.titulo) ||
        normalizarTexto(datos.partitura_titulo),
    },
    archivos,
    rangoPaginas:
      normalizarTexto(datos.rango_paginas) ||
      normalizarTexto(opciones.rango_paginas),
    escalaPorcentaje:
      obtenerEntero(datos.escala_porcentaje) ||
      obtenerEntero(opciones.escala_porcentaje) ||
      null,
    ejecuciones: extraerArray(datos, ["ejecuciones", "historial", "jobs"]),
  };
}

export function normalizarListadoSolicitudesImpresion(respuesta) {
  return extraerArray(respuesta, ["solicitudes", "items", "data"]).map(
    (solicitud, indice) => normalizarSolicitudImpresion(solicitud, indice)
  );
}

export function generarIdempotencyKeyImpresion(nidPartitura) {
  return `app-${nidPartitura}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function validarRangoPaginasImpresion(rangoPaginas) {
  const valor = normalizarTexto(rangoPaginas);
  if (!valor) {
    return true;
  }

  if (!/^\d+(\s*-\s*\d+)?(\s*,\s*\d+(\s*-\s*\d+)?)*$/.test(valor)) {
    return false;
  }

  return valor.split(",").every((segmento) => {
    const [inicio, fin] = segmento.split("-").map((item) => obtenerEntero(item));
    if (inicio === null) {
      return false;
    }
    if (segmento.includes("-")) {
      return fin !== null && fin >= inicio;
    }
    return true;
  });
}

export function esEstadoSolicitudFinal(estado) {
  return ["COMPLETADA", "FINALIZADA", "CANCELADA", "ERROR", "FALLIDA", "RECHAZADA"].includes(
    (estado || "").toUpperCase()
  );
}

export function esEstadoSolicitudCancelable(estado) {
  return !esEstadoSolicitudFinal(estado);
}

export function formatearFechaSolicitud(fecha) {
  const valor = normalizarTexto(fecha);
  if (!valor) {
    return "Sin fecha";
  }

  const fechaObjeto = new Date(valor);
  if (Number.isNaN(fechaObjeto.getTime())) {
    return valor;
  }

  return fechaObjeto.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function resumirArchivosSolicitud(solicitud) {
  const archivos = normalizarArchivosImpresion(
    solicitud?.archivos ||
      solicitud?.opciones?.archivos ||
      solicitud?.opciones?.archivos_seleccionados ||
      []
  );

  if (archivos.length === 0) {
    return "Sin archivos detallados";
  }

  if (archivos.length === 1) {
    return archivos[0].etiqueta;
  }

  return `${archivos[0].etiqueta} +${archivos.length - 1}`;
}

export { obtenerColorEstadoSolicitud };
