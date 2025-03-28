const componente = require("../componentes/componente.js");
const constantes = require("../constantes.js");
const componente_blog = require("../componentes/componente_blog.js");
const usuario = require("../usuario.js");

async function registrar_componente_blog(req, res) {
  let id = req.body.id;
  let tipo_asociacion = req.body.tipo_asociacion;
  let nOrden;

  try {
    let bAdministrador = await usuario.esAdministrador(req.session.nombre);
    if (bAdministrador) {
      if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA) {
        nOrden = await componente.obtener_ultimo_orden(id);
      } else if (tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE) {
        return res.status(400).send({ error: true, message: "No permitido" });
      }
      let id_componente = await componente.registrar_componente_comun(
        constantes.TIPO_COMPONENTE_BLOG,
        id,
        tipo_asociacion,
        nOrden
      );
      return res
        .status(200)
        .send({ error: false, message: "Se ha registrado el componente" });
    } else {
      return res.status(400).send({
        error: true,
        message: "Error al registrar el componente de blog",
      });
    }
  } catch (e) {
    return res.status(400).send({
      error: true,
      message: "Error al registrar el componente de blog",
    });
  }
}

async function add_elemento_blog(req, res) {
  let titulo = req.body.titulo;
  let fecha = req.body.fecha;
  let fichero = req.files;
  let id_componente = req.body.id_componente;
  let descripcion = req.body.descripcion;

  try {
    let bAdministrador = await usuario.esAdministrador(req.session.nombre);
    if (bAdministrador) {
      await componente_blog.add_componente_blog(
        id_componente,
        titulo,
        fecha,
        fichero,
        descripcion
      );
      return res.status(200).send({ error: false, message: "Elemento creado" });
    } else {
      return res.status(400).send({
        error: true,
        message: "Error al registrar el componente de blog",
      });
    }
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: "Error al registrar el componente de blog",
    });
  }
}

async function obtener_componente_blog(req, res) {
  let id_componente = req.params.id_componente;
  try {
    let resultado = await componente_blog.obtener_componente_blog(
      id_componente
    );
    return res.status(200).send({ error: false, componente_blog: resultado });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ error: true, message: "Error al obtener el componente" });
  }
}

async function eliminar_elemento_blog(req, res) {
  let bEsAdministrador = await usuario.esAdministrador(req.session.nombre);
  if (bEsAdministrador) {
    let id_componente = req.body.id_componente;
    let id_imagen = req.body.id_imagen;
    let id_menu = req.body.id_menu;
    try {
      await componente_blog.eliminar_elemento_blog(
        id_componente,
        id_imagen,
        id_menu
      );
      return res
        .status(200)
        .send({ error: false, message: "Elemento eliminado" });
    } catch (e) {
      console.log("Error al eliminar el elemento");
      return res.status(400).send({
        error: true,
        message: "Error al eliminar el elemento",
        info: e,
      });
    }
  } else {
    return res.status(400).send({
      error: true,
      message: "Error al eliminar el elemento",
      info: "Usuario no autorizado",
    });
  }
}

module.exports.registrar_componente_blog = registrar_componente_blog;
module.exports.add_elemento_blog = add_elemento_blog;
module.exports.obtener_componente_blog = obtener_componente_blog;
module.exports.eliminar_elemento_blog = eliminar_elemento_blog;
