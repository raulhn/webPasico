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
module.exports.obtenerPersonasAsociacion = obtenerPersonasAsociacion;
