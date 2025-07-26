const gestorMatriculaAsignatura = require("../logica/matricula_asignatura.js");
const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");
const serviceMatricula = require("./serviceMatricula.js");

function peticion_registirar_matricula_asignatura(matricula_asignatura) {
  return new Promise((resolve, reject) => {
    serviceComun
      .fetchWithTimeout(
        constantes.URL_SERVICIO_MOVIL + "registrar_matricula_asignatura",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_MOVIL,
          },

          body: JSON.stringify({
            nid_matricula_asignatura:
              matricula_asignatura.nid_matricula_asignatura,
            nid_matricula: matricula_asignatura.nid_matricula,
            nid_asignatura: matricula_asignatura.nid_asignatura,
            fecha_alta: matricula_asignatura.fecha_alta,
            fecha_baja: matricula_asignatura.fecha_baja,
            fecha_actualizacion: matricula_asignatura.fecha_actualizacion,
          }),
        }
      )
      .then((response) => {
        console.log(
          "serviceMatriculaAsignatura.js - Respuesta de la API:",
          response
        );
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
              "serviceMatriculaAsignatura.js - Error al procesar la respuesta JSON:",
              error
            );
            reject("Error al procesar la respuesta JSON");
          });
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        reject("Error al realizar la solicitud");
      });
  });
}

async function registrar_matricula_asignatura(nid_matricula_asignatura) {
  try {
    console.log("nid_matricula_asignatura", nid_matricula_asignatura);

    // Se obtiene la matricula_asignatura //
    const matricula_asignatura =
      await gestorMatriculaAsignatura.obtener_matricula_asignatura(
        nid_matricula_asignatura
      );

    await peticion_registirar_matricula_asignatura(matricula_asignatura);
    await gestorMatriculaAsignatura.modificar_sucio(
      nid_matricula_asignatura,
      "N"
    );
    return;
  } catch (error) {
    console.error("Error en la función registrar_matricula:", error);
    throw new Error("Error en la función registrar_matricula");
  }
}

async function actualizar_sucios() {
  try {
    const matriculas_asignaturas =
      await gestorMatriculaAsignatura.obtener_matriculas_asignaturas_sucias();
    for (let i = 0; i < matriculas_asignaturas.length; i++) {
      const matricula_asignatura = matriculas_asignaturas[i];
      await registrar_matricula_asignatura(matricula_asignatura.nid);
    }
    return;
  } catch (error) {
    console.error("Error en la función actualizar_sucios:", error);
    throw new Error("Error en la función actualizar_sucios");
  }
}

module.exports.registrar_matricula_asignatura = registrar_matricula_asignatura;
module.exports.actualizar_sucios = actualizar_sucios;
