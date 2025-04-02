const gestorConexion = require("../logica/gestorConexiones.js");

function registrarConexion(req, res) {
  const token = req.body.token;

  if (!token) {
    res.status(400).send("Token no proporcionado");
    return;
  }

  try {
    gestorConexion.registrarConexion(token);
    res
      .status(200)
      .send({ error: false, mensaje: "Conexión registrada correctamente." });
  } catch (error) {
    console.error("Error al registrar la conexión:", error);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al registrar la conexión." });
  }
}

module.exports.registrarConexion = registrarConexion;
