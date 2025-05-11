const gestorAsignatura = require("../logica/asignatura.js");
const constantes = require("../constantes.js");
const serviceComun = require("./serviceComun.js");

function peticion_registrar_profesor(profesor) {
  return new Promise((resolve, reject) => {
    try {
      console.log("profesor", profesor);
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_profesor",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.API_KEY_MOVIL,
            },
            body: JSON.stringify({
              nid_persona: profesor.nid_persona,
              nid_asignatura: profesor.nid_asignatura,
              esBaja: profesor.esBaja,
              fecha_actualizacion: profesor.fecha_actualizacion,
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
      console.error("Error en la función registrar_profesor:", error);
      reject("Error en la función registrar_profesor");
    }
  });
}

async function registrar_profesor(nid_persona, nid_asignatura) {
  console.log("Actualizar profesor en servicio movil");
  const profesor = await gestorAsignatura.obtener_profesor_asignatura(
    nid_asignatura,
    nid_persona
  );

  await peticion_registrar_profesor(profesor);
  await gestorAsignatura.modificar_sucio_profesor(
    nid_persona,
    nid_asignatura,
    "N"
  );
  return;
}

async function actualizar_sucios() {
  try {
    const profesores = await gestorAsignatura.obtener_profesores_sucios();

    for (let i = 0; i < profesores.length; i++) {
      const profesor = profesores[i];
      await registrar_profesor(profesor.nid_persona, profesor.nid_asignatura);
    }
    return;
  } catch (error) {
    console.error("Error en la función actualizar_sucios:", error);
    throw new Error("Error en la función actualizar_sucios");
  }
}

async function eliminar_profesor(nid_persona, nid_asignatura) {
  console.log("Eliminar profesor en servicio movil");
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(constantes.URL_SERVICIO_MOVIL + "eliminar_profesor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_MOVIL,
          },
          body: JSON.stringify({
            nid_persona: nid_persona,
            nid_asignatura: nid_asignatura,
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
    } catch (error) {
      console.error("Error en la función eliminar_profesor:", error);
      reject("Error en la función eliminar_profesor");
    }
  });
}

module.exports.registrar_profesor = registrar_profesor;
module.exports.eliminar_profesor = eliminar_profesor;
module.exports.actualizar_sucios = actualizar_sucios;
