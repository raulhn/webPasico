const servlet_comun = require("./servlet_comun.js");
const gestor_interfaz_persona = require("../logica/interfaz_persona.js");

function obtener_interfaz_personas(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      const lote = req.params.lote;
      const interfaz_personas =
        await gestor_interfaz_persona.obtener_interfaz_personas(lote);

      res
        .status(200)
        .send({ error: false, interfaz_personas: interfaz_personas });
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

module.exports.obtener_interfaz_personas = obtener_interfaz_personas;
