const gestorAsignatura = require("../logica/asignatura.js");
const constantes = require("../constantes.js");
const serviceComun = require("./serviceComun.js");

async function registrar_asignatura(nid_asignatura) {
  console.log("Actualizar asignatura en servicio movil");
  const asignatura = await gestorAsignatura.obtener_asignatura(nid_asignatura);

  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_asignatura",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_asignatura: asignatura.nid,
              descripcion: asignatura.descripcion,
              instrumento_banda: asignatura.instrumento_banda,
              tipo_asignatura: asignatura.tipo_asignatura,
              fecha_actualizacion: asignatura.fecha_actualizacion,
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
    } catch (error) {
      console.error("Error en la función registrar_asignatura:", error);
      reject("Error en la función registrar_asignatura");
    }
  });
}

module.exports.registrar_asignatura = registrar_asignatura;
