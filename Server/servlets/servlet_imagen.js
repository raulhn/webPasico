const gestion_usuarios = require("../logica/usuario.js");
const imagen = require("../imagen.js");
const fs = require("fs");

function actualizar_imagen(req, res) {
  gestion_usuarios
    .esAdministrador(req.session.nombre)
    .then((bEsAdministrador) => {
      if (bEsAdministrador) {
        let ficheros = req.files;
        let id_componente_imagen = req.body.id_componente_imagen;

        imagen
          .actualizar_imagen(id_componente_imagen, ficheros)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Actualización correcta" });
          })
          .catch((error) => {
            return res.status(200).send({ error: true, message: error });
          });
      }
    });
}

function ruta_imagen(req, res) {
  let id_componente_imagen = req.params.id;
  imagen.obtiene_id_imagen(id_componente_imagen).then((id_imagen) => {
    imagen.obtiene_ruta_imagen(id_imagen).then((ruta_imagen) => {
      return res.status(200).send({ error: false, ruta: ruta_imagen });
    });
  });
}

function obtener_imagen(req, res) {
  let id_componente_imagen = req.params.id;
  imagen.obtiene_id_imagen(id_componente_imagen).then((id_imagen) => {
    imagen.obtiene_ruta_imagen(id_imagen).then((ruta_imagen) => {
      fs.readFile(ruta_imagen, (err, data) => {
        res.writeHead(200);
        res.write(data);

        return res.end();
      });
    });
  });
}

async function obtener_url_imagen(req, res) {
  let id_imagen = req.params.id;

  try {
    await imagen.obtiene_ruta_imagen(id_imagen).then((ruta_imagen) => {
      fs.readFile(ruta_imagen, (err, data) => {
        if (data === undefined) {
          return res.status(400).send({ error: true, message: "Error" });
        }
        res.writeHead(200);
        res.write(data);
        return res.end();
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: true, message: error });
  }
}

module.exports.actualizar_imagen = actualizar_imagen;
module.exports.ruta_imagen = ruta_imagen;
module.exports.obtener_imagen = obtener_imagen;
module.exports.obtener_url_imagen = obtener_url_imagen;
