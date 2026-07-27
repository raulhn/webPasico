import Constantes from "../config/constantes.js";
import serviceComun from "./serviceComun.js";

function peticion(metodo, ruta, body, cerrarSesion) {
  return serviceComun.peticionSesion(
    metodo,
    Constantes.URL_SERVICIO_MOVIL + ruta,
    body,
    cerrarSesion
  );
}

function crearGrupo(nidCurso, nombre, nidAsignatura, cerrarSesion) {
  return peticion(
    "POST",
    "crear_grupo",
    { nid_curso: nidCurso, nombre, nid_asignatura: nidAsignatura },
    cerrarSesion
  );
}

function obtenerGrupos(nidCurso, cerrarSesion) {
  const ruta = nidCurso ? "obtener_grupos/" + nidCurso : "obtener_grupos";
  return peticion("GET", ruta, null, cerrarSesion);
}

function actualizarHorarioGrupo(nidGrupo, horario, cerrarSesion) {
  return peticion(
    "POST",
    "actualizar_horario_grupo",
    { nid_grupo: nidGrupo, horario },
    cerrarSesion
  );
}

function addAlumnoGrupo(nidGrupo, nidMatriculaAsignatura, cerrarSesion) {
  return peticion(
    "POST",
    "add_alumno_grupo",
    {
      nid_grupo: nidGrupo,
      nid_matricula_asignatura: nidMatriculaAsignatura,
    },
    cerrarSesion
  );
}

function eliminarAlumnoGrupo(nidGrupo, nidMatriculaAsignatura, cerrarSesion) {
  return peticion(
    "POST",
    "eliminar_alumno_grupo",
    {
      nid_grupo: nidGrupo,
      nid_matricula_asignatura: nidMatriculaAsignatura,
    },
    cerrarSesion
  );
}

function obtenerAsistenciaGrupo(nidGrupo, fecha, cerrarSesion) {
  return peticion(
    "GET",
    "obtener_asistencia_grupo/" + nidGrupo + "/" + fecha,
    null,
    cerrarSesion
  );
}

function guardarAsistenciaGrupo(nidGrupo, fecha, asistencias, cerrarSesion) {
  return peticion(
    "POST",
    "guardar_asistencia_grupo",
    { nid_grupo: nidGrupo, fecha, asistencias },
    cerrarSesion
  );
}

module.exports = {
  crearGrupo,
  obtenerGrupos,
  actualizarHorarioGrupo,
  addAlumnoGrupo,
  eliminarAlumnoGrupo,
  obtenerAsistenciaGrupo,
  guardarAsistenciaGrupo,
};
