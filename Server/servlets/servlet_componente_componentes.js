const componente_componentes = require("../componentes/componente_componentes");
const componente = require("../componentes/componente");

function obtener_num_componente_componentes(req, res) {
  let id_componente = req.params.id;

  componente_componentes
    .obtiene_num_componentes(id_componente)
    .then((num_componentes) => {
      return res
        .status(200)
        .send({ error: false, num_componentes: num_componentes });
    })
    .catch(() => {
      return res.status(400).send({ error: true });
    });
}

function num_componente_componentes_definidos(req, res) {
  let id_componente = req.params.id;

  componente_componentes
    .obtiene_num_componentes_definidos(id_componente)
    .then((num_componentes) => {
      return res
        .status(200)
        .send({ error: false, num_componentes: num_componentes });
    })
    .catch(() => {
      return res.status(400).send({ error: true });
    });
}

function obtiene_componente_componentes(req, res) {
  let id_componente = req.params.id_componente;
  let nOrden = req.params.nOrden;

  componente_componentes
    .existe_componente_componentes(id_componente, nOrden)
    .then((bExiste) => {
      if (!bExiste) {
        return res.status(200).send({ error: false, existe: false });
      } else {
        componente_componentes
          .obtiene_componente_componentes(id_componente, nOrden)
          .then((resultado) => {
            componente
              .tipo_componente(resultado.nid_componente_hijo)
              .then((nTipo_componente) => {
                return res.status(200).send({
                  error: false,
                  existe: true,
                  data: resultado,
                  tipo_componente: nTipo_componente,
                });
              })
              .catch(() => {
                return res.status(400).send({ error: true });
              });
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

module.exports.obtener_num_componente_componentes =
  obtener_num_componente_componentes;

module.exports.num_componente_componentes_definidos =
  num_componente_componentes_definidos;
module.exports.obtiene_componente_componentes = obtiene_componente_componentes;
