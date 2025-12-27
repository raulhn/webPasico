import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

export function obtenerProfesoresAsignatura(nidAsignatura, cerrarSesion) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL + "obtener_profesores_asignatura/" + nidAsignatura,
      null,
      cerrarSesion,
    )
      .then((response) => {
        resolve(response.profesores);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function obtenerProfesores(cerrarSesion) {
  return new Promise((resolve, reject) => {
    peticionServicio(
      "GET",
      URL_SERVICIO_MOVIL + "obtener_profesores",
      null,
      cerrarSesion,
    )
      .then((response) => {
        resolve(response.profesores);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
