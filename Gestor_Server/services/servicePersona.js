const gestorPersona = require("../logica/persona.js");
const constantes = require("../constantes.js");

// Función para manejar el timeout
function fetchWithTimeout(url, options, timeout = 5000) {
  // Timeout en milisegundos (5 segundos por defecto)
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: El servicio no respondió a tiempo")),
        timeout
      )
    ),
  ]);
}

async function registrar_persona(nid_persona) {
  console.log("Actualizar persona en servicio movil");
  const persona = await gestorPersona.obtener_objeto_persona(nid_persona);

  return new Promise((resolve, reject) => {
    fetchWithTimeout(constantes.URL_SERVICIO_MOVIL + "registrar_persona", {
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

function obtener_persona(nid_persona) {
  return new Promise((resolve, reject) => {
    fetchWithTimeout(
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

function obtenerPersonasSucias() {
  console.log("obtenerPersonasSucias");
  return new Promise((resolve, reject) => {
    fetchWithTimeout(
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

function limpiarPersona(nid_persona) {
  console.log("Limpiar persona en servicio movil");
  return new Promise((resolve, reject) => {
    fetchWithTimeout(constantes.URL_SERVICIO_MOVIL + "limpiar_persona", {
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

module.exports.registrar_persona = registrar_persona;
module.exports.obtener_persona = obtener_persona;
module.exports.obtenerPersonasSucias = obtenerPersonasSucias;
module.exports.limpiarPersona = limpiarPersona;
