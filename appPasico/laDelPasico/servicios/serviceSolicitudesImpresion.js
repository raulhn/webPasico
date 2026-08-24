const serviceComun = require("./serviceComun");
const constantes = require("../config/constantes");

function construirQueryString(filtros = {}) {
  const queryString = Object.entries(filtros)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== "")
    .map(
      ([clave, valor]) =>
        `${encodeURIComponent(clave)}=${encodeURIComponent(valor)}`
    )
    .join("&");

  return queryString ? `?${queryString}` : "";
}

function peticionAutenticada(metodo, ruta, body, cerrarSesion = () => {}) {
  return serviceComun.peticionSesion(
    metodo,
    constantes.URL_SERVICIO_MOVIL + ruta,
    body,
    cerrarSesion
  );
}

function explorarPartituraImpresion(nidPartitura, cerrarSesion) {
  return peticionAutenticada(
    "GET",
    `explorar_partitura_impresion/${nidPartitura}`,
    null,
    cerrarSesion
  );
}

function registrarSolicitudImpresion(solicitud, cerrarSesion) {
  const archivos = Array.isArray(solicitud?.archivos) ? solicitud.archivos : [];
  const opcionesEntrada = solicitud?.opciones || {};
  const opciones = {
    ...opcionesEntrada,
    escala:
      opcionesEntrada.escala ||
      opcionesEntrada.escala_porcentaje ||
      solicitud?.escala_porcentaje ||
      100,
    rango_paginas:
      opcionesEntrada.rango_paginas ||
      opcionesEntrada.rangoPaginas ||
      solicitud?.rango_paginas ||
      null,
  };

  return peticionAutenticada(
    "POST",
    "registrar_solicitud_impresion",
    {
      nid_partitura: solicitud?.nid_partitura,
      archivos: archivos.map((archivo) => ({
        drive_file_id:
          archivo?.drive_file_id ||
          archivo?.referencia ||
          archivo?.id,
      })),
      rango_paginas: solicitud?.rango_paginas || null,
      escala_porcentaje: solicitud?.escala_porcentaje || 100,
      idempotency_key: solicitud?.idempotency_key,
      opciones,
    },
    cerrarSesion
  );
}

function obtenerSolicitudesImpresion(filtros = {}, cerrarSesion) {
  return peticionAutenticada(
    "GET",
    `obtener_solicitudes_impresion${construirQueryString(filtros)}`,
    null,
    cerrarSesion
  );
}

function obtenerSolicitudImpresion(nidSolicitudImpresion, cerrarSesion) {
  return peticionAutenticada(
    "GET",
    `obtener_solicitud_impresion/${nidSolicitudImpresion}`,
    null,
    cerrarSesion
  );
}

function cancelarSolicitudImpresion(nidSolicitudImpresion, cerrarSesion) {
  return peticionAutenticada(
    "POST",
    "cancelar_solicitud_impresion",
    {
      nid_solicitud_impresion: nidSolicitudImpresion,
    },
    cerrarSesion
  );
}

function obtenerCuotasImpresion(cerrarSesion) {
  return peticionAutenticada("GET", "obtener_cuotas_impresion", null, cerrarSesion);
}

function actualizarCuotaImpresion(cuota, cerrarSesion) {
  return peticionAutenticada(
    "POST",
    "actualizar_cuota_impresion",
    cuota,
    cerrarSesion
  );
}

module.exports.explorarPartituraImpresion = explorarPartituraImpresion;
module.exports.registrarSolicitudImpresion = registrarSolicitudImpresion;
module.exports.obtenerSolicitudesImpresion = obtenerSolicitudesImpresion;
module.exports.obtenerSolicitudImpresion = obtenerSolicitudImpresion;
module.exports.cancelarSolicitudImpresion = cancelarSolicitudImpresion;
module.exports.obtenerCuotasImpresion = obtenerCuotasImpresion;
module.exports.actualizarCuotaImpresion = actualizarCuotaImpresion;
