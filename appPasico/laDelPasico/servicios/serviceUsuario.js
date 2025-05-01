let Constantes = require("../constantes.js");
let servicioComun = require("./serviceComun.js");
import * as secureStorage from "./secureStorage.js";

function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correo,
  password,
  recaptchaToken
) {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO_MOVIL + "registrar_usuario", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        primerApellido: primerApellido,
        segundoApellido: segundoApellido,
        correoElectronico: correo,
        password: password,
        recaptchaToken: recaptchaToken,
      }),
    }).then((response) => {
      response
        .json()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio registrarUsuario");
          reject(error);
        });
    });
  });
}

function login(correoElectronico, password, tokenNotificacion) {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO_MOVIL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correoElectronico: correoElectronico,
        password: password,
        tokenNotificacion: tokenNotificacion,
      }),
    }).then(async (response) => {
      response
        .json()
        .then((data) => {
          secureStorage.guardarToken("refresh_token", data.refreshToken);
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio login");
          reject(error);
        });
    });
  });
}

function obtenerUsuario(cerrarSesion) {
  return new Promise((resolve, reject) => {
    try {
      let data = servicioComun.peticionSesion(
        "GET",
        Constantes.URL_SERVICIO_MOVIL + "usuario",
        null,
        cerrarSesion
      );
      resolve(data);
    } catch (error) {
      console.log("Error en el servicio obtenerUsuario", error);
      reject(error);
    }
  });
}

function logout() {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO_MOVIL + "logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response
        .json()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio logout");
          reject(error);
        });
    });
  });
}

function cambiarPassword(passwordActual, nuevaPassword, cerrarSesion) {
  return new Promise((resolve, reject) => {
    try {
      let data = servicioComun.peticionSesion(
        "POST",
        Constantes.URL_SERVICIO_MOVIL + "cambiar_password",
        {
          passwordActual: passwordActual,
          nuevaPassword: nuevaPassword,
        },
        cerrarSesion
      );

      resolve(data);
    } catch (error) {
      console.log("Error en el servicio cambiarPassword", error);
      reject(error);
    }
  });
}

function recuperarPassword(correoElectronico) {
  return new Promise((resolve, reject) => {
    fetch(Constantes.URL_SERVICIO_MOVIL + "recuperar_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correoElectronico: correoElectronico,
      }),
    }).then((response) => {
      response
        .json()
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.log("Error en el servicio recuperarPassword");
          reject(error);
        });
    });
  });
}

module.exports.registrarUsuario = registrarUsuario;
module.exports.login = login;
module.exports.obtenerUsuario = obtenerUsuario;
module.exports.logout = logout;
module.exports.cambiarPassword = cambiarPassword;
module.exports.recuperarPassword = recuperarPassword;
