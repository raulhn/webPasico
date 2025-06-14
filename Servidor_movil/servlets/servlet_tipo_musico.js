const servlet_comun = require("./servlet_comun");
const gestorTipoMusico = require("../logica/tipo_musico");

function registrarTipoMusico(req, res) {
  servlet_comun.comprobacionAccesoAPIKey(req, res, async () => {
    try {
      const { nid_tipo_musico, descripcion } = req.body;
      console.log("Registrar tipo de músico: ", nid_tipo_musico, descripcion);
      await gestorTipoMusico.registrarTipoMusico(nid_tipo_musico, descripcion);
      res.status(200).json({
        error: false,
        mensaje: "Tipo de músico registrado correctamente",
      });
    } catch (error) {
      console.error("Error al registrar el tipo de músico:", error);
      res.status(500).json({
        error: "Error al registrar el tipo de músico",
        message: error.message,
      });
    }
  });
}

module.exports.registrarTipoMusico = registrarTipoMusico;
