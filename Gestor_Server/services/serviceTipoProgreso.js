const gestorTipoProgreso = require("../logica/tipo_progreso.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

function peticion_registrar_tipo_progreso(tipoProgreso) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_tipo_progreso",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_tipo_progreso: tipoProgreso.nid_tipo_progreso,
              descripcion: tipoProgreso.descripcion,
              fecha_actualizacion: tipoProgreso.fecha_actualizacion,
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
      console.error("Error en la función registrar_tipo_progreso:", error);
      reject("Error en la función registrar_tipo_progreso");
    }
  });
}

async function actualizar_sucios() {
  try {
    const tiposProgreso =
      await gestorTipoProgreso.obtener_tipos_progreso_sucios();
    for (const tipo of tiposProgreso) {
      await peticion_registrar_tipo_progreso(tipo);
      await gestorTipoProgreso.actualizar_tipo_progreso_sucio(
        tipo.nid_tipo_progreso,
        "N"
      );
      console.log("Actualizar tipo de progreso en servicio móvil", tipo);
    }
  } catch (error) {
    console.error("Error al actualizar tipos de progreso sucios:", error);
  }
}

module.exports.actualizar_sucios = actualizar_sucios;
