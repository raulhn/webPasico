import servletComun from "./serviceComun.js";
import Constantes from "../config/constantes.js";

function obtenerMatriculasAsignaturaPersona(nid_matricula, cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servletComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL +
          "obtener_matriculas_asignatura_persona/" +
          nid_matricula,
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response);
        } else {
          reject(response.error);
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerMatriculasAsignatura");
        reject(error);
      });
  });
}

async function obtenerAlumnosAsignaturaProfesor(nid_curso, nid_asignatura, cerrar_sesion)
{
  try {

    const respuesta = await servletComun.peticionSesion("GET", Constantes.URL_SERVICIO_MOVIL + "obtener_alumnos_asignatura_profesor/" + nid_asignatura + "/" + nid_curso, null, cerrar_sesion);

    return respuesta.alumnos;
  } catch (error) {
    console.log("Error en el servicio obtenerAlumnosAsignaturaProfesor");
    throw new Error("Error al obtener los alumnos de la asignatura del profesor: " + error.message);
  }
}

module.exports.obtenerMatriculasAsignaturaPersona =
  obtenerMatriculasAsignaturaPersona;
module.exports.obtenerAlumnosAsignaturaProfesor =
  obtenerAlumnosAsignaturaProfesor;
