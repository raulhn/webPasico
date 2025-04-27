import { AuthProvider } from "../providers/AuthContext.js";
import { useContext } from "react";

let Constantes = require("../constantes.js");

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

function refrescarSesion() {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO_MOVIL + "refresh_token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((response) => {
      response
        .json()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio refrescarSesion");
          console.log(error);
          reject(error);
        });
    });
  });
}

async function peticionSesion(metodo, url, body, cerrarSesion) {
  try {
    let data = await peticionServicio(metodo, url, body);
    if (data.error && data.codigo === 1) {
      let response = await refrescarSesion();
      if (!response.Error) {
        return await peticionServicio(metodo, url, body);
      } else {
        console.log("Error al refrescar la sesión", response.Error);
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
