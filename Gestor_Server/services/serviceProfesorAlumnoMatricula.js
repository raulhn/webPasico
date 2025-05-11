const serviceComun = require("./serviceComun.js");
const constantes = require("../constantes.js");
const gestorProfesorAlumnoMatricula = require("../logica/profesor_alumno_matricula.js");

function peticion_registrar_profesor_alumno_matricula(
  profesor_alumno_matricula
) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(
          constantes.URL_SERVICIO_MOVIL + "registrar_profesor_alumno_matricula",
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
              console.error(
                "serviceProfesorAlumnoMatricula.js - Error al procesar la respuesta JSON:",
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
      console.error(
        "Error en la función registrar_profesor_alumno_matricula:",
        error
      );
      reject("Error en la función registrar_profesor_alumno_matricula");
    }
  });
}

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

    await peticion_registrar_profesor_alumno_matricula(
      profesor_alumno_matricula
    );
    await gestorProfesorAlumnoMatricula.actualizar_sucio(
      nid_profesor_alumno_matricula,
      "N"
    );
  } catch (error) {
    console.error(
      "Error en la función registrar_profesor_alumno_matricula:",
      error
    );
    throw new Error("Error en la función registrar_profesor_alumno_matricula");
  }
}

function actualizar_sucios() {
  return new Promise(async (resolve, reject) => {
    try {
      const profesores_alumnos_matriculas =
        await gestorProfesorAlumnoMatricula.obtener_sucios();

      for (let i = 0; i < profesores_alumnos_matriculas.length; i++) {
        const profesor_alumno_matricula = profesores_alumnos_matriculas[i];
        await registrar_profesor_alumno_matricula(
          profesor_alumno_matricula.nid
        );
      }
      resolve();
    } catch (error) {
      console.error("Error en la función actualizar_sucios:", error);
      reject("Error en la función actualizar_sucios");
    }
  });
}

module.exports.registrar_profesor_alumno_matricula =
  registrar_profesor_alumno_matricula;

module.exports.actualizar_sucios = actualizar_sucios;
