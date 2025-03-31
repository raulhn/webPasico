const componente = require("../componentes/componente.js");
const gestion_usuarios = require("../logica/usuario.js");

function obtener_paginas_componente(req, res) {
  let id_componente_paginas = req.params.id;
  componente
    .obtener_paginas_componente(id_componente_paginas)
    .then((resultados) => {
      return res
        .status(200)
        .send({ error: false, paginas: resultados, size: resultados.length });
    })
    .catch(() => {
      return res.status(400).send({ error: true });
    });
}

function add_pagina_componente(req, res) {
  gestion_usuarios
    .esAdministrador(req.session.nombre)
    .then((bEsAdministrador) => {
      if (bEsAdministrador) {
        let id_componente = req.body.id_componente;
        let titulo = req.body.titulo;
        let descripcion = req.body.descripcion;
        let padre = req.body.padre;

        componente
          .add_pagina_componente(id_componente, padre, titulo, descripcion)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Página insertada" });
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

function remove_pagina_componente(req, res) {
  gestion_usuarios
    .esAdministrador(req.session.nombre)
    .then((bEsAdministrador) => {
      if (bEsAdministrador) {
        let id_componente = req.body.id_componente;
        let id_pagina = req.body.id_pagina;
        console.log("id_pagina " + id_pagina);
        componente
          .remove_pagina_componente(id_componente, id_pagina)
          .then(() => {
            return res
              .status(200)
              .send({ error: false, message: "Página eliminada" });
          })
          .catch(() => {
            return res.status(400).send({ error: true });
          });
      }
    });
}
module.exports.obtener_paginas_componente = obtener_paginas_componente;
module.exports.add_pagina_componente = add_pagina_componente;
module.exports.remove_pagina_componente = remove_pagina_componente;
