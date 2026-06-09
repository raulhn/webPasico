const servletComun = require("./servlet_comun.js");
const gestorPersona = require("../logica/persona.js");
const constantes = require("../constantes.js");
const gestorMatricula = require("../logica/matricula.js");
const gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula.js");
const gestorSocios = require("../logica/socios.js");
const gestorMatriculaAsignatura = require("../logica/matricula_asignatura.js");

function registrarPersona(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nombre = req.body.nombre;
      let nid_persona = req.body.nid_persona;
      let primerApellido = req.body.primer_apellido;
      let segundoApellido = req.body.segundo_apellido;
      let fechaNacimiento = req.body.fecha_nacimiento;
      let nif = req.body.nif;
      let telefono = req.body.telefono;
      let email = req.body.correo_electronico;
      let nid_madre = req.body.nid_madre;
      let nid_padre = req.body.nid_padre;
      let nid_socio = req.body.nid_socio;

      let fecha_actualizacion = req.body.fecha_actualizacion;

      await gestorPersona.registrarPersona(
        nid_persona,
        nombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        nif,
        telefono,
        email,
        nid_madre,
        nid_padre,
        nid_socio,
        fecha_actualizacion,
      );

      res.status(200).send({
        error: false,
        mensaje: "Persona registrada correctamente",
      });
    } catch (error) {
      console.error("Error al registrar la persona:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al registrar la persona",
      });
    }
  });
}

function obtenerPersona(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.params.nid_persona;
      let persona = await gestorPersona.obtenerPersona(nid_persona);
      if (persona) {
        res.status(200).send({
          error: false,
          mensaje: "Persona obtenida correctamente",
          persona: persona,
        });
      } else {
        res.status(404).send({
          error: true,
          mensaje: "Persona no encontrada",
        });
      }
    } catch (error) {
      console.error("Error al obtener la persona:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al obtener la persona",
      });
    }
  });
}

function obtenerPersonasSucias(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let personasSucias = await gestorPersona.obtenerPersonasSucias();
      res.status(200).send({
        error: false,
        mensaje: "Personas sucias obtenidas correctamente",
        personas: personasSucias,
      });
    } catch (error) {
      console.error("Error al obtener las personas sucias:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al obtener las personas sucias",
      });
    }
  });
}

function limpiarPersona(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      let nid_persona = req.body.nid_persona;
      await gestorPersona.limpiarPersona(nid_persona);
      res.status(200).send({
        error: false,
        mensaje: "Persona limpiada correctamente",
      });
    } catch (error) {
      console.error("Error al limpiar la persona:" + error.message);
      res.status(400).send({
        error: true,
        mensaje: "Error al limpiar la persona",
      });
    }
  });
}

async function obtenerPersonas(req, res) {
  try {
    console.log("Obteniendo personas...");
    const rolesPermitidos = [constantes.ADMINISTRADOR];
    let rolPermitido = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );

    if (!rolPermitido) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener las personas",
      });
    } else {
      const personas = await gestorPersona.obtenerPersonas();

      res.status(200).send({
        error: false,
        mensaje: "Personas obtenidas correctamente",
        personas: personas,
      });
    }
  } catch (error) {
    console.error("Error al obtener las personas:", error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener las personas",
    });
  }
}

async function obtenerListadoPersona(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR, constantes.DIRECTIVO];
    let rolPermitido = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolPermitido) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener el listado de personas",
      });
      return;
    }

    const tipo = req.params.tipo;
    if (tipo == 1) {
      const personas = await gestorPersona.obtenerPersonas();
      res.status(200).send({
        error: false,
        mensaje: "Listado de personas obtenido correctamente",
        personas: personas,
      });
    } else if (tipo == 2) {
      const activo = req.params.activo;
      const personas = await gestorPersona.obtenerPersonasSociosActivos(activo);
      res.status(200).send({
        error: false,
        mensaje: "Listado de personas obtenido correctamente",
        personas: personas,
      });
    } else if (tipo == 3) {
      const activo = req.params.activo;
      const nid_curso = req.params.nid_curso;
      const nid_asignatura = req.params.nid_asignatura;

      if (!nid_curso) {
        res.status(200).send({
          error: false,
          mensaje: "Listado de personas obtenido correctamente",
          personas: [],
        });
        return;
      }

      if (!nid_asignatura || nid_asignatura == 0) {
        const alumnos = await gestorMatriculaAsignatura.obtenerAlumnosCurso(
          nid_curso,
          activo,
        );

        res.status(200).send({
          error: false,
          mensaje: "Listado de personas obtenido correctamente",
          personas: alumnos,
        });
      } else {
        const alumnos =
          await gestorMatriculaAsignatura.obtenerAlumnosCursoAsignatura(
            nid_curso,
            nid_asignatura,
            activo,
          );

        res.status(200).send({
          error: false,
          mensaje: "Listado de personas obtenido correctamente",
          personas: alumnos,
        });
      }
    } else {
      res.status(400).send({
        error: false,
        personas: [],
        mensaje: "Tipo de listado de personas no válido",
      });
    }
  } catch (error) {
    console.error("Error al obtener el listado de personas:", error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener el listado de personas",
    });
  }
}

