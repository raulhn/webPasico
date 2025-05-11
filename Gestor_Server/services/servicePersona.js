const gestorPersona = require("../logica/persona.js");
const constantes = require("../constantes.js");
const serviceComun = require("./serviceComun.js");

function peticion_registrar_persona(persona) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(constantes.URL_SERVICIO_MOVIL + "registrar_persona", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_MOVIL,
          },
          body: JSON.stringify({
            nid_persona: persona.nid,
            nombre: persona.nombre,
            primer_apellido: persona.primer_apellido,
            segundo_apellido: persona.segundo_apellido,
            nif: persona.nif,
            fecha_nacimiento: persona.fecha_nacimiento,
            telefono: persona.telefono,
            correo_electronico: persona.correo_electronico,
            nid_padre: persona.nid_padre,
            nid_madre: persona.nid_madre,
            nid_socio: persona.nid_socio,
            fecha_actualizacion: persona.fecha_actualizacion,
          }),
        })
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
              console.error(
                "servicePersona.js -> registrarPersona - Error al procesar la respuesta JSON:",
                error
              );
              reject("Error al procesar la respuesta JSON");
            });
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
          reject("Error al realizar la solicitud");
        });
    } catch (error) {
      console.error("Error en la función registrar_persona:", error);
      reject("Error en la función registrar_persona");
    }
  });
}

async function registrar_persona(nid_persona) {
  try {
    let existe = await gestorPersona.existe_nid(nid_persona);
    if (existe) {
      console.log("Actualizar persona en servicio movil");
      const persona = await gestorPersona.obtener_objeto_persona(nid_persona);
      if (persona.sucio === "S") {
        await registrar_persona(persona.nid_madre);
        await registrar_persona(persona.nid_padre);
        await registrar_persona(persona.nid_socio);

        await peticion_registrar_persona(persona);
        await gestorPersona.actualizar_sucio(nid_persona, "N");
      }
    }
    return;
  } catch (error) {
    console.error(
      "Error en la función registrar_persona " + nid_persona + ":",
      error
    );
    throw new Error("Error en la función registrar_persona");
  }
}

function obtener_persona(nid_persona) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "obtener_persona/" + nid_persona,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
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
              console.error(
                "servicePersona.js -> obtener_persona - Error al procesar la respuesta JSON:",
                error
              );
              reject("Error al procesar la respuesta JSON");
            });
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
          reject("Error al realizar la solicitud");
        });
    } catch (error) {
      console.error("Error en la función obtener_persona:", error);
      reject("Error en la función obtener_persona");
    }
  });
}

function obtenerPersonasSucias() {
  console.log("obtenerPersonasSucias");
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "obtener_personas_sucias",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
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
              console.error(
                "servicePersona.js -> obtenerPersonasSucias - Error al procesar la respuesta JSON:",
                error
              );
              reject("Error al procesar la respuesta JSON");
            });
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
          reject("Error al realizar la solicitud");
        });
    } catch (error) {
      console.error("Error en la función obtenerPersonasSucias:", error);
      reject("Error en la función obtenerPersonasSucias");
    }
  });
}

function limpiarPersona(nid_persona) {
  console.log("Limpiar persona en servicio movil");
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(constantes.URL_SERVICIO_MOVIL + "limpiar_persona", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_MOVIL,
          },

          body: JSON.stringify({ nid_persona: nid_persona }),
        })
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
              console.error(
                "servicePersona.js -> limpiarPersona - Error al procesar la respuesta JSON:",
                error
              );
              reject("Error al procesar la respuesta JSON");
            });
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
          reject("Error al realizar la solicitud");
        });
    } catch (error) {
      console.error("Error en la función limpiarPersona:", error);
      reject("Error en la función limpiarPersona");
    }
  });
}

async function actualizar_sucios() {
  try {
    const personasSucias = await gestorPersona.obtener_personas_sucias();

    for (let i = 0; i < personasSucias.length; i++) {
      const persona = personasSucias[i];
      await registrar_persona(persona.nid);
    }
    return;
  } catch (error) {
    console.error("Error en la función actualizar_personas_sucias:", error);
  }
}

module.exports.registrar_persona = registrar_persona;
module.exports.obtener_persona = obtener_persona;
module.exports.obtenerPersonasSucias = obtenerPersonasSucias;
module.exports.limpiarPersona = limpiarPersona;
module.exports.actualizar_sucios = actualizar_sucios;
