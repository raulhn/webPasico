const gestorEvaluacion = require("../logica/evaluacion.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");
const gestorComun = require("../logica/comun.js");
const e = require("express");

function peticion_registrar_evaluacion_matricula(evaluacionMatricula, evaluacion) {
  return new Promise((resolve, reject) => {
    try {
    
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_evaluacion_matricula",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_evaluacion_matricula:
                evaluacionMatricula.nid_evaluacion_matricula,
              nid_matricula_asignatura:
                evaluacionMatricula.nid_matricula_asignatura,
              nid_evaluacion: evaluacionMatricula.nid_evaluacion,
              nota: evaluacionMatricula.nota,
              nid_tipo_progreso: evaluacionMatricula.nid_tipo_progreso,
              comentario: evaluacionMatricula.comentario,
              fecha_actualizacion:  gestorComun.formatDateToMySQL(evaluacionMatricula.fecha_actualizacion),
              nid_asignatura: evaluacion.nid_asignatura,
              nid_curso: evaluacion.nid_curso,
              nid_profesor: evaluacion.nid_profesor,
              nid_trimestre: evaluacion.nid_trimestre
            }),
          }
        )
        .then((response) => {
          response
            .json()
            .then((data) => {
              if (data.error) {
                console.error("Error en la respuesta de la API:", data.error);
                reject("Error en la respuesta de la API");
              }
              resolve(data);
            })
            .catch((error) => {
              console.error("Error al procesar la respuesta JSON:", error);
              reject("Error al procesar la respuesta JSON");
            });
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
          reject("Error al realizar la solicitud");
        });
    } catch (error) {
      console.error(
        "Error en la función registrar_evaluacion_matricula:",
        error
      );
      reject("Error en la función registrar_evaluacion_matricula");
    }
  });
}

async function actualizar_sucios() {
  try {
    const evaluacionesMatricula =
      await gestorEvaluacion.obtener_evaluacion_matriculas_sucias();
    for (const evaluacionMatricula of evaluacionesMatricula) {
      const evaluacion = await gestorEvaluacion.obtener_evaluacion_nid(
        evaluacionMatricula.nid_evaluacion
      );
      await peticion_registrar_evaluacion_matricula(evaluacionMatricula, evaluacion);
      await gestorEvaluacion.actualizar_evaluacion_matricula_sucio(
        evaluacionMatricula.nid_evaluacion_matricula,
        "N"
      );
 
    }
  } catch (error) {
    console.error(
      "Error al actualizar las evaluaciones matrícula sucias:",
      error
    );
  }
}

function obtener_evaluaciones_matriculas_sucias() {
  return new Promise((resolve, reject) => {
    serviceComun
      .fetchWithTimeout(
        constantes.URL_SERVICIO_MOVIL +
          "obtener_evaluaciones_matriculas_sucias",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_MOVIL,
          },
        }
      )
      .then((response) => {
 
        response
          .json()
          .then((data) => {
            if (data.error) {
              console.error("Error en la respuesta de la API:", data.error);
              reject("Error en la respuesta de la API");
            }
           
            resolve(data.evaluaciones);
          })
          .catch((error) => {
            console.error("Error al procesar la respuesta JSON:", error);
            reject("Error al procesar la respuesta JSON");
          });
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        reject("Error al realizar la solicitud");
      });
  });
}

function actualizar_evaluacion_matricula_sucia(nid_evaluacion_matricula) {
  return new Promise((resolve, reject) => {
    serviceComun
      .fetchWithTimeout(
        constantes.URL_SERVICIO_MOVIL + "actualizar_evaluacion_matricula_sucia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_MOVIL,
          },
          body: JSON.stringify({
            nid_evaluacion_matricula: nid_evaluacion_matricula,
          }),
        }
      )
      .then((response) => {
        response
          .json()
          .then((data) => {
            if (data.error) {
              console.error("Error en la respuesta de la API:", data.error);
              reject("Error en la respuesta de la API");
            }
            resolve(data);
          })
          .catch((error) => {
            console.error("Error al procesar la respuesta JSON:", error);
            reject("Error al procesar la respuesta JSON");
          });
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        reject("Error al realizar la solicitud");
      });
  });
}

async function actualizar_evaluaciones_matriculas_sucias()
{
  try {
    const evaluacionesMatricula =
      await obtener_evaluaciones_matriculas_sucias();
 
    for (const evaluacion of evaluacionesMatricula) {

       gestorEvaluacion.registrar_evaluacion_matricula_servicio(
         evaluacion.nid_evaluacion_matricula,
         evaluacion.nid_evaluacion,
         evaluacion.nota,
         evaluacion.nid_tipo_progreso,
         evaluacion.comentario,
         evaluacion.fecha_actualizacion,
         evaluacion.nid_matricula_asignatura,
         evaluacion.nid_curso,
         evaluacion.nid_asignatura,
             evaluacion.nid_profesor,
         evaluacion.nid_trimestre,
      );
 
      await actualizar_evaluacion_matricula_sucia(
        evaluacion.nid_evaluacion_matricula
      );
    }
  } catch (error) {
    console.error(
      "Error al actualizar las evaluaciones matrícula sucias:",
      error
    );
  }
}



module.exports.actualizar_sucios = actualizar_sucios;

module.exports.actualizar_evaluaciones_matriculas_sucias = actualizar_evaluaciones_matriculas_sucias;
