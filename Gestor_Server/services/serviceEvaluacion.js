const gestorEvaluacion = require("../logica/evaluacion.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

function peticion_registrar_evaluacion(evaluacion) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_evaluacion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_evaluacion_matricula: evaluacion.nid_evaluacion_matricula,
              nid_persona: evaluacion.nid_persona,
              nid_asignatura: evaluacion.nid_asignatura,
              nid_trimestre: evaluacion.nid_trimestre,
              nid_tipo_progreso: evaluacion.nid_tipo_progreso,
              comentario: evaluacion.comentario,
              fecha_actualizacion: evaluacion.fecha_actualizacion,
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
      console.error("Error en la función registrar_evaluacion:", error);
      reject("Error en la función registrar_evaluacion");
    }
  });
}

async function actualizar_sucios() {
  try {
    const evaluaciones = await gestorEvaluacion.obtener_evaluaciones_sucias();
    for (const evaluacion of evaluaciones) {
      await peticion_registrar_evaluacion(evaluacion);
      await gestorEvaluacion.actualizar_evaluacion_sucio(
        evaluacion.nid_evaluacion_matricula,
        "N"
      );
      console.log("Actualizar evaluación en servicio móvil", evaluacion);
    }
  } catch (error) {
    console.error("Error al actualizar las evaluaciones sucias:", error);
  }
}

function obtener_evaluaciones_sucias() {
  try {
    serviceComun
      .fetchWithTimeout(
        constantes.URL_SERVICIO_MOVIL + "obtener_evaluaciones_sucias",
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
              throw new Error("Error en la respuesta de la API");
            }
            return data;
          })
          .catch((error) => {
            console.error("Error al procesar la respuesta JSON:", error);
            throw new Error("Error al procesar la respuesta JSON");
          });
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        throw new Error("Error al realizar la solicitud");
      });
  } catch (error) {
    console.error("Error en la función obtener_evaluaciones_sucias:", error);
    throw new Error("Error en la función obtener_evaluaciones_sucias");
  }
}

module.exports.actualizar_sucios = actualizar_sucios;
