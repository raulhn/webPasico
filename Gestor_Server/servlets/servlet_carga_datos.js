const servlet_comun = require("./servlet_comun.js");

function carga_fichero(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    let fichero = req.body.datos;
    console.log(req.datos);
    console.log(fichero);
    //    console.log(req)
    console.log(req.files);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(req.files.datos);
    console.log("---------------------A-----------------");
    console.log(req.files.datos.data.toString("utf-8"));
    const textoFichero = req.files.datos.data.toString("utf-8");
    const cadenas = textoFichero.split(/\r?\n/);
    console.log("Cadenas", cadenas);
    res.status(200).send({ error: false, message: "Fichero recibido" });
  });
}

module.exports.carga_fichero = carga_fichero;
