import Constantes from "../config/constantes.js";

function recuperarComponentes(nidPagina) {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO + "obtener_componentes/" + nidPagina, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) =>
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
      )
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
      .then((response) =>
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
      )
      .catch((error) => {
        reject(error);
      });
  });
}

function recuperarComponenteCard(nidComponente) {
  return new Promise((resolve, reject) => {
    fetch(
      Constantes.URL_SERVICIO + "obtener_componente_card/" + nidComponente,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) =>
        response
          .json()
          .then((data) => {
            if (data.error) {
              console.log(
                "Se ha producido un error al recuperar el componente card:"
              );
              reject("Error al recuperar el componente card");
              return;
            }
            resolve(data.componente);
          })
          .catch((error) => {
            reject(error);
          })
      )
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
      .then((response) =>
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
      )
      .catch((error) => {
        reject(error);
      });
  });
}

function recuperarComponenteComponentes(nidComponente) {
  return new Promise((resolve, reject) => {
    fetch(
      Constantes.URL_SERVICIO +
        "obtener_componente_componentes/" +
        nidComponente,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) =>
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
      )
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.recuperarComponentes = recuperarComponentes;
module.exports.recuperarComponenteTexto = recuperarComponenteTexto;
module.exports.recuperarComponenteCard = recuperarComponenteCard;
module.exports.recuperarImagenesGaleria = recuperarImagenesGaleria;
module.exports.recuperarComponenteComponentes = recuperarComponenteComponentes;
