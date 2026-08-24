const gestorSolicitudesImpresion = require("../logica/solicitudes_impresion.js");
const servletComun = require("./servlet_comun.js");
const constantes = require("../constantes.js");

async function obtenerNidUsuario(req) {
  const tokenDecode = await servletComun.obtenerTokenDecoded(req);
  if (!tokenDecode || !tokenDecode.nid_usuario) {
    throw new Error("No autenticado");
  }
  return tokenDecode.nid_usuario;
}

async function explorarPartituraImpresion(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para inspeccionar partituras",
      });
      return;
    }

    const resultado = await gestorSolicitudesImpresion.inspeccionarPartitura({
      nid_partitura: req.params.nid_partitura,
    });
    res.status(200).send({
      error: false,
      ...resultado.inspeccion,
      partitura: resultado.partitura,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> explorarPartituraImpresion:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se ha podido inspeccionar la partitura",
      codigo: error.codigo || "IMPRESION_INSPECCION",
    });
  }
}

async function inspeccionarPartituraDrive(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para inspeccionar partituras",
      });
      return;
    }

    const inspeccion = await gestorSolicitudesImpresion.inspeccionarPartitura(req.body || {});
    res.status(200).send({
      error: false,
      inspeccion,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> inspeccionarPartituraDrive:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se ha podido inspeccionar la partitura",
      codigo: error.codigo || "IMPRESION_INSPECCION",
    });
  }
}

async function registrarSolicitudImpresion(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para solicitar impresiones",
      });
      return;
    }

    const nidUsuario = await obtenerNidUsuario(req);
    const solicitud = await gestorSolicitudesImpresion.crearSolicitudImpresion(
      nidUsuario,
      req.body || {},
      req.headers || {},
    );

    res.status(solicitud.idempotente ? 200 : 201).send({
      error: false,
      solicitud,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> registrarSolicitudImpresion:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se ha podido registrar la solicitud",
      codigo: error.codigo || "IMPRESION_REGISTRO",
    });
  }
}

async function obtenerSolicitudesImpresion(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para consultar solicitudes de impresión",
      });
      return;
    }

    const nidUsuario = await obtenerNidUsuario(req);
    const solicitudes = await gestorSolicitudesImpresion.listarSolicitudesUsuario(nidUsuario);
    res.status(200).send({
      error: false,
      solicitudes,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> obtenerSolicitudesImpresion:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se han podido obtener las solicitudes",
      codigo: error.codigo || "IMPRESION_LISTADO",
    });
  }
}

async function obtenerSolicitudImpresion(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para consultar esta solicitud de impresión",
      });
      return;
    }

    const nidUsuario = await obtenerNidUsuario(req);
    const solicitud = await gestorSolicitudesImpresion.obtenerSolicitudUsuario(
      nidUsuario,
      req.params.nid_solicitud_impresion,
    );

    res.status(200).send({
      error: false,
      solicitud,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> obtenerSolicitudImpresion:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se ha podido obtener la solicitud",
      codigo: error.codigo || "IMPRESION_DETALLE",
    });
  }
}

async function cancelarSolicitudImpresion(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para cancelar solicitudes de impresión",
      });
      return;
    }

    const nidUsuario = await obtenerNidUsuario(req);
    const nidSolicitud =
      (req.body && req.body.nid_solicitud_impresion) ||
      req.params.nid_solicitud_impresion;
    const solicitud = await gestorSolicitudesImpresion.cancelarSolicitudUsuario(
      nidUsuario,
      nidSolicitud,
    );

    res.status(200).send({
      error: false,
      solicitud,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> cancelarSolicitudImpresion:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se ha podido cancelar la solicitud",
      codigo: error.codigo || "IMPRESION_CANCELAR",
    });
  }
}

async function obtenerConfiguracionCuota(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para consultar la configuración de impresión",
      });
      return;
    }

    const configuracion = await gestorSolicitudesImpresion.obtenerConfiguracionCuota();
    res.status(200).send({
      error: false,
      configuracion,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> obtenerConfiguracionCuota:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se ha podido obtener la configuración",
      codigo: error.codigo || "IMPRESION_CONFIGURACION",
    });
  }
}

