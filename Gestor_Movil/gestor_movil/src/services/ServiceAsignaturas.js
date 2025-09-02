import * as Constantes from "../config/Constantes.js";
import * as ServiceComun from "./ServiceComun.js";

export function obtenerAsignaturas() {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO_MOVIL + "obtener_asignaturas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function obtenerAsignaturasProfesor()
{
  return new Promise((resolve, reject) => {
    
    ServiceComun.peticionServicio("GET", Constantes.URL_SERVICIO_MOVIL + "obtener_asignaturas_profesor", null).then((data) => {
      resolve(data.asignaturas);
    }).catch((error) => {
      reject(error);
    });
  });
}
