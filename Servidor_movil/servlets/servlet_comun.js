const jwt = require("jsonwebtoken");
const gestorUsuarios = require("../logica/usuario.js");

function comprobacionLogin(req, res) {
  const token = req.cookies.access_token;
  if (!token) {
    return res
      .status(401)
      .send({ error: true, mensaje: "No autenticado", codigo: 1 });
  }

  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.error("El token ha expirado:", err);
        return res
          .status(401)
          .send({ error: true, mensaje: "Token expirado", codigo: 1 });
      }
      console.error("Error al verificar el token:", err);
      return res
        .status(401)
        .send({ error: true, mensaje: "No autenticado", codigo: 2 });
    }
  });
}

function obtenerTokenDecoded(req, res) {
  return new Promise((resolve, reject) => {
    const token = req.cookies.access_token;
    if (!token) {
      reject({ error: true, mensaje: "No autenticado", codigo: 1 });
    }

    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("El token ha expirado:", err);
          reject({ error: true, mensaje: "Token expirado", codigo: 1 });
        }
        console.error("Error al verificar el token:", err);
        reject({ error: true, mensaje: "No autenticado", codigo: 2 });
      }
      resolve(decoded);
    });
  });
}

function comprobacionAccesoAPIKey(req, res, callback) {
  try {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      throw new Error("API Key no proporcionada");
    }

    if (apiKey !== process.env.API_KEY_MOVIL) {
      throw new Error("API Key no válida");
    }

    callback();
  } catch (error) {
    console.error("Error en APIKEY :" + error);
    res.status(401).send({ error: true, mensaje: error.message });
  }
}

async function comprobarRol(req, res, rolesPermitidos) {
  const tokenDecode = await obtenerTokenDecoded(req, res);
  const nid_usuario = tokenDecode.nid_usuario;

  const roles = await gestorUsuarios.construirRoles(nid_usuario);

  const rolesAdministrador = roles.find((rol) =>
    rolesPermitidos.includes(rol.nombre)
  );

  return !rolesAdministrador || rolesAdministrador.length === 0;
}


module.exports.comprobacionLogin = comprobacionLogin;
module.exports.comprobacionAccesoAPIKey = comprobacionAccesoAPIKey;
module.exports.obtenerTokenDecoded = obtenerTokenDecoded;
module.exports.comprobarRol = comprobarRol;