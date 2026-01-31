import * as secureStorage from "./secureStorage.js";
import Constantes from "../config/constantes.js";

function peticionServicio(metodo, url, body) {
  return new Promise((resolve, reject) => {
    let parametros;
    if (metodo === "GET") {
      {
        parametros = {
          method: metodo,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        };
      }
    } else {
      parametros = {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      };
    }

    fetch(url, parametros)
      .then((response) => {
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function refrescarSesion() {
  console.log("Refrescando sesión...");
  const refreshToken = await secureStorage.obtenerToken("refresh_token");
  return new Promise((resolve, reject) => {
    if (!refreshToken) {
      reject(new Error("No hay refresh token disponible"));
    }

    fetch(Constantes.URL_SERVICIO_MOVIL + "refresh_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    })
      .then((response) => {
        response
          .json()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            console.log("Error en el servicio refrescarSesion");

            reject(error);
          });
      })
      .catch((error) => {
        console.log("Error en el fetch de refrescarSesion");

        reject(error);
      });
  });
}

async function peticionSesion(metodo, url, body, cerrarSesion) {
  try {
    let data = await peticionServicio(metodo, url, body);
    if (data.error && data.codigo === 1) {
      let response = await refrescarSesion();
      if (!response.error) {
        return await peticionServicio(metodo, url, body);
      } else {
        cerrarSesion(); // Llama a la función cerrarSesion del contexto

        throw new Error("Error al refrescar la sesión");
      }
    }
    return data;
  } catch (error) {
    console.log("Error en la petición de sesión", error);
    throw error; // Propaga el error para que pueda ser manejado por el llamador
  }
}

module.exports.peticionSesion = peticionSesion;
module.exports.peticionServicio = peticionServicio;
