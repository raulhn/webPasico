const gestorPartituras = require("../logica/partituras.js");
const servletComun = require("./servlet_comun.js");
const constantes = require("../constantes.js");

async function insertarPartitura(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
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
      const { titulo, autor, nid_categoria, url_partitura } = req.body;

      const nid_partitura = await gestorPartituras.insertarPartitura(
        titulo,
        autor,
        nid_categoria,
        url_partitura
      );

      res.status(200).send({
        error: false,
        mensaje: "Partitura insertada correctamente",
        nid_partitura: nid_partitura,
      });
    }
  } catch (error) {
    console.error("Error al insertar la partitura: ", error);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al insertar la partitura" });
  }
}

async function actualizarPartitura(req, res) {
  try {
    const rolesPermitidos = [constantes.DIRECTOR, constantes.ADMINISTRADOR];
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
      const { nid_partitura, titulo, autor, nid_categoria, url_partitura } =
        req.body;
      const result = await gestorPartituras.actualizarPartitura(
        nid_partitura,
        titulo,
        autor,
        nid_categoria,
        url_partitura
      );
      res
        .status(200)
        .send({ error: false, mensaje: "Partitura actualizada correctamente" });
    }
  } catch (error) {
    console.error("Error al actualizar la partitura: ", error);
    res
      .status(500)
      .send({ error: true, mensaje: "Error al actualizar la partitura" });
  }
}

async function obtenerPartituras(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    let rolDirector = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos
    );
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener las partituras",
      });
    } else {
      const partituras = await gestorPartituras.obtenerPartituras();
      res.status(200).send({ error: false, partituras: partituras });
    }
  } catch (error) {
    console.error("Error al obtener las partituras: ", error);
    res.status(500).send({
      error: true,
      mensaje: "Error al obtener las partituras",
    });
  }
}

async function obtenerPartitura(req, res) {
  try {
    const rolesPermitidos = [
      constantes.DIRECTOR,
      constantes.ADMINISTRADOR,
      constantes.MUSICO,
    ];
    let rolDirector = await servletComun.comprobarRol(
      req,
      res,
      rolesPermitidos
    );
    if (!rolDirector) {
      res.status(403).send({
        error: true,
        mensaje: "No tienes permisos para obtener la partitura",
      });
    } else {
      const nid_partitura = req.params.nid_partitura;
      const partitura = await gestorPartituras.obtenerPartitura(nid_partitura);
      res.status(200).send({ error: false, partitura: partitura });
    }
  } catch (error) {
    console.error("Error al obtener la partitura: ", error);
    res.status(500).send({
      error: true,
      mensaje: "Error al obtener la partitura",
    });
  }
}

module.exports.actualizarPartitura = actualizarPartitura;
module.exports.insertarPartitura = insertarPartitura;
module.exports.obtenerPartituras = obtenerPartituras;
module.exports.obtenerPartitura = obtenerPartitura;
