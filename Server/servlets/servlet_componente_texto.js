const componente = require("../componentes/componente");
const servlet_usuarios = require("../servlets/servlet_usuarios");
const gestion_usuarios = require("../logica/usuario.js");

function componente_texto(req, res) {
  let id_componente = req.params.id;

  componente
    .obtiene_componente_texto(id_componente)
    .then(function (resultado) {
      return res.status(200).send({
        error: false,
        componente: resultado,
        message: "Componente de texto",
      });
    })
    .catch((error) => {
      return res
        .status(200)
        .send({ error: true, message: "No existe el componente" });
    });
}

function guardar_texto(req, res) {
  let texto_html = req.body.cTexto;
  let nid = req.body.nid;

  if (servlet_usuarios.esLogueado(req.session.nombre)) {
    let login_sesion = req.session.nombre;
    gestion_usuarios
      .esAdministrador(login_sesion)
      .then(function (bAdministrador) {
        if (bAdministrador) {
          componente
            .actualizar_texto(texto_html, nid)
            .then(function (bRetorno) {
              if (bRetorno) {
                return res
                  .status(200)
                  .send({ error: false, message: "Componente actualizado" });
              }
            })
            .catch(function () {
              console.log("Error guardar texto");
              return res.status(400).send({ error: true, message: "Error" });
            });
        } else {
          return res.status(400).send({ error: true, message: "Error" });
        }
      });
  }
}

module.exports.componente_texto = componente_texto;
module.exports.guardar_texto = guardar_texto;
