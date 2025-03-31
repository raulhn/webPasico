const gestorUsuario = require("../logica/usuario.js");

function registrarUsuario(req, res) {
  const { nombre, primerApellido, segundoApellido, correoElectronico } =
    req.body;

  gestorUsuario
    .registrarUsuario(
      nombre,
      primerApellido,
      segundoApellido,
      correoElectronico
    )
    .then((resultado) => {
      res.status(200).send("Usuario registrado correctamente.");
    })
    .catch((error) => {
      console.error("Error al registrar el usuario:", error);
      res.status(500).send("Error al registrar el usuario.");
    });
}

module.exports.registrarUsuario = registrarUsuario;
