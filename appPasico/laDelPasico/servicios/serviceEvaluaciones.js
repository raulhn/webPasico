const serviceComun = require("./serviceComun.js");
import Constantes from "../config/constantes.js";

function obtenerEvaluaciones(nidMatricula, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "obtener_evaluaciones/" + nidMatricula,
        null,
        cerrarSesion
      )
      .then((response) => {

        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function generarBoletin(nidMatricula, nidTrimestre, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL +
          "solicitar_generar_boletin/" +
          nidMatricula +
          "/" +
          nidTrimestre,
        null,
        cerrarSesion
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

function obtenerEvaluacionesAsignatura(nidCurso, nidAsignatura, nidTrimestre, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL +
          "obtener_evaluaciones_asignatura/" +
          nidCurso +
          "/" +
          nidAsignatura +
          "/" +
          nidTrimestre,
        null, cerrarSesion
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


function registrarEvaluaciones(evaluaciones, nidCurso, nidAsignatura, nidTrimestre, cerrarSesion)
{
  return new Promise((resolve, reject) => {

    console.log("Registrar evaluaciones:", evaluaciones);
    serviceComun
      .peticionSesion(
        "POST",
        Constantes.URL_SERVICIO_MOVIL + "registrar_evaluaciones",
        {
          evaluaciones: evaluaciones,
          nid_curso: nidCurso,
          nid_asignatura: nidAsignatura,
          nid_trimestre: nidTrimestre
        },
        cerrarSesion
      )
      .then((response) => {
        console.log("Registrar evaluaciones response:", response);
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


module.exports.obtenerEvaluaciones = obtenerEvaluaciones;
module.exports.generarBoletin = generarBoletin;
module.exports.obtenerEvaluacionesAsignatura = obtenerEvaluacionesAsignatura;
module.exports.registrarEvaluaciones = registrarEvaluaciones;
