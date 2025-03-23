let Constantes = require("../constantes.js");

function obtenerUltimasNoticias() {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO + "obtener_componente_blog/207", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.obtenerUltimasNoticias = obtenerUltimasNoticias;
