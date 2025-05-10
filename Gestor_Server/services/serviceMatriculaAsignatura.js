const gestorMatriculaAsignatura = require("../logica/matricula_asignatura.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");
const serviceMatricula = require("./serviceMatricula.js");

async function registrar_matricula_asignatura(nid_matricula_asignatura) {
  try {
    console.log("nid_matricula_asignatura", nid_matricula_asignatura);
    const matricula_asignatura =
      await gestorMatriculaAsignatura.obtener_matricula_asignatura(
        nid_matricula_asignatura
      );
    console.log("matricula_asignatura", matricula_asignatura);

    serviceMatricula.registrar_matricula(matricula_asignatura.nid_matricula);
    console.log("Actualizar matricula asignatura en servicio movil");
    return new Promise((resolve, reject) => {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_matricula_asignatura",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },

            body: JSON.stringify({
              nid_matricula_asignatura:
                matricula_asignatura.nid_matricula_asignatura,
              nid_matricula: matricula_asignatura.nid_matricula,
              nid_asignatura: matricula_asignatura.nid_asignatura,
              fecha_alta: matricula_asignatura.fecha_alta,
              fecha_baja: matricula_asignatura.fecha_baja,
              fecha_actualizacion: matricula_asignatura.fecha_actualizacion,
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
              console.log("Respuesta de la API:", data);
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
  } catch (error) {
    console.error("Error en la función registrar_matricula:", error);
    reject("Error en la función registrar_matricula");
  }
}

module.exports.registrar_matricula_asignatura = registrar_matricula_asignatura;
