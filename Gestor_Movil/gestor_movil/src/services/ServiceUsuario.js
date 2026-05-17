import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import * as ServiceComun from "./ServiceComun";

export function login(correoElectronico, password) {
  return new Promise((resolve, reject) => {
    fetch(URL_SERVICIO_MOVIL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correoElectronico: correoElectronico,
        password: password,
        loginWeb: true,
      }),
    }).then(async (response) => {
      console.log(response);
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

export function obtenerUsuario() {
  return new Promise((resolve, reject) => {
    ServiceComun.peticionServicio("GET", URL_SERVICIO_MOVIL + "usuario", {})
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log("Error en el servicio obtenerUsuario");
        reject(error);
      });
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    ServiceComun.peticionServicio("POST", URL_SERVICIO_MOVIL + "logout", {})
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log("Error en el servicio logout");
        reject(error);
      });
  });
}

export function cambiarPassword(passwordActual, nuevoPassword) {
  return new Promise((resolve, reject) => {
    ServiceComun.peticionServicio(
      "POST",
      URL_SERVICIO_MOVIL + "cambiar_password",
      {
        passwordActual: passwordActual,
        nuevaPassword: nuevoPassword,
      },
    )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log("Error en el servicio cambiarPassword");
        reject(error);
      });
  });
}

export function registrarUsuario(usuario, token_captcha) {
  return new Promise((resolve, reject) => {
    ServiceComun.peticionServicio(
      "PUT",
      URL_SERVICIO_MOVIL + "registrar_usuario",
      {
        nombre: usuario.nombre,
        primer_apellido: usuario.primer_apellido,
        segundo_apellido: usuario.segundo_apellido,
        correoElectronico: usuario.correoElectronico,
        password: usuario.password,
        recaptchaToken: token_captcha,
      },
    )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log("Error en el servicio cambiarPassword");
        reject(error);
      });
  });
}
