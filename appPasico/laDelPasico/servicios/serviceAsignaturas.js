import Constantes from "../config/constantes.js";
import ServiceComun from "./serviceComun.js";

function obtenerAsignaturas() {
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

function obtenerAsignaturasProfesor()
{
  return new Promise((resolve, reject) => {
    
    ServiceComun.peticionServicio("GET", Constantes.URL_SERVICIO_MOVIL + "obtener_asignaturas_profesor", null).then((data) => {
      resolve(data.asignaturas);
    }).catch((error) => {
      reject(error);
    });
  });
}


module.exports.obtenerAsignaturas = obtenerAsignaturas;
module.exports.obtenerAsignaturasProfesor = obtenerAsignaturasProfesor;
