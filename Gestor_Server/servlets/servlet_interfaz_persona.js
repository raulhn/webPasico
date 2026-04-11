const servlet_comun = require("./servlet_comun.js");
const gestor_interfaz_persona = require("../logica/interfaz_persona.js");
const gestor_interfaz_socio = require("../logica/interfaz_socio.js");
const gestor_persona = require("../logica/persona.js");

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

        if (
          interfaz_personas[i].operacion === constantes.OPERACION_ACTUALIZAR &&
          conflictos.length === 0
        ) {
          let nid_socio = conflictos[0].nid_socio;
          if (!nid_socio) {
            const socio = await gestor_interfaz_socio.obtener_socio(
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

        if (nid_socio != nid_socio_nuevo) {
          const socio = await gestor_persona.obtener_persona(nid_socio);
          const socio_nuevo =
            await gestor_persona.obtener_persona(nid_socio_nuevo);

          resultado.socio = socio;
          resultado.socio_nuevo = socio_nuevo;
        }

        resultado_interfaz_personas.push(resultado);
      }

      res
        .status(200)
        .send({ error: false, interfaz_personas: resultado_interfaz_personas });
    } catch (error) {
      console.log(
        "servlet_interfaz_persona -> obtener_interfaz_personas: Se ha producido un error al recuperar el interfaz de personas",
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