function obtenerPersonasMusicos(req, res) {
  const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
  servletComun
    .comprobarRol(req, res, rolesPermitidos)
    .then(async (rolPermitido) => {
      if (!rolPermitido) {
        res.status(403).send({
          error: true,
          mensaje: "No tienes permisos para obtener los músicos",
        });
      } else {
        try {
          const personasMusicos = await gestorPersona.obtenerPersonasMusicos();
          res.status(200).send({
            error: false,
            mensaje: "Músicos obtenidos correctamente",
            personas: personasMusicos,
          });
        } catch (error) {
          console.error("Error al obtener los músicos:", error.message);
          res.status(400).send({
            error: true,
            mensaje: "Error al obtener los músicos",
          });
        }
      }
    })
    .catch((error) => {
      console.error("Error al comprobar el rol:", error.message);
      res.status(500).send({
        error: true,
        mensaje: "Error al comprobar el rol",
      });
    });
}

async function obtenerNidPersona(req) {
  try {
    const tokenDecode = await servletComun.obtenerTokenDecoded(req);
    const nid_usuario = tokenDecode.nid_usuario;
    const persona = await gestorPersona.obtenerPersonaUsuario(nid_usuario);
    return persona.nid_persona;
  } catch (error) {
    return null;
  }
}

async function obtenerPersonasAlumnos(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR, constantes.DIRECTIVO];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolAdministrador) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos",
      });
      return;
    }

    let nid_curso = req.params.nid_curso;

    const personasAlumnos =
      await gestorMatricula.obtenerPersonasAlumnos(nid_curso);
    res.status(200).send({
      error: false,
      mensaje: "Alumnos obtenidos correctamente",
      personas: personasAlumnos,
    });
  } catch (error) {
    console.error("Error al obtener los alumnos:", error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los alumnos",
    });
  }
}

async function obtenerPersonasSocios(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR, constantes.DIRECTIVO];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolAdministrador) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los socios",
      });
      return;
    }

    const personasSocios = await gestorPersona.obtenerPersonasSocios();
    res.status(200).send({
      error: false,
      mensaje: "Socios obtenidos correctamente",
      personas: personasSocios,
    });
  } catch (error) {
    console.error("Error al obtener los socios:", error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los socios",
    });
  }
}

