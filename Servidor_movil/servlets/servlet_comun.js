function comprobacionLogin(req, res) {
  const token = req.cookies.access_token;
  if (!token) {
    return res
      .status(401)
      .send({ error: true, mensaje: "No autenticado", codigo: 1 });
  }

  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("El token ha expirado:", err);
        return res
          .status(401)
          .send({ error: true, mensaje: "Token expirado", codigo: 1 });
      }
      console.error("Error al verificar el token:", err);
      return res
        .status(401)
        .send({ error: true, mensaje: "No autenticado", codigo: 2 });
    }
  });
}

module.exports.comprobacionLogin = comprobacionLogin;
