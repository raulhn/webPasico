const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");
const gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula.js");
const serviceMatriculaAsignatura = require("./serviceMatriculaAsignatura.js");

async function registrar_profesor_alumno_matricula(
  nid_profesor_alumno_matricula
) {
  try {
    console.log(
      "registrar_profesor_alumno_matricula - nid_profesor_alumno_matricula",
      nid_profesor_alumno_matricula
    );
    let profesor_alumno_matricula =
      await gestorProfesorAlumnoMatricula.obtener_profesor_alumno_matricula(
        nid_profesor_alumno_matricula
      );

    console.log("profesor_alumno_matricula", profesor_alumno_matricula);
    await serviceMatriculaAsignatura.registrar_matricula_asignatura(
      profesor_alumno_matricula.nid_matricula_asignatura
    );

    console.log(profesor_alumno_matricula);
    return new Promise((resolve, reject) => {
      try {
        serviceComun
          .fetchWithTimeout(
            constantes.URL_SERVICIO_MOVIL +
              "registrar_profesor_alumno_matricula",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.API_KEY_MOVIL,
              },
              body: JSON.stringify({
                nid_profesor_alumno_matricula:
                  profesor_alumno_matricula.nid_profesor_alumno_matricula,
                nid_profesor: profesor_alumno_matricula.nid_profesor,
                nid_matricula_asignatura:
                  profesor_alumno_matricula.nid_matricula_asignatura,
                fecha_alta: profesor_alumno_matricula.fecha_alta,
                fecha_baja: profesor_alumno_matricula.fecha_baja,
                fecha_actualizacion:
                  profesor_alumno_matricula.fecha_actualizacion,
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
        console.error(
          "Error en la función registrar_profesor_alumno_matricula:",
          error
        );
        reject("Error en la función registrar_profesor_alumno_matricula");
      }
    });
  } catch (error) {
    console.error(
      "Error en la función registrar_profesor_alumno_matricula:",
      error
    );
    throw new Error("Error en la función registrar_profesor_alumno_matricula");
  }
}

module.exports.registrar_profesor_alumno_matricula =
  registrar_profesor_alumno_matricula;
