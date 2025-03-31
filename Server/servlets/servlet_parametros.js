const parametros = require("../logica/parametro.js");

function obtener_parametro(req, res) {
  let identificador = req.params.identificador;

  parametros
    .obtiene_parametro(identificador)
    .then(function (resultado) {
      return res.status(200).send({ error: false, valor: resultado });
    })
    .cathc((error) => {
      return res
        .status(200)
        .send({ error: true, message: "No existe el parametro" });
    });
}

module.exports.obtener_parametro = obtener_parametro;
