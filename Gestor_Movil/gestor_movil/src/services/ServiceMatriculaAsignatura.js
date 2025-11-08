import * as serviceComun from "./ServiceComun.js"
import * as Constantes from "../config/Constantes.js"

export async function obtenerAlumnosAsignaturaProfesor(nid_curso, nid_asignatura)
{
  try {

    const respuesta = await serviceComun.peticionServicio("GET", Constantes.URL_SERVICIO_MOVIL + "obtener_alumnos_asignatura_profesor/" + nid_asignatura + "/" + nid_curso, null);

    return respuesta.alumnos;
  } catch (error) {
    console.log("Error en el servicio obtenerAlumnosAsignaturaProfesor");
    throw new Error("Error al obtener los alumnos de la asignatura del profesor: " + error.message);
  }
}

export async function obtenerAlumnosAsignatura(nid_curso, nid_asignatura, activo)
{
  try {
    const respuesta = await serviceComun.peticionServicion(
      "GET",
      Constantes.URL_SERVICIO_MOVIL +
        "obtener_perosnas_alumnos_asignatura/" +
        nid_asignatura +
        "/" +
        nid_curso
        "/" +
        activo,
      null
    );

    return respuesta.alumnos;
  } catch (error) {
    console.log("Error en el servicio obtenerAlumnosAsignatura");
    throw new Error(
      "Error al obtener los alumnos de la asignatura: " + error.message
    );
  }
}
