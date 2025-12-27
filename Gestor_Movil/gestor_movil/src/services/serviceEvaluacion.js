import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

export function obtenerEvaluaciones(nidMatricula) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL + "obtener_evaluaciones/" + nidMatricula,
      null,
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function generarBoletin(nidMatricula, nidTrimestre) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL +
        "solicitar_generar_boletin/" +
        nidMatricula +
        "/" +
        nidTrimestre,
      null,
    )
      .then((response) => {
        console.log("Generar boletín response:");

        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function obtenerEvaluacionesAsignatura(
  nidCurso,
  nidAsignatura,
  nidTrimestre,
) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL +
        "obtener_evaluaciones_asignatura/" +
        nidCurso +
        "/" +
        nidAsignatura +
        "/" +
        nidTrimestre,
      null,
    )
      .then((response) => {
        resolve(response.evaluaciones);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function obtenerEvaluacionesAsignaturaProfesor(
  nidCurso,
  nidAsignatura,
  nidTrimestre,
  nidProfesor,
) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL +
        "obtener_evaluaciones_asignatura_profesor/" +
        nidCurso +
        "/" +
        nidAsignatura +
        "/" +
        nidProfesor +
        "/" +
        nidTrimestre,
      null,
    )
      .then((response) => {
        resolve(response.evaluaciones);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function registrarEvaluaciones(
  evaluaciones,
  nidCurso,
  nidAsignatura,
  nidTrimestre,
) {
  return new Promise((resolve, reject) => {
    peticionServicio("POST", URL_SERVICIO_MOVIL + "registrar_evaluaciones", {
      evaluaciones: evaluaciones,
      nid_curso: nidCurso,
      nid_asignatura: nidAsignatura,
      nid_trimestre: nidTrimestre,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
