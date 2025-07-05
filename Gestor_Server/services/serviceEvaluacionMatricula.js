const gestorEvaluacion = require("../logica/evaluacion.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

function peticion_registrar_evaluacion_matricula(evaluacionMatricula) {
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
              nid_persona: evaluacionMatricula.nid_persona,
              nid_asignatura: evaluacionMatricula.nid_asignatura,
              nid_trimestre: evaluacionMatricula.nid_trimestre,
              nid_tipo_progreso: evaluacionMatricula.nid_tipo_progreso,
              comentario: evaluacionMatricula.comentario,
              fecha_actualizacion: evaluacionMatricula.fecha_actualizacion,
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
    for (const evaluacion of evaluacionesMatricula) {
      await peticion_registrar_evaluacion_matricula(evaluacion);
      await gestorEvaluacion.actualizar_evaluacion_matricula_sucio(
        evaluacion.nid_evaluacion_matricula,
        "N"
      );
      console.log(
        "Actualizar evaluación matrícula en servicio móvil",
        evaluacion
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
