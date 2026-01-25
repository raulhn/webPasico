const servlet_comun = require("./servlet_comun.js");

function carga_fichero(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    let fichero = req.files.fichero;
    console.log(fichero);
    res.status(200).send({ error: false, message: "Fichero recibido" });
  });
}

module.exports.carga_fichero = carga_fichero;
