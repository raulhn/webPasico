const gestorCategoriaPartituras = require("../logica/categoria_partitura.js");
const servletComun = require("./servlet_comun.js");

async function insertarCategoriaPartitura(req, res) {
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
      const { nombre_categoria } = req.body;
      const result =
        await gestorCategoriaPartituras.insertarCategoriaPartitura(
          nombre_categoria
        );
      res.status(200).json({
        error: false,
        mensaje: "Categoria de partitura insertada correctamente",
        result,
      });
    }
  } catch (error) {
    console.error("Error al insertar la categoria de partitura: ", error);
    res.status(500).json({
      error: true,
      mensaje: "Error al insertar la categoria de partitura",
    });
  }
}

async function actualizarCategoriaPartitura(req, res) {
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
      const { nid_categoria, nombre_categoria } = req.body;
      const result =
        await gestorCategoriaPartituras.actualizarCategoriaPartitura(
          nid_categoria,
          nombre_categoria
        );
      res.status(200).json({
        error: false,
        mensaje: "Categoria de partitura actualizada correctamente",
        result,
      });
    }
  } catch (error) {
    console.error("Error al actualizar la categoria de partitura: ", error);
    res.status(500).json({
      error: true,
      mensaje: "Error al actualizar la categoria de partitura",
    });
  }
}

async function obtenerCategoriasPartitura(req, res) {
  try {
    const result = await gestorCategoriaPartituras.obtenerCategoriasPartitura();
    res.status(200).json({ error: false, categorias: result });
  } catch (error) {
    console.error("Error al obtener las categorias de partitura: ", error);
    res
      .status(500)
      .json({ error: true, mensaje: "Error al obtener las categorias" });
  }
}

module.exports.insertarCategoriaPartitura = insertarCategoriaPartitura;
module.exports.actualizarCategoriaPartitura = actualizarCategoriaPartitura;
module.exports.obtenerCategoriasPartitura = obtenerCategoriasPartitura;
