const servlet_comun = require("./servlet_comun.js");
const gestor_interfaz_persona = require("../logica/interfaz_persona.js");
const gestor_interfaz_socio = require("../logica/interfaz_socio.js");
const gestor_persona = require("../logica/persona.js");
const gestor_socio = require("../logica/socio.js");
const constantes = require("../constantes.js");

function obtener_interfaz_personas(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      const lote = req.params.lote;
      const interfaz_personas =
        await gestor_interfaz_persona.obtener_interfaz_personas(lote);

      let resultado_interfaz_personas = [];

      for (let i = 0; i < interfaz_personas.length; i++) {
        const conflictos =
          await gestor_interfaz_persona.obtener_conflictos_personas(
            interfaz_personas[i].nid_interfaz_persona,
          );
        let resultado = {
          interfaz_persona: interfaz_personas[i],
          conflictos_persona: conflictos,
        };
        let nid_socio = null;
        if (
          interfaz_personas[i].operacion ===
            constantes.OPERACIONES_INTERFAZ.ACTUALIZAR &&
          conflictos.length > 0
        ) {
          nid_socio = conflictos[0].nid_socio;
          if (!nid_socio) {
            const socio = await gestor_socio.obtener_socio(
              conflictos[0].nid_persona,
            );
            if (socio && socio.length > 0) {
              nid_socio = socio[0].nid_persona;
            }
          }
        }

        let nid_socio_nuevo = await gestor_interfaz_persona.obtener_socio_nuevo(
          interfaz_personas[i].nid_interfaz_persona,
        );

        console.log("Socios:", nid_socio, nid_socio_nuevo);
        if (nid_socio && nid_socio_nuevo && nid_socio != nid_socio_nuevo) {
          const socio = await gestor_persona.obtener_persona(nid_socio);
          const socio_nuevo =
            await gestor_persona.obtener_persona(nid_socio_nuevo);
          resultado.socio = socio;
          resultado.socio_nuevo = socio_nuevo;
        } else if (nid_socio_nuevo) {
          const socio_nuevo =
            await gestor_persona.obtener_persona(nid_socio_nuevo);
          resultado.socio_nuevo = socio_nuevo;
        } else if (interfaz_personas[i].nid_interfaz_socio) {
          const interfaz_socio =
            await gestor_interfaz_socio.obtener_interfaz_socio_nid(
              interfaz_personas[i].nid_interfaz_socio,
            );
          if (
            interfaz_socio.operacion == constantes.OPERACIONES_INTERFAZ.INSERTAR
          ) {
            const interfaz_persona_socio =
              await gestor_interfaz_persona.obtener_interfaz_persona(
                interfaz_socio.nid_interfaz_persona,
              );
            resultado.socio_nuevo = {
              dni: interfaz_persona_socio.nif,
              nombre: interfaz_persona_socio.nombre,
              primer_apellido: interfaz_persona_socio.primer_apellido,
              segundo_apellido: interfaz_persona_socio.segundo_apellido,
              correo_electronico: interfaz_persona_socio.email,
              telefono: interfaz_persona_socio.telefono,
            };
          }
        }
        resultado_interfaz_personas.push(resultado);
      }

      const interfaz_socios =
        await gestor_interfaz_socio.obtener_interfaz_socio_lote(lote);

      let interfaz_socios_info = [];

      for (let i = 0; i < interfaz_socios.length; i++) {
        const interfaz_persona_socio =
          await gestor_interfaz_persona.obtener_interfaz_persona(
            interfaz_socios[i].nid_interfaz_persona,
          );

        let socio_info = null;
        if (interfaz_persona_socio.nid_persona) {
          socio_info = await gestor_persona.obtener_persona(
            interfaz_persona_socio.nid_persona,
          );
        }
        interfaz_socios_info.push({
          interfaz_socio: interfaz_socios[i],
          interfaz_persona_socio: interfaz_persona_socio,
          socio: socio_info,
        });
      }

      res.status(200).send({
        error: false,
        interfaz_personas: resultado_interfaz_personas,
        interfaz_socios: interfaz_socios_info,
      });
    } catch (error) {
      console.log(
        "servlet_interfaz_persona -> obtener_interfaz_personas: Se ha producido un error al recuperar el interfaz de personas",
        error,
      );
      res.status(400).send({
        error: true,
        mensaje:
          "Se ha producido un error al recuperar el interfaz de personas",
      });
    }
  });
}

function actualizar_operacion(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      const { nid_interfaz_persona, operacion, nid_persona } = req.body;
      await gestor_interfaz_persona.actualizar_operacion_conflicto(
        nid_interfaz_persona,
        operacion,
        nid_persona,
      );
      await gestor_interfaz_socio.actualizar_conflicto(nid_interfaz_persona);

      res
        .status(200)
        .send({ error: false, mensaje: "Operación actualizada correctamente" });
    } catch (error) {
      console.log(
        "servlet_interfaz_persona -> actualizar_operacion: Se ha producido un error al actualizar la operación del conflicto",
      );
      res.status(400).send({
        error: true,
        mensaje:
          "Se ha producido un error al actualizar la operación del conflicto",
      });
    }
  });
}

function actualizar_operaciones(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      const { operaciones } = req.body;
      for (let i = 0; i < operaciones.length; i++) {
        const { nid_interfaz_persona, operacion, nid_persona } = operaciones[i];
        await gestor_interfaz_persona.actualizar_operacion_conflicto(
          nid_interfaz_persona,
          operacion,
          nid_persona,
        );
        await gestor_interfaz_socio.actualizar_conflicto(nid_interfaz_persona);
      }
      res.status(200).send({
        error: false,
        mensaje: "Operaciones actualizadas correctamente",
      });
    } catch (error) {
      console.log(
        "servlet_interfaz_persona -> actualizar_operaciones: Se ha producido un error al actualizar las operaciones de los conflictos",
      );
      res.status(400).send({
        error: true,
        mensaje:
          "Se ha producido un error al actualizar las operaciones de los conflictos",
      });
    }
  });
}

module.exports.obtener_interfaz_personas = obtener_interfaz_personas;
module.exports.actualizar_operacion = actualizar_operacion;
module.exports.actualizar_operaciones = actualizar_operaciones;
