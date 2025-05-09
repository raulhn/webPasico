const gestorMusico = require("../logica/musico.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

async function registrar_musico(nid_persona) {
  console.log("Actualizar musico en servicio movil");
  const musico = await gestorMusico.obtener_musico(nid_persona);

  return new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < musico.length; i++) {
        let musicoActual = musico[i];
        serviceComun
          .fetchWithTimeout(
            constantes.URL_SERVICIO_MOVIL + "registrar_musico",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.API_KEY_MOVIL,
              },
              body: JSON.stringify({
                nid_persona: musicoActual.nid_persona,
                nid_instrumento: musicoActual.nid_instrumento,
                fecha_alta: musicoActual.fecha_alta,
                nid_tipo_musico: musicoActual.nid_tipo_musico,
                fecha_baja: musicoActual.fecha_baja,
                fecha_actualizacion: musicoActual.fecha_actualizacion,
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
      }
    } catch (error) {
      console.error("Error en la función registrar_musico:", error);
      reject("Error en la función registrar_musico");
    }
  });
}

module.exports.registrar_musico = registrar_musico;
