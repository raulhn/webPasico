const gestorTablonAnuncios = require("../logica/tablon_anuncios");
const gestorTablonAnuncionsAsignatura = require("../logica/tablon_anuncios_asignatura");
const gestorMatriculaAsignatura = require("../logica/matricula_asignatura");
const gestorUsuario = require("../logica/usuario");
const gestorSocios = require("../logica/socios");
const gestorPersonas = require("../logica/persona");
const constantes = require("../constantes");
const servlet_comun = require("./servlet_comun");
const gestorProfesores = require("../logica/profesores");
const servletPersona = require("./servlet_persona");
const gestorCursos = require("../logica/curso");

// Comprueba si el usuario tiene permisos para acceder a la escuela y si es profesor de la asignatura
async function tienePermisosRegistroEscuela(req, res) {
  try {
    const rolAdministrador = [constantes.ADMINISTRADOR];
    const rolProfesor = [constantes.PROFESOR];

    const bAdministrador = await servlet_comun.comprobarRol(
      req,
      res,
      rolAdministrador
    );
    const bProfesor = await servlet_comun.comprobarRol(req, res, rolProfesor);

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
    console.log(
      "servlet_tablon_anuncios.js -> tienePermisosRegistroEscuela: ",
      error
    );
    throw new Error("Error al comprobar permisos de acceso a la escuela");
  }
}

async function compruebaPermisos(req, res, nidTipoTablon) {
  const rolBanda = [constantes.ADMINISTRADOR, constantes.DIRECTOR];
  const rolAdministrador = [constantes.ADMINISTRADOR];

  const bPermisosEscuela = await tienePermisosRegistroEscuela(req, res);
  const bPermisosBanda = await servlet_comun.comprobarRol(req, res, rolBanda);
  const bPermisosAdministrador = await servlet_comun.comprobarRol(
    req,
    res,
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

      const cursoActivo = await gestorCursos.obtenerCursoActivo();

      const nid_tablon_anuncio_asignatura =
        await gestorTablonAnuncionsAsignatura.insertarTablonAnuncioAsignatura(
          nid_tablon_anuncio,
          nid_asignatura,
          cursoActivo.nid_curso
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
    const nid_tablon_anuncio_asignatura =
      req.body.nid_tablon_anuncio_asignatura;

    const bPermisos = await compruebaPermisos(req, res, nidTipoTablon);

    if (!bPermisos) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para actualizar este anuncio",
      });
      return;
    }

    await gestorTablonAnuncios.actualizarTablonAnuncio(
      nid_tablon_anuncio,
      titulo,
      descripcion,
      nidTipoTablon
    );

    if (nidTipoTablon == constantes.ESCUELA) {
      const nid_tablon_anuncio_asignatura =
        req.body.nid_tablon_anuncio_asignatura;
      const nid_asignatura = req.body.nid_asignatura;

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

async function permisosAnuncioAsignatura(nid_persona, anuncio_asignatura) {
  try {
    if (!anuncio_asignatura || !anuncio_asignatura.nid_asignatura) {
      return await gestorUsuario.permisosEscuela(nid_persona);
    }

    const bEsAlumno = await gestorMatriculaAsignatura.esAlumnoAsignatura(
      nid_persona,
      anuncio_asignatura.nid_asignatura,
      anuncio_asignatura.nid_curso
    );

    if (bEsAlumno) {
      return true;
    } else {
      const hijos = await gestorPersonas.obtenerHijos(nid_persona);

      for (const hijo of hijos) {
        const bEsAlumnoHijo =
          await gestorMatriculaAsignatura.esAlumnoAsignatura(
            hijo.nid_persona,
            anuncio_asignatura.nid_asignatura,
            anuncio_asignatura.nid_curso
          );
        if (bEsAlumnoHijo) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.log(
      "servlet_tablon_anuncios.js -> permisosAnuncioAsignatura: ",
      error
    );
    throw new Error("Error al comprobar permisos del anuncio de asignatura");
  }
}

async function obtenerAnuncios(req, res) {
  try {
    const tablonesAnunciosGeneral =
      await gestorTablonAnuncios.obtenerTablonesAnuncioGeneral();

    let tablonesAnunciosBanda = [];
    let tablonesAnunciosAsociacion = [];
    let tablonesAnunciosEscuela = [];

    let persona = await servletPersona.obtenerNidPersona(req);
    const nidPersona = persona.nid_persona;

    if (nidPersona) {
      let bPermisosBanda = await gestorUsuario.permisosMusico(nidPersona);
      if (bPermisosBanda) {
        tablonesAnunciosBanda =
          await gestorTablonAnuncios.obtenerTablonesAnuncioBanda();
      }

      let esSocio = await gestorSocios.esSocio(nidPersona);
      if (esSocio) {
        tablonesAnunciosAsociacion =
          await gestorTablonAnuncios.obtenerTablonesAnuncioAsociacion();
      }

      const tablonesAnunciosEscuelaAux =
        await gestorTablonAnuncios.obtenerTablonesAnuncioEscuela();

      for (const anuncio of tablonesAnunciosEscuelaAux) {
        let bPermisosAsignatura = await permisosAnuncioAsignatura(
          nidPersona,
          anuncio
        );
        if (bPermisosAsignatura) {
          tablonesAnunciosEscuela.push(anuncio);
        }
      }
    }

    const tablonesAnuncios = [
      ...tablonesAnunciosGeneral,
      ...tablonesAnunciosBanda,
      ...tablonesAnunciosAsociacion,
      ...tablonesAnunciosEscuela,
    ];

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

async function obtenerAnuncio(req, res) {
  try {
    const nid_tablon_anuncio = req.params.nid_tablon_anuncio;

    const tablonAnuncio =
      await gestorTablonAnuncios.obtenerTablonAnuncio(nid_tablon_anuncio);

    if (tablonAnuncio.nid_tipo_tablon == constantes.BANDA) {
      const persona = await servletPersona.obtenerNidPersona(req);
      const bPermisosBanda = await gestorUsuario.permisosMusico(
        persona.nid_persona
      );

      if (!bPermisosBanda) {
        res.status(403).send({
          error: true,
          mensaje: "No tienes permisos para acceder a este tablón de anuncios",
        });
        return;
      }
    } else if (tablonAnuncio.nid_tipo_tablon == constantes.ASOCIACION) {
      const persona = await servletPersona.obtenerNidPersona(req);
      const bEsSocio = await gestorSocios.esSocio(persona.nid_persona);

      if (!bEsSocio) {
        res.status(403).send({
          error: true,
          mensaje: "No tienes permisos para acceder a este tablón de anuncios",
        });
        return;
      }
    } else if (tablonAnuncio.nid_tipo_tablon == constantes.ESCUELA) {
      const persona = await servletPersona.obtenerNidPersona(req);
      const bPermisosEscuela = await permisosAnuncioAsignatura(
        persona.nid_persona,
        tablonAnuncio
      );

      if (!bPermisosEscuela) {
        res.status(403).send({
          error: true,
          mensaje: "No tienes permisos para acceder a este tablón de anuncios",
        });
        return;
      }
    }

    res.status(200).send({
      error: false,
      tablones_anuncios: tablonAnuncio,
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
module.exports.obtenerAnuncio = obtenerAnuncio;
