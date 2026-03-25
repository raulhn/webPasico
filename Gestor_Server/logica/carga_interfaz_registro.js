const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_interfaz_persona = require("./interfaz_persona");
const gestor_personas = require("./persona.js");

async function cargar_personas(lote) {
  try {
    const interfaz_personas =
      await gestor_interfaz_persona.obtener_interfaz_personas_pendiente(lote);

    for (const interfaz_persona of interfaz_personas) {
      if (
        interfaz_persona.operacion === constantes.OPERACIONES_INTERFAZ.INSERTAR
      ) {
        try {
          await gestor_personas.registrar_persona(
            interfaz_persona.nombre,
            interfaz_persona.primer_apellido,
            interfaz_persona.segundo_apellido,
            interfaz_persona.telefono,
            interfaz_persona.fecha_nacimiento,
            interfaz_persona.dni,
            interfaz_persona.email,
            null,
          );
          gestor_interfaz_persona.actualizar_estado(
            interfaz_persona.nid_interfaz_persona,
            constantes.ESTADOS_INTERFAZ.PROCESADO,
          );
        } catch (error) {
          console.log("Error al registrar persona: ", error);
          gestor_interfaz_persona.actualizar_estado(
            interfaz_persona.nid_interfaz_persona,
            constantes.ESTADOS_INTERFAZ.ERROR,
          );
          continue; // Continuar con la siguiente persona
        }
      } else if (
        interfaz_persona.operacion ===
        constantes.OPERACIONES_INTERFAZ.ACTUALIZAR
      ) {
        try {
          await gestor_personas.actualizar_persona(
            interfaz_persona.nid_persona,
            interfaz_persona.nombre,
            interfaz_persona.primer_apellido,
            interfaz_persona.segundo_apellido,
            interfaz_persona.telefono,
            interfaz_persona.fecha_nacimiento,
            interfaz_persona.dni,
            interfaz_persona.email,
            null,
          );
          gestor_interfaz_persona.actualizar_estado(
            interfaz_persona.nid_interfaz_persona,
            constantes.ESTADOS_INTERFAZ.PROCESADO,
          );
        } catch (error) {
          console.log("Error al actualizar persona: ", error);
          gestor_interfaz_persona.actualizar_estado(
            interfaz_persona.nid_interfaz_persona,
            constantes.ESTADOS_INTERFAZ.ERROR,
          );
          continue; // Continuar con la siguiente persona
        }
      } else if (
        interfaz_persona.operacion ===
        constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS
      ) {
        gestor_interfaz_persona.actualizar_estado(
          interfaz_persona.nid_interfaz_persona,
          constantes.ESTADOS_INTERFAZ.PROCESADO,
        );
      } else {
        console.log(
          "Operación no reconocida para persona con ID: ",
          interfaz_persona.nid_interfaz_persona,
        );
      }
    }
  } catch (error) {
    console.log("Error al cargar personas: ", error);
    throw new Error("Error al cargar personas");
  }
}

module.exports.cargar_personas = cargar_personas;
