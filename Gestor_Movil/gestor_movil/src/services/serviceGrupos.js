import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

// Create a group service
export const crearGrupo = async (nid_curso, nombre, nid_asignatura) => {
  const payload = { nid_curso, nombre, nid_asignatura };
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
export const obtenerGrupos = async (nid_curso) => {
  const url = nid_curso
    ? `${URL_SERVICIO_MOVIL}obtener_grupos/${nid_curso}`
    : `${URL_SERVICIO_MOVIL}obtener_grupos`;
  return await peticionServicio("GET", url);
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
      respuesta.mensaje ||
        "No se han podido obtener los alumnos de la asignatura",
    );
  }

  return respuesta.alumnos;
};

export const obtenerAsistenciaGrupo = async (nid_grupo, fecha) => {
  return await peticionServicio(
    "GET",
    `${URL_SERVICIO_MOVIL}obtener_asistencia_grupo/${nid_grupo}/${fecha}`,
  );
};

export const guardarAsistenciaGrupo = async (nid_grupo, fecha, asistencias) => {
  return await peticionServicio(
    "POST",
    `${URL_SERVICIO_MOVIL}guardar_asistencia_grupo`,
    { nid_grupo, fecha, asistencias },
  );
};

export const obtenerAsistenciaAsignaturas = async (
  nid_asignatura,
  nid_curso,
) => {
  return await peticionServicio(
    "GET",
    `${URL_SERVICIO_MOVIL}obtener_asistencias_asignatura/${nid_asignatura}/${nid_curso}`,
  );
};
