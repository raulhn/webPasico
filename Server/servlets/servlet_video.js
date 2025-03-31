const componente = require("../componentes/componente");

function obtener_url_video(req, res) {
  let id_componente = req.params.id;
  componente
    .obtiene_url_video(id_componente)
    .then((url_video) => {
      return res.status(200).send({ error: false, url_video: url_video });
    })
    .catch(() => {
      return res.status(400).send({ error: true });
    });
}

module.exports.obtener_url_video = obtener_url_video;
