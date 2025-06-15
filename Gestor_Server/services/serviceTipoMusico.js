const gestorMusico = require("../logica/musico.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

function peticion_registrar_tipo_musico(tipoMusico) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_tipo_musico",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_tipo_musico: tipoMusico.nid_tipo_musico,
              descripcion: tipoMusico.descripcion,
              fecha_actualizacion: tipoMusico.fecha_actualizacion,
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
      console.error("Error en la función registrar_tipo_musico:", error);
      reject("Error en la función registrar_tipo_musico");
    }
  });
}

async function actualizar_sucios() {
  try {
    const tiposMusico = await gestorMusico.obtener_tipos_musico_sucios();
    for (const tipo of tiposMusico) {
      await peticion_registrar_tipo_musico(tipo);
      await gestorMusico.actualizar_tipo_musico_sucio(
        tipo.nid_tipo_musico,
        "N"
      );
      console.log("Actualizar tipo de músico en servicio móvil", tipo);
    }
  } catch (error) {
    console.error("Error en la función actualizar_tipos_musico:", error);
    throw new Error("Error en la función actualizar_tipos_musico");
  }
}

module.exports.actualizar_sucios = actualizar_sucios;