async function actualizarConfiguracionCuota(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
    const autorizado = await servletComun.comprobarRol(req, res, rolesPermitidos);
    if (!autorizado) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para actualizar la configuración de impresión",
      });
      return;
    }

    const nidUsuario = await obtenerNidUsuario(req);
    const configuracion = await gestorSolicitudesImpresion.guardarConfiguracionCuota(
      nidUsuario,
      req.body || {},
    );

    res.status(200).send({
      error: false,
      configuracion,
    });
  } catch (error) {
    console.error("servlet_solicitudes_impresion -> actualizarConfiguracionCuota:", error);
    res.status(error.estadoHttp || 400).send({
      error: true,
      mensaje: error.message || "No se ha podido actualizar la configuración",
      codigo: error.codigo || "IMPRESION_CONFIGURACION_ACTUALIZAR",
    });
  }
}

function reclamarSolicitudesImpresion(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const solicitudes = await gestorSolicitudesImpresion.reclamarSolicitudesPendientes(
        req.body && req.body.limite,
      );

      res.status(200).send({
        error: false,
        solicitudes,
      });
    } catch (error) {
      console.error("servlet_solicitudes_impresion -> reclamarSolicitudesImpresion:", error);
      res.status(error.estadoHttp || 400).send({
        error: true,
        mensaje: error.message || "No se han podido reclamar solicitudes",
        codigo: error.codigo || "IMPRESION_RECLAMAR",
      });
    }
  });
}

function actualizarSolicitudImpresion(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const solicitud = await gestorSolicitudesImpresion.actualizarSolicitudDesdeApi(
        req.body || {},
      );

      res.status(200).send({
        error: false,
        solicitud,
      });
    } catch (error) {
      console.error("servlet_solicitudes_impresion -> actualizarSolicitudImpresion:", error);
      res.status(error.estadoHttp || 400).send({
        error: true,
        mensaje: error.message || "No se ha podido actualizar la solicitud",
        codigo: error.codigo || "IMPRESION_ACTUALIZAR",
      });
    }
  });
}

function descargarSolicitudImpresionArchivo(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const archivo =
        await gestorSolicitudesImpresion.obtenerArchivoSolicitudImpresion(
          req.params.nid_solicitud_impresion_archivo,
        );

      if (archivo.mime_type) {
        res.type(archivo.mime_type);
      }
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="' + archivo.nombre_archivo + '"',
      );
      res.sendFile(archivo.ruta_local);
    } catch (error) {
      console.error(
        "servlet_solicitudes_impresion -> descargarSolicitudImpresionArchivo:",
        error,
      );
      res.status(error.estadoHttp || 400).send({
        error: true,
        mensaje: error.message || "No se ha podido descargar el archivo",
        codigo: error.codigo || "IMPRESION_DESCARGA",
      });
    }
  });
}

module.exports.inspeccionarPartituraDrive = inspeccionarPartituraDrive;
module.exports.explorarPartituraImpresion = explorarPartituraImpresion;
module.exports.registrarSolicitudImpresion = registrarSolicitudImpresion;
module.exports.obtenerSolicitudesImpresion = obtenerSolicitudesImpresion;
module.exports.obtenerSolicitudImpresion = obtenerSolicitudImpresion;
module.exports.cancelarSolicitudImpresion = cancelarSolicitudImpresion;
module.exports.obtenerConfiguracionCuota = obtenerConfiguracionCuota;
module.exports.actualizarConfiguracionCuota = actualizarConfiguracionCuota;
module.exports.reclamarSolicitudesImpresion = reclamarSolicitudesImpresion;
module.exports.actualizarSolicitudImpresion = actualizarSolicitudImpresion;
module.exports.descargarSolicitudImpresionArchivo =
  descargarSolicitudImpresionArchivo;
