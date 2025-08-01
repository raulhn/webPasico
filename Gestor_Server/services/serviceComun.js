const crypto = require("crypto");
const cron = require("node-cron");
const serviceAsignatura = require("./serviceAsignatura");
const serviceMatricula = require("./serviceMatricula");
const serviceMatriculaAsignatura = require("./serviceMatriculaAsignatura");
const serviceProfesorAlumnoMatricula = require("./serviceProfesorAlumnoMatricula");
const serviceMusicos = require("./serviceMusicos");
const servicePersona = require("./servicePersona");
const serviceProfesores = require("./serviceProfesores");
const serviceSocios = require("./serviceSocios");
const serviceInstrumentos = require("./serviceInstrumentos");
const serviceTipoMusico = require("./serviceTipoMusico");
const serviceTipoProgreso = require("./serviceTipoProgreso");
const serviceTrimestres = require("./serviceTrimestres");
const serviceEvaluacion = require("./serviceEvaluacion");
const serviceEvaluacionMatricula = require("./serviceEvaluacionMatricula");

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

async function actualizar_sucios() {
  console.log("Iniciando el proceso de refresco");
  cron.schedule("*/1 * * * *", async () => {
    try {
      await serviceAsignatura.actualizar_sucios();
      await servicePersona.actualizar_sucios();
      await serviceSocios.actualizar_sucios();
      await serviceMatricula.actualizar_sucios();
      await serviceMatriculaAsignatura.actualizar_sucios();
      await serviceProfesores.actualizar_sucios();
      await serviceProfesorAlumnoMatricula.actualizar_sucios();
      await serviceTipoProgreso.actualizar_sucios();
      await serviceTrimestres.actualizar_sucios();
      await serviceInstrumentos.actualizar_sucios();
      await serviceTipoMusico.actualizar_sucios();
      await serviceMusicos.actualizar_sucios();
      await serviceEvaluacion.actualizar_sucios();
      await serviceEvaluacionMatricula.actualizar_sucios();
    } catch (error) {
      console.error("Error en la tarea programada:", error);
    }
  });
}

module.exports.fetchWithTimeout = fetchWithTimeout;
module.exports.actualizar_sucios = actualizar_sucios;
