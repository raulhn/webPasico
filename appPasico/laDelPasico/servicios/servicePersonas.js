import Constantes from "../config/constantes.js";
import servicioComun from "./serviceComun.js";

function obtenerPersonas(cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servicioComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_personas",
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response.personas);
        } else {
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerPersonas");
        reject(error);
      });
  });
}

function obtenerPersonasMusicos(cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servicioComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_personas_musicos",
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response.personas);
        } else {
          reject(response.error);
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerPersonasMusicos");
        reject(error);
      });
  });
}

function obtenerPersonasAlumnos(cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servicioComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_personas_alumnos",
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response.personas);
        } else {
          reject(response.error);
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerPersonasAlumnos");
        reject(error);
      });
  });
}

async function obtenerAlumnoProfesor(nid_alumno,cerrar_sesion)
{
   try {
       const response = await servicioComun.peticionSesion(
           "GET",
           Constantes.URL_SERVICIO_MOVIL + "obtener_alumno_profesor/" + nid_alumno,
           null,
           cerrar_sesion
       );
       if (!response.error) {
           return response;
       } else {
           throw new Error(response.error);
       }
   } catch (error) {
       console.log("Error en el servicio obtener_alumno_profesor");
       throw error;
   }
}

function obtenerPersonasAsociacion(cerrar_sesion) {
  return new Promise((resolve, reject) => {
    servicioComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_personas_socios",
        null,
        cerrar_sesion
      )
      .then((response) => {
        if (!response.error) {
          resolve(response.personas);
        } else {
          reject(response.error);
        }
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerPersonasAsociacion");
        reject(error);
      });
  });
}

module.exports.obtenerPersonas = obtenerPersonas;
module.exports.obtenerPersonasMusicos = obtenerPersonasMusicos;
module.exports.obtenerPersonasAlumnos = obtenerPersonasAlumnos;
module.exports.obtenerAlumnoProfesor = obtenerAlumnoProfesor;
module.exports.obtenerPersonasAsociacion = obtenerPersonasAsociacion;