async function obtenerAlumnoProfesor(req, res) {
  try {
    const nid_alumno = req.params.nid_alumno;
    const nid_curso = req.params.nid_curso;
    const rolesPermitidos = [constantes.PROFESOR];
    const rolesAdministrador = [constantes.ADMINISTRADOR, constantes.DIRECTIVO];
    let rolProfesor = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );

    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesAdministrador,
    );

    // ROL ADMINISTRADOR //
    if (rolAdministrador) {
      const alumno = await gestorPersona.obtenerPersona(nid_alumno);
      if (!alumno) {
        res.status(404).send({
          error: true,
          mensaje: "No se encontró la información del alumno profesor",
        });
        return;
      }

      let esSocio = await gestorSocios.esSocio(nid_alumno);

      let padre = null;
      let madre = null;
      if (!esSocio) {
        padre = await gestorPersona.obtenerPersona(alumno.nid_padre);
        madre = await gestorPersona.obtenerPersona(alumno.nid_madre);
      }

      res.status(200).send({
        error: false,
        mensaje: "Información del alumno profesor obtenida correctamente",
        persona: alumno,
        padre: padre,
        madre: madre,
      });
      return;
    }

    // ROL PROFESOR //
    if (!rolProfesor) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener el alumno profesor",
      });
      return;
    }

    const nid_profesor = await obtenerNidPersona(req);
    if (!nid_profesor) {
      res.status(404).send({
        error: true,
        mensaje: "No se encontró la persona",
      });
      return;
    }

    const esProfesor = await gestorProfesorAlumnoMatricula.esAlumnoProfesor(
      nid_alumno,
      nid_profesor,
      nid_curso,
    );

    if (!esProfesor) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener el alumno",
      });
      return;
    }

    const alumno = await gestorPersona.obtenerPersona(nid_alumno);
    if (!alumno) {
      res.status(404).send({
        error: true,
        mensaje: "No se encontró la información del alumno profesor",
      });
      return;
    }

    let esSocio = await gestorSocios.esSocio(nid_alumno);
    let padre = null;
    let madre = null;
    // Si no es socio se considera menor de edad y se recuperan los datos de los padres
    if (!esSocio) {
      padre = await gestorPersona.obtenerPersona(alumno.nid_padre);
      madre = await gestorPersona.obtenerPersona(alumno.nid_madre);
    }
    res.status(200).send({
      error: false,
      mensaje: "Información del alumno profesor obtenida correctamente",
      persona: alumno,
      padre: padre,
      madre: madre,
    });
  } catch (error) {
    console.error("Error al obtener el alumno profesor:", error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener el alumno profesor",
    });
  }
}

async function obtenerPersonasAlumnosAsignatura(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolAdministrador) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener los alumnos",
      });
      return;
    }
    const nid_curso = req.params.nid_curso;
    const nid_asignatura = req.params.nid_asignatura;
    const activo = req.params.activo;

    const personasAlumnos =
      await gestorPersona.obtenerPersonasAlumnosAsignatura(
        nid_curso,
        nid_asignatura,
        activo,
      );

    res.status(200).send({
      error: false,
      mensaje: "Alumnos obtenidos correctamente",
      personas: personasAlumnos,
    });
  } catch (error) {
    console.error("Error al obtener los alumnos:", error.message);
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener los alumnos",
    });
  }
}

async function obtenerInfoPersona(req, res) {
  try {
    const rolesPermitidos = [constantes.ADMINISTRADOR, constantes.DIRECTIVO];
    let rolAdministrador = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos,
    );
    if (!rolAdministrador) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener la información de la persona",
      });
      return;
    }
    const nid_persona = req.params.nid_persona;
    const persona = await gestorPersona.obtenerPersona(nid_persona);
    if (!persona) {
      res.status(404).send({
        error: true,
        mensaje: "No se encontró la información de la persona",
      });
      return;
    }
    const nid_padre = await gestorPersona.obtenerPadre(nid_persona);
    const nid_madre = await gestorPersona.obtenerMadre(nid_persona);
    const padre = await gestorPersona.obtenerPersona(nid_padre);
    console.log(nid_padre, padre);
    const madre = await gestorPersona.obtenerPersona(nid_madre);
    console.log(nid_madre, madre);
    res.status(200).send({
      error: false,
      mensaje: "Información de la persona obtenida correctamente",
      persona: persona,
      padre: padre,
      madre: madre,
    });
  } catch (error) {
    console.error(
      "Error al obtener la información de la persona:",
      error.message,
    );
    res.status(400).send({
      error: true,
      mensaje: "Error al obtener la información de la persona",
    });
  }
}
module.exports.obtenerPersona = obtenerPersona;
module.exports.registrarPersona = registrarPersona;
module.exports.obtenerPersonasSucias = obtenerPersonasSucias;
module.exports.limpiarPersona = limpiarPersona;
module.exports.obtenerPersonas = obtenerPersonas;
module.exports.obtenerPersonasMusicos = obtenerPersonasMusicos;
module.exports.obtenerNidPersona = obtenerNidPersona;
module.exports.obtenerListadoPersona = obtenerListadoPersona;
module.exports.obtenerPersonasAlumnos = obtenerPersonasAlumnos;
module.exports.obtenerPersonasSocios = obtenerPersonasSocios;
module.exports.obtenerAlumnoProfesor = obtenerAlumnoProfesor;
module.exports.obtenerPersonasAlumnosAsignatura =
  obtenerPersonasAlumnosAsignatura;
module.exports.obtenerInfoPersona = obtenerInfoPersona;
