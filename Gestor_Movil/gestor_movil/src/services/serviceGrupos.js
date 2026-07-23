import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

// Create a group service
export const crearGrupo = async (nombre, nid_asignatura) => {
  const payload = { nombre, nid_asignatura };
  return await peticionServicio(
    "POST",
    `${URL_SERVICIO_MOVIL}crear_grupo`,
    payload,
  );
};

// Delete a group service
export const eliminarGrupo = async (nid_grupo) => {
  const payload = { nid_grupo };
  return await peticionServicio(
    "POST",
    `${URL_SERVICIO_MOVIL}eliminar_grupo`,
    payload,
  );
};

// Get groups service
export const obtenerGrupos = async () => {
  return await peticionServicio("GET", `${URL_SERVICIO_MOVIL}obtener_grupos`);
};

// Add student to group service
export const addAlumnoGrupo = async (nid_grupo, nid_matricula_asignatura) => {
  const payload = { nid_grupo, nid_matricula_asignatura };
  return await peticionServicio(
    "POST",
    `${URL_SERVICIO_MOVIL}add_alumno_grupo`,
    payload,
  );
};

// Remove student from group service
export const eliminarAlumnoGrupo = async (
  nid_grupo,
  nid_matricula_asignatura,
) => {
  const payload = { nid_grupo, nid_matricula_asignatura };
  return await peticionServicio(
    "POST",
    `${URL_SERVICIO_MOVIL}eliminar_alumno_grupo`,
    payload,
  );
};

export const actualizarHorarioGrupo = async (nid_grupo, horario) => {
  const payload = { nid_grupo, horario };
  return await peticionServicio(
    "POST",
    `${URL_SERVICIO_MOVIL}actualizar_horario_grupo`,
    payload,
  );
};

export const obtenerAlumnosAsignatura = async (nid_asignatura) => {
  const respuesta = await peticionServicio(
    "GET",
    `${URL_SERVICIO_MOVIL}obtener_alumnos_asignatura/${nid_asignatura}`,
  );

  if (respuesta.error) {
    throw new Error(
      respuesta.mensaje || "No se han podido obtener los alumnos de la asignatura",
    );
  }

  return respuesta.alumnos;
};
