const serviceComun = require("./serviceComun");
const constantes = require("../constantes");

function registrarCategoriaPartitura(categoriaPartitura, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "POST",
        constantes.URL_SERVICIO_MOVIL + "registrar_categoria_partitura",
        categoriaPartitura,
        cerrarSesion
      )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function actualizarCategoriaPartitura(categoriaPartitura, cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "POST",
        constantes.URL_SERVICIO_MOVIL + "actualizar_categoria_partitura",
        categoriaPartitura,
        cerrarSesion
      )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function obtenerCategoriasPartitura(cerrarSesion) {
  return new Promise((resolve, reject) => {
    serviceComun
      .peticionSesion(
        "GET",
        constantes.URL_SERVICIO_MOVIL + "obtener_categorias_partitura",
        null,
        cerrarSesion
      )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.registrarCategoriaPartitura = registrarCategoriaPartitura;
module.exports.actualizarCategoriaPartitura = actualizarCategoriaPartitura;
module.exports.obtenerCategoriasPartitura = obtenerCategoriasPartitura;
