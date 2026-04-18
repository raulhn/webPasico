const conexion = require("../conexion");
const constantes = require("../constantes");
const gestor_interfaz_persona = require("./interfaz_persona");
const gestor_personas = require("./persona.js");
const gestor_socios = require("./socio.js");
const gestor_interfaz_socio = require("./interfaz_socio.js");

async function cargar_personas(lote) {
  try {
    const interfaz_personas =
      await gestor_interfaz_persona.obtener_interfaz_personas_pendiente(lote);

    for (const interfaz_persona of interfaz_personas) {
      if (
        interfaz_persona.operacion === constantes.OPERACIONES_INTERFAZ.INSERTAR
      ) {
        try {
          const nid_persona = await gestor_personas.registrar_persona(
            interfaz_persona.nombre,
            interfaz_persona.primer_apellido,
            interfaz_persona.segundo_apellido,
            interfaz_persona.telefono,
            interfaz_persona.fecha_nacimiento,
            interfaz_persona.dni,
            interfaz_persona.email,
            null,
          );

          interfaz_persona.estado = constantes.ESTADOS_INTERFAZ.PROCESADO;
          interfaz_persona.nid_persona = nid_persona;

          await gestor_interfaz_persona.actualizar_interfaz_persona(
            interfaz_persona,
          );
        } catch (error) {
          console.log("Error al registrar persona: ", error);
          await gestor_interfaz_persona.actualizar_estado(
            interfaz_persona.nid_interfaz_persona,
            constantes.ESTADOS_INTERFAZ.ERROR,
          );
        }
      } else if (
        interfaz_persona.operacion ===
        constantes.OPERACIONES_INTERFAZ.ACTUALIZAR
      ) {
        try {
          const persona = {
            nombre: interfaz_persona.nombre,
            primer_apellido: interfaz_persona.primer_apellido,
            segundo_apellido: interfaz_persona.segundo_apellido,
            telefono: interfaz_persona.telefono,
            fecha_nacimiento: interfaz_persona.fecha_nacimiento,
            nif: interfaz_persona.dni,
            correo_electronico: interfaz_persona.email,
            nid_persona: interfaz_persona.nid_persona,
          };
          await gestor_personas.actualizar_persona_interfaz(persona);
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

async function cargar_interfaz_socios(lote) {
  try {
    const interfaz_socios =
      await gestor_interfaz_socio.obtener_interfaz_socio_lote(lote);

    for (const interfaz_socio of interfaz_socios) {
      if (interfaz_socio.estado === constantes.ESTADOS_INTERFAZ.PENDIENTE) {
        if (
          interfaz_socio.operacion ===
          constantes.OPERACIONES_INTERFAZ.SIN_CAMBIOS
        ) {
          interfaz_socio.estado = constantes.ESTADOS_INTERFAZ.PROCESADO;
          await gestor_interfaz_socio.actualizar_interfaz_socio(interfaz_socio);
        } else {
          const interfaz_persona =
            await gestor_interfaz_persona.obtener_interfaz_persona(
              interfaz_socio.nid_interfaz_persona,
            );
          const nid_socio = interfaz_persona.nid_persona;
          const bExisteSocio = await gestor_socios.existe_socio(nid_socio);

          if (bExisteSocio > 0) {
            // Se actualizan las fechas de alta y baja del socio
            const socios = await gestor_socios.obtener_socio(nid_socio);
            const socio = socios[0];
            socio.fecha_alta = interfaz_socio.fecha_alta;
            socio.fecha_baja = interfaz_socio.fecha_baja;
            try {
              console.log("Socio: ", socio);
              await gestor_socios.actualizar_socio(
                socio.nid_persona,
                socio.num_socio,
                socio.fecha_alta,
                socio.fecha_baja,
              );

              interfaz_socio.estado = constantes.ESTADOS_INTERFAZ.PROCESADO;
              await gestor_interfaz_socio.actualizar_interfaz_socio(
                interfaz_socio,
              );
            } catch (error) {
              console.log("Error al actualizar socio: ", error);
              interfaz_socio.estado = constantes.ESTADOS_INTERFAZ.ERROR;
              gestor_interfaz_socio.actualizar_interfaz_socio(interfaz_socio);
            }
            console.log("La persona con ID " + nid_socio + " ya es socio");
          } else {
            try {
              await gestor_socios.registrar_socio(
                nid_socio,
                "",
                interfaz_socio.fecha_alta,
              );

              interfaz_socio.estado = constantes.ESTADOS_INTERFAZ.PROCESADO;
              await gestor_interfaz_socio.actualizar_interfaz_socio(
                interfaz_socio,
              );
            } catch (error) {
              console.log("Error al registrar socio: ", error);
              interfaz_socio.estado = constantes.ESTADOS_INTERFAZ.ERROR;
              gestor_interfaz_socio.actualizar_interfaz_socio(interfaz_socio);
            }
          }
        }
      }
    }

    const interfaz_personas =
      await gestor_interfaz_persona.obtener_interfaz_personas(lote);

    for (const interfaz_persona of interfaz_personas) {
      if (interfaz_persona.nid_interfaz_socio) {
        const nid_socio = await gestor_interfaz_socio.obtener_nid_socio(
          interfaz_persona.nid_interfaz_socio,
        );

        // Si la persona ya es socio no le asocia otro socio
        const bExisteSocio = await gestor_socios.existe_socio(
          interfaz_persona.nid_persona,
        );

        if (nid_socio && bExisteSocio == 0) {
          if (interfaz_persona.nid_persona !== nid_socio) {
            await gestor_socios.actualizar_socio_persona(
              interfaz_persona.nid_persona,
              nid_socio,
            );
          }
        }
      }
    }
  } catch (error) {
    console.log(
      "carga_interfaz_registro -> carga_interfaz_socio: Error al cargar socios: ",
      error,
    );
    throw new Error("Error al cargar socios");
  }
}

module.exports.cargar_personas = cargar_personas;
module.exports.cargar_interfaz_socios = cargar_interfaz_socios;
