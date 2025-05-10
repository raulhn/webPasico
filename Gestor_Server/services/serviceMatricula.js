const gestorMatricula = require("../logica/matricula.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

async function registrar_matricula(nid_matricula) {
  try {
    console.log("nid_matricula", nid_matricula);
    const matricula = await gestorMatricula.obtener_matricula(nid_matricula);
    console.log("matricula", matricula);

    console.log("Actualizar matricula en servicio movil");

    return new Promise((resolve, reject) => {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_matricula",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_matricula: matricula.nid,
              nid_persona: matricula.nid_persona,
              nid_curso: matricula.nid_curso,
              fecha_actualizacion: matricula.fecha_actualizacion,
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
    throw new Error("Error en la función registrar_matricula");
  }
}

module.exports.registrar_matricula = registrar_matricula;
