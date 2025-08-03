import Constantes from "../config/constantes.js";

function recuperarComponentes(nidPagina) {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO + "obtener_componentes/" + nidPagina, {
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

function recuperarComponenteTexto(nidComponente) {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO + "componente_texto/" + nidComponente, {
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

function recuperarImagenesGaleria(nidComponente) {
  return new Promise((resolve, reject) => {
    fetch(
      Constantes.URL_SERVICIO + "obtiene_imagenes_galeria/" + nidComponente,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.recuperarComponentes = recuperarComponentes;
module.exports.recuperarComponenteTexto = recuperarComponenteTexto;
module.exports.recuperarImagenesGaleria = recuperarImagenesGaleria;
