const gestorCursos = require("../logica/curso.js");
const serviceComun = require("./serviceComun.js");

function peticionRegistrarCurso(curso) {
  return new Promise((resolve, reject) => {
    try {
      serviceComun
        .fetchWithTimeout(process.env.URL_SERVICIO_MOVIL + "registrar_curso", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY_MOVIL,
          },
          body: JSON.stringify({
            nid_curso: curso.nid,
            descripcion: curso.descripcion,
            ano: curso.ano,
            fecha_actualizacion: curso.fecha_actualizacion,
            activo: curso.activo,
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

              resolve(data);
            })
            .catch((error) => {
              console.error(
                "serviceCursos.js - Error al procesar la respuesta JSON:",
                error,
              );
              reject("Error al procesar la respuesta JSON");
            });
        })
        .catch((error) => {
          console.error("Error al realizar la solicitud:", error);
          reject("Error al realizar la solicitud");
        });
    } catch (error) {
      console.error("Error en la función registrar_curso:", error);
      reject("Error en la función registrar_curso");
    }
  });
}

async function actualizar_sucios() {
  try {
    const cursos_sucios = await gestorCursos.obtener_cursos_sucios();
    for (const curso of cursos_sucios) {
      try {
        await peticionRegistrarCurso(curso);
        await gestorCursos.actualizar_sucio(curso.nid, "N");
      } catch (error) {
        console.error(
          `Error al actualizar el curso con nid ${curso.nid}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error("Error al actualizar cursos sucios:", error);
    throw new Error("Error al actualizar cursos sucios");
  }
}

module.exports.actualizar_sucios = actualizar_sucios;
