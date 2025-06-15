const gestorMusico = require("../logica/musico.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

function peticion_registrar_instrumento(instrumento) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_instrumento",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_instrumento: instrumento.nid,
              descripcion: instrumento.descripcion,
              fecha_actualizacion: instrumento.fecha_actualizacion,
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
      console.error("Error en la función registrar_instrumento:", error);
      reject("Error en la función registrar_instrumento");
    }
  });
}

async function actualizar_sucios() {
  try {
    const instrumentos = await gestorMusico.obtener_instrumentos_sucios();
    for (const instrumento of instrumentos) {
      await peticion_registrar_instrumento(instrumento);
      await gestorMusico.actualizar_instrumento_sucio(instrumento.nid, "N");
      console.log("Actualizar instrumento en servicio móvil", instrumento);
    }
  } catch (error) {
    console.error("Error en la función actualizar_instrumentos:", error);
    throw new Error("Error en la función actualizar_instrumentos");
  }
}

module.exports.actualizar_sucios = actualizar_sucios;
