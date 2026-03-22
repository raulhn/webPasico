const servlet_comun = require("./servlet_comun.js");
const gestor_interfaz_registro = require("../logica/interfaz_registro.js");

function carga_fichero(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      let fichero = req.body.datos;

      const textoFichero = req.files.datos.data.toString("utf-8");
      const cadenas = textoFichero.split(/\r?\n/);
      const lote = await gestor_interfaz_registro.obtener_siguiente_lote();
      for (let i = 1; i < cadenas.length; i++) {
        await gestor_interfaz_registro.cargar_registro(cadenas[i], lote);
      }
      await gestor_interfaz_registro.cargar_datos_interfaz(lote);
      res
        .status(200)
        .send({ error: false, message: "Fichero cargado", lote: lote });
    } catch (error) {
      console.log(
        "serrvlet_carga_datos -> caga_fichero: Se ha producido un error al cargar el fichero",
      );
      res.status(400).send({
        error: true,
        message: "Se ha producido un error al cargar el fichero",
      });
    }
  });
}

module.exports.carga_fichero = carga_fichero;
