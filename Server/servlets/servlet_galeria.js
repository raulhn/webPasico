const gestion_usuarios = require("../logica/usuario.js");
const componente_galeria = require("../componentes/componente_galeria.js");

function obtener_imagenes_galeria(req, res) {
  let id_componente_galeria = req.params.id;
  componente_galeria
    .obtiene_imagenes_galeria(id_componente_galeria)
    .then((data) => {
      return res.status(200).send({ error: false, imagenes: data });
    })
    .catch(() => {
      () => {
        return res.status(400).send({ error: true });
      };
    });
}

function add_imagen_galeria(req, res) {
  gestion_usuarios
    .esAdministrador(req.session.nombre)
    .then((bEsAdministrador) => {
      if (bEsAdministrador) {
        let id_componente = req.body.id_componente;
        let titulo = req.body.titulo;
        let fichero = req.files;

        componente_galeria
          .add_imagen_galeria(id_componente, titulo, fichero)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Imagen insertada" });
          })
          .catch(() => {
            return res.status(400).send({ error: true });
          });
      }
    })
    .catch(() => {
      return res.status(400).send({ error: true });
    });
}

function eliminar_galeria(req, res) {
  gestion_usuarios
    .esAdministrador(req.session.nombre)
    .then((bEsAdministrador) => {
      if (bEsAdministrador) {
        let id_componente = req.body.id_componente;
        let id_imagen = req.body.id_imagen;

        componente_galeria
          .eliminar_imagen_galeria(id_componente, id_imagen)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Imagen eliminada" });
          })
          .catch(() => {
            return res.status(400).send({ error: true });
          });
      }
    });
}

module.exports.obtener_imagenes_galeria = obtener_imagenes_galeria;
module.exports.add_imagen_galeria = add_imagen_galeria;
module.exports.eliminar_galeria = eliminar_galeria;
