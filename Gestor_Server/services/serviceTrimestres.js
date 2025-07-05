const gestorTrimestres = require("../logica/trimestres.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

function peticion_registrar_trimestre(trimestre) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_trimestre",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_trimestre: trimestre.nid_trimestre,
              descripcion: trimestre.descripcion,
              fecha_inicio: trimestre.fecha_inicio,
              fecha_fin: trimestre.fecha_fin,
              fecha_actualizacion: trimestre.fecha_actualizacion,
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
      console.error("Error en la función registrar_trimestre:", error);
      reject("Error en la función registrar_trimestre");
    }
  });
}

async function actualizar_sucios() {
  try {
    const trimestres = await gestorTrimestres.obtener_trimestres_sucios();
    for (const trimestre of trimestres) {
      await peticion_registrar_trimestre(trimestre);
      await gestorTrimestres.actualizar_trimestre_sucio(
        trimestre.nid_trimestre,
        "N"
      );
      console.log("Actualizar trimestre en servicio móvil", trimestre);
    }
  } catch (error) {
    console.error("Error al actualizar trimestres sucios:", error);
  }
}

module.exports.actualizar_sucios = actualizar_sucios;
