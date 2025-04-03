const Constantes = require("../constantes.js");

export function recuperarComponentes(nidPagina) {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO + "obtener_components/" + nidPagina, {
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

export function recuperarComponenteTexto(nidComponente) {
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
