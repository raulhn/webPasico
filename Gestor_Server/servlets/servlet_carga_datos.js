const servlet_comun = require("./servlet_comun.js");
const gestor_interfaz_registro = require("../logica/interfaz_registro.js");
const gestor_carga_interfaz_registro = require("../logica/carga_interfaz_registro.js");
import iconv from "iconv-lite";

function carga_fichero(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      //const textoFichero = req.files.datos.data.toString("utf-8");
      const textoFichero = iconv.decode(req.files.datos.data, "windows-1252");
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

function lanzar_proceso(req, res) {
  servlet_comun.comprobaciones(req, res, async () => {
    try {
      const lote = req.body.lote;
      await gestor_carga_interfaz_registro.cargar_personas(lote);
      res.status(200).send({ error: false, message: "Proceso lanzado" });
    } catch (error) {
      console.log(
        "serrvlet_carga_datos -> lanzar_proceso: Se ha producido un error al lanzar el proceso",
      );
      res.status(400).send({
        error: true,
        message: "Se ha producido un error al lanzar el proceso",
      });
    }
  });
}

module.exports.carga_fichero = carga_fichero;
module.exports.lanzar_proceso = lanzar_proceso;
