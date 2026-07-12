const gestion_usuarios = require("../logica/usuario.js");

async function comprobaciones(req, res, funcion_especifica) {
  try {
    let usuario = req.session.nombre;
    if (await gestion_usuarios.existe_login(usuario)) {
      if (await gestion_usuarios.esAdministrador(usuario)) {
        try {
          await funcion_especifica();
        } catch (error) {
          console.log(error);
          res.status(400).send({
            error: true,
            message: "Se ha producido un error",
            info: error,
          });
        }
      } else {
        res.status(401).send({ error: true, message: "No está autorizado" });
      }
    } else {
      res.status(401).send({ error: true, message: "No está autorizado" });
    }
  } catch (error) {
    console.log("Error en comprobaciones:", error);
    res.status(500).send({
      error: true,
      message: "Error interno del servidor",
      info: error,
    });
  }
}

async function comprobaciones_profesor(req, res, funcion_especifica) {
  try {
    let usuario = req.session.nombre;

    if (
      (await gestion_usuarios.existe_login(usuario)) &&
      (await gestion_usuarios.esProfesor(usuario))
    ) {
      try {
        await funcion_especifica();
      } catch (error) {
        res.status(400).send({
          error: true,
          message: "Se ha producido un error",
          info: error,
        });
      }
    } else {
      res.status(401).send({ error: true, message: "No está autorizado" });
    }
  } catch (error) {
    console.log("Error en comprobaciones_profesor:", error);
    res.status(500).send({
      error: true,
      message: "Error interno del servidor",
      info: error,
    });
  }
}

async function comprobaciones_general(req, res, funcion_especifica) {
  try {
    let usuario = req.session.nombre;

    if (await gestion_usuarios.existe_login(usuario)) {
      try {
        await funcion_especifica();
      } catch (error) {
        console.log(error);
        res.status(400).send({
          error: true,
          message: "Se ha producido un error",
          info: error,
        });
      }
    } else {
      res.status(401).send({ error: true, message: "No está autorizado" });
    }
  } catch (error) {
    console.log("Error en comprobaciones_general:", error);
    res
      .status(500)
      .send({
        error: true,
        message: "Error interno del servidor",
        info: error,
      });
  }
}

module.exports.comprobaciones = comprobaciones;
module.exports.comprobaciones_profesor = comprobaciones_profesor;
module.exports.comprobaciones_general = comprobaciones_general;
