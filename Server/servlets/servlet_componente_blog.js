const componente = require("../componentes/componente.js");
const constantes = require("../constantes.js");
const componenteBlog = require("../componentes/componente_blog.js");
const usuario = require("../logica/usuario.js");
const servletComprobaciones = require("./servlet_comun.js");

async function registrarComponenteBlog(req, res) {
  const id = req.body.id;
  const tipoAsociacion = req.body.tipo_asociacion;
  let nOrden;

  try {
    const bAdministrador = await usuario.esAdministrador(req.session.nombre);
    if (bAdministrador) {
      if (tipoAsociacion === constantes.TIPO_ASOCIACION_PAGINA) {
        nOrden = await componente.obtener_ultimo_orden(id);
      } else if (tipoAsociacion === constantes.TIPO_ASOCIACION_COMPONENTE) {
        return res.status(400).send({ error: true, message: "No permitido" });
      }
      await componente.registrar_componente_comun(
        constantes.TIPO_COMPONENTE_BLOG,
        id,
        tipoAsociacion,
        nOrden
      );
      return res
        .status(200)
        .send({ error: false, message: "Se ha registrado el componente" });
    } else {
      return res
        .status(400)
        .send({
          error: true,
          message: "Error al registrar el componente de blog",
        });
    }
  } catch (e) {
    return res
      .status(400)
      .send({
        error: true,
        message: "Error al registrar el componente de blog",
      });
  }
}

async function addElementoBlog(req, res) {
  const titulo = req.body.titulo;
  const fecha = req.body.fecha;
  const fichero = req.files;
  const idComponente = req.body.id_componente;
  const descripcion = req.body.descripcion;

  try {
    const bAdministrador = await usuario.esAdministrador(req.session.nombre);
    if (bAdministrador) {
      await componenteBlog.add_componente_blog(
        idComponente,
        titulo,
        fecha,
        fichero,
        descripcion
      );
      return res.status(200).send({ error: false, message: "Elemento creado" });
    } else {
      return res
        .status(400)
        .send({
          error: true,
          message: "Error al registrar el componente de blog",
        });
    }
  } catch (error) {
    return res
      .status(400)
      .send({
        error: true,
        message: "Error al registrar el componente de blog",
      });
  }
}

async function obtenerComponenteBlog(req, res) {
  const idComponente = req.params.id_componente;
  try {
    const resultado =
      await componenteBlog.obtener_componente_blog(idComponente);
    return res.status(200).send({ error: false, componente_blog: resultado });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ error: true, message: "Error al obtener el componente" });
  }
}

async function eliminarElementoBlog(req, res) {
  const bEsAdministrador = await usuario.esAdministrador(req.session.nombre);
  if (bEsAdministrador) {
    const idComponente = req.body.id_componente;
    const idImagen = req.body.id_imagen;
    const idMenu = req.body.id_menu;
    try {
      await componenteBlog.eliminar_elemento_blog(
        idComponente,
        idImagen,
        idMenu
      );
      return res
        .status(200)
        .send({ error: false, message: "Elemento eliminado" });
    } catch (e) {
      console.log("Error al eliminar el elemento");
      return res
        .status(400)
        .send({
          error: true,
          message: "Error al eliminar el elemento",
          info: e,
        });
    }
  } else {
    return res
      .status(400)
      .send({
        error: true,
        message: "Error al eliminar el elemento",
        info: "Usuario no autorizado",
      });
  }
}

function obtenerArticulos(req, res) {
  servletComprobaciones.comprobaciones(req, res, async () => {
    const resultado = await componenteBlog.obtener_articulos();
    res.status(200).send({ error: false, articulos: resultado });
  });
}

function obtenerComentarios(req, res) {
  servletComprobaciones.comprobaciones(req, res, async () => {
    const resultado = await componenteBlog.obtener_comentarios();
    res.status(200).send({ error: false, comentarios: resultado });
  });
}

module.exports.registrarComponenteBlog = registrarComponenteBlog;
module.exports.addElementoBlog = addElementoBlog;
module.exports.obtenerComponenteBlog = obtenerComponenteBlog;
module.exports.eliminarElementoBlog = eliminarElementoBlog;
module.exports.obtenerArticulos = obtenerArticulos;
module.exports.obtenerComentarios = obtenerComentarios;
