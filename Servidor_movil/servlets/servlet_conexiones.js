function registrarConexion(req, res) {
  const token = req.body.token;

  if (!token) {
    res.status(400).send("Token no proporcionado");
    return;
  }

  try {
    conexion.registrarConexion(token);
    res.status(200).send("Conexión registrada correctamente.");
  } catch (error) {
    console.error("Error al registrar la conexión:", error);
    res.status(500).send("Error al registrar la conexión.");
  }
}

module.exports.registrarConexion = registrarConexion;
