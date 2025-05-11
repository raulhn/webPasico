const gestorSocio = require("../logica/socio.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");

function peticion_registrar_socio(socio) {
  return new Promise((resolve, reject) => {
    serviceComun
      .fetchWithTimeout(constantes.URL_SERVICIO_MOVIL + "registrar_socio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY_MOVIL,
        },
        body: JSON.stringify({
          nid_persona: socio.nid_persona,
          num_socio: socio.num_socio,
          fecha_alta: socio.fecha_alta,
          fecha_baja: socio.fecha_baja,
          fecha_actualizacion: socio.fecha_actualizacion,
        }),
      })
      .then((response) => {
        console.log("Respuesta del servicio movil:", response);
        response
          .json()
          .then((data) => {
            if (data.error) {
              console.error("Error en la respuesta de la API:", data.mensaje);
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
}

async function registrarSocio(nidSocio) {
  try {
    const socioRecuperado = await gestorSocio.obtener_socio(nidSocio);
    const socio = socioRecuperado[0];

    await peticion_registrar_socio(socio);
    await gestorSocio.actualizar_sucio(nidSocio, "N");
    console.log("Actualizar socio en servicio movil", socio);
  } catch (error) {
    console.error("Error en la función registrar_socio:", error);
    throw new Error("Error en la función registrar_socio");
  }
}

async function actualizar_sucios() {
  try {
    const socios = await gestorSocio.obtener_sucios();
    for (const socio of socios) {
      await registrarSocio(socio.nid_persona);
    }
    return;
  } catch (error) {
    console.error("Error en la función actualizar_sucios:", error);
    throw new Error("Error en la función actualizar_sucios");
  }
}

module.exports.registrarSocio = registrarSocio;
module.exports.actualizar_sucios = actualizar_sucios;
