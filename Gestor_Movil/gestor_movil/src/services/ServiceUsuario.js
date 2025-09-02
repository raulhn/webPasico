import {URL_SERVICIO_MOVIL} from "../config/Constantes";

export function login(correoElectronico, password) {
  return new Promise((resolve, reject) => {
    fetch(URL_SERVICIO_MOVIL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correoElectronico: correoElectronico,
        password: password
      }),
    }).then(async (response) => {

        console.log(response)
      response
        .json()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio login");
          reject(error);
        });
    });
  });
}


