const gestorPartituras = require("../logica/partituras.js");
const servletComun = require("./servlet_comun.js");

async function insertarPartitura(req, res) {
  try {
    const rolesPermitidos = ["DIRECTOR", "ADMINISTRADOR"];
    let rolDirector = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos
    );
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para registrar un evento de concierto",
      });
    } else {
      const { titulo, autor, categoria, url_partitura } = req.body;
      const result = await gestorPartituras.insertarPartitura(
        titulo,
        autor,
        categoria,
        url_partitura
      );
      res
        .status(200)
        .json({ message: "Partitura insertada correctamente", result });
    }
    console.error("Error al insertar la partitura: ", error);
    res.status(500).json({ message: "Error al insertar la partitura" });
  } catch (error) {
    console.error("Error al insertar la partitura: ", error);
    res.status(500).json({ message: "Error al insertar la partitura" });
  }
}

async function actualizarPartitura(req, res) {
  try {
    const rolesPermitidos = ["DIRECTOR", "ADMINISTRADOR"];
    let rolDirector = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos
    );
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para registrar un evento de concierto",
      });
    } else {
      const { nid_partitura, titulo, autor, categoria, url_partitura } =
        req.body;
      const result = await gestorPartituras.actualizarPartitura(
        nid_partitura,
        titulo,
        autor,
        categoria,
        url_partitura
      );
      res
        .status(200)
        .json({ message: "Partitura actualizada correctamente", result });
    }
  } catch (error) {
    console.error("Error al actualizar la partitura: ", error);
    res.status(500).json({ message: "Error al actualizar la partitura" });
  }
}

module.exports.actualizarPartitura = actualizarPartitura;
module.exports.insertarPartitura = insertarPartitura;
