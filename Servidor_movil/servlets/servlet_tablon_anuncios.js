const gestorTablonAnuncios = require("../logica/tablon_anuncios");
const gestorTablonAnuncionsAsignatura = require("../logica/tablon_anuncios_asignatura");
const constantes = require("../constantes");
const servlet_comun = require("./servlet_comun");
const gestorProfesores = require("../logica/profesores");
const servletPersona = require("./servlet_persona");

// Comprueba si el usuario tiene permisos para acceder a la escuela y si es profesor de la asignatura
async function tienePermisosEscuela(req, res) {
  try {
    const rolAdministrador = [constantes.ADMINISTRADOR];
    const rolProfesor = [constantes.PROFESOR];

    const bAdministrador = await servlet_comun.comprobarRol(
      req,
      rolAdministrador
    );
    const bProfesor = await servlet_comun.comprobarRol(req, rolProfesor);

    if (!bAdministrador && !bProfesor) {
      return false;
    } else {
      const nid_asignatura = req.body.nid_asignatura;

      if (!bAdministrador) {
        const nid_persona = await servletPersona.obtenerNidPersona(req);
        const bEsProfesor = await gestorProfesores.esProfesor(
          nid_persona,
          nid_asignatura
        );

        return bEsProfesor;
      }
      return true;
    }
  } catch (error) {
    console.log("servlet_tablon_anuncios.js -> tienePermisosEscuela: ", error);
    throw new Error("Error al comprobar permisos de acceso a la escuela");
  }
}

async function compruebaPermisos(req, res, nidTipoTablon) {
  const rolBanda = [constantes.ADMINISTRADOR, constantes.DIRECTOR];
  const rolAdministrador = [constantes.ADMINISTRADOR];

  const bPermisosEscuela = await tienePermisosEscuela(req, res);
  const bPermisosBanda = await servlet_comun.comprobarRol(req, rolBanda);
  const bPermisosAdministrador = await servlet_comun.comprobarRol(
    req,
    rolAdministrador
  );

  return (
    (nidTipoTablon == constantes.ESCUELA && bPermisosEscuela) ||
    (nidTipoTablon == constantes.BANDA && bPermisosBanda) ||
    (nidTipoTablon == constantes.ASOCIACION && bPermisosAdministrador) ||
    (nidTipoTablon == constantes.GENERAL && bPermisosAdministrador)
  );
}

async function insertarTablonAnuncio(req, res) {
  try {
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const nidTipoTablon = req.body.nid_tipo_tablon;

    const bPermisos = await compruebaPermisos(req, res, nidTipoTablon);

    if (!bPermisos) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para insertar un anuncio en este tablón",
      });
      return;
    }
    const nid_tablon_anuncio = await gestorTablonAnuncios.insertarTablonAnuncio(
      titulo,
      descripcion,
      nidTipoTablon
    );

    if (nidTipoTablon == constantes.ESCUELA) {
      const nid_asignatura = req.body.nid_asignatura;
      // Si es un anuncio de escuela, se asocia a la asignatura
      const nid_tablon_anuncio_asignatura =
        await gestorTablonAnuncionsAsignatura.actualizarTablonAnuncioAsignatura(
          nid_tablon_anuncio,
          nid_asignatura
        );
    }

    res.status(200).send({
      error: false,
      mensaje: "Anuncio registrado correctamente",
    });
  } catch (error) {
    console.log("servlet_tablon_anuncios.js -> insertarTablonAnuncio: ", error);
    res.status(400).send({
      error: true,
      mensaje: "Se ha producido un error al insertar el tablon de anuncios",
    });
  }
}

async function actualizarTablonAnuncio(req, res) {
  try {
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;
    const nidTipoTablon = req.body.nid_tipo_tablon;
    const nid_tablon_anuncio = req.body.nid_tablon_anuncio;

    const bPermisos = await compruebaPermisos(req, res, nidTipoTablon);

    if (!bPermisos) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para actualizar este anuncio",
      });
      return;
    }

    await gestorTablonAnuncios.actualizarTablonAnuncio(
      nid_tablon_anuncio_asignatura,
      titulo,
      descripcion,
      nidTipoTablon
    );

    if (nidTipoTablon == constantes.ESCUELA) {
      const nid_tablon_anuncio_asignatura =
        req.body.nid_tablon_anuncio_asignatura;
      const nid_asignatura = req.body.nid_asignatura;

      // Se actualiza el anuncio de la asignatura
      await gestorTablonAnuncionsAsignatura.actualizarTablonAnuncioAsignatura(
        nid_tablon_anuncio_asignatura,
        nid_tablon_anuncio,
        nid_asignatura
      );
    }

    res.status(200).send({
      error: false,
      mensaje: "Anuncio actualizado correctamente",
    });
  } catch (error) {
    console.log(
      "servlet_tablon_anuncios.js -> actualizarTablonAnuncio: ",
      error
    );
    res.status(400).send({
      error: true,
      mensaje: "Se ha producido un error al actualizar el tablon de anuncios",
    });
  }
}

async function obtenerAnuncios(req, res) {
  try {
    const tablonesAnuncios =
      await gestorTablonAnuncios.obtenerTablonesAnuncioGeneral();

    res.status(200).send({
      error: false,
      tablones_anuncios: tablonesAnuncios,
    });
  } catch (error) {
    console.log(
      "servlet_tablon_anuncios.js -> obtenerTablonesAnuncios: ",
      error
    );
    res.status(500).send({
      error: true,
      mensaje: "Se ha producido un error al obtener los tablones de anuncios",
    });
  }
}

async function obtenerTablonAnuncio(req, res) {
  try {
    const nid_tablon_anuncio = req.params.nid_tablon_anuncio;

    const tabloneAnuncio =
      await gestorTablonAnuncios.obtenerTablonAnuncio(nid_tablon_anuncio);

    const bTienePermisos = await compruebaPermisos(
      req,
      res,
      tabloneAnuncio.nid_tipo_tablon
    );

    if (
      !bTienePermisos ||
      tabloneAnuncio.nid_tipo_tablon == constantes.GENERAL
    ) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para acceder a este tablón de anuncios",
      });
      return;
    }

    res.status(200).send({
      error: false,
      tablones_anuncios: tabloneAnuncio,
    });
  } catch (error) {
    console.log("servlet_tablon_anuncios.js -> obtenerTablonAnuncio: ", error);
    res.status(500).send({
      error: true,
      mensaje: "Se ha producido un error al obtener el tablón de anuncios",
    });
  }
}

module.exports.insertarTablonAnuncio = insertarTablonAnuncio;
module.exports.actualizarTablonAnuncio = actualizarTablonAnuncio;
module.exports.obtenerAnuncios = obtenerAnuncios;
module.exports.obtenerTablonAnuncio = obtenerTablonAnuncio;
