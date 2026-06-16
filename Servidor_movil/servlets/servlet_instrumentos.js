const gestorInstrumentos = require("../logica/instrumentos");
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

async function obtenerInstrumentos(req, res) {
  try {
    const instrumentos = await gestorInstrumentos.obtenerInstrumentos();
    res.status(200).json({
      error: false,
      instrumentos: instrumentos,
    });
  } catch (error) {
    console.error("Error al obtener los instrumentos:", error);
    res.status(500).json({
      error: "Error al obtener los instrumentos",
      message: error.message,
    });
  }
}

module.exports.registrarInstrumento = registrarInstrumento;
module.exports.obtenerInstrumentos = obtenerInstrumentos;
