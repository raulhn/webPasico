const gestorInstrumentos = require("../logica/instrumentos");
const constantes = require("../logica/constantes");
const servletComun = require("./servlet_comun");

function registrarInstrumento(req, res) {
  servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const { nid_instrumento, descripcion } = req.body;
      gestorInstrumentos.registrarInstrumento(nid_instrumento, descripcion);
      res.status(200).json({
        error: false,
        mensaje: "Instrumento registrado correctamente",
      });
    } catch (error) {
      console.error("Error al registrar el instrumento:", error);
      res.status(500).json({
        error: "Error al registrar el instrumento",
        message: error.message,
      });
    }
  });
}

module.exports.registrarInstrumento = registrarInstrumento;
