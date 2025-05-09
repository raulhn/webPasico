const servletConexion = require("./servlet_conexiones.js");
const gestorConexion = require("../logica/gestorConexiones.js");
const gestorUsuario = require("../logica/usuario.js");
const validacionEmail = require("../logica/validacionEmail.js");
const nodeMail = require("../logica/nodemail.js");
const jwt = require("jsonwebtoken");
const constantes = require("../constantes.js");

const gestorPersona = require("../logica/persona.js");

async function registrarUsuario(req, res) {
  try {
    const {
      nombre,
      primerApellido,
      segundoApellido,
      correoElectronico,
      password,
      recaptchaToken,
    } = req.body;

    let bSuccess = await servletConexion.comprobarRecaptcha(recaptchaToken);
    if (!bSuccess) {
      res.status(400).send({ error: true, mensaje: "Error de Validación" });
    } else {
      await gestorUsuario
        .registrarUsuario(
          nombre,
          primerApellido,
          segundoApellido,
          correoElectronico,
          password
        )
        .then((resultado) => {
          res.status(200).send({
            error: false,
            mensaje: "Usuario registrado correctamente",
          });
        })
        .catch((error) => {
          console.error("Error al registrar el usuario:" + error.message);
          res.status(400).send({
            error: true,
            mensaje: error.message,
          });
        });
    }
  } catch (error) {
    console.error("Error en el registro del usuario:", error);
    res.status(400).send({
      error: true,
      mensaje: error.message,
    });
  }
}

async function verificarCorreo(req, res) {
  const token = req.params.token;
  if (!token) {
    res.status(400).send("Token no proporcionado");
    return;
  }

  let resultado = await validacionEmail.verificarEmail(token);
  const htmlCorrecto = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto; text-align: center;">
    <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 20px;">Correo verificado correctamente</h1>
    <p style="color: #333; font-size: 16px; line-height: 1.5;">
      Su correo ha sido verificado correctamente.
    </p>
  </div>
`;

  const htmlIncorrecto = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto; text-align: center;">
    <h1 style="color: #f44336; font-size: 24px; margin-bottom: 20px;">Error al verificar el correo</h1>
    <p style="color: #333; font-size: 16px; line-height: 1.5;">
      El token de verificación no es válido o ha expirado.
    </p>
  </div>`;

  if (resultado) {
    res.status(200).send(htmlCorrecto);
  } else {
    res.status(400).send(htmlIncorrecto);
  }
}

async function login(req, res) {
  const { correoElectronico, password, tokenNotificacion } = req.body;

  try {
    const tokens = await gestorUsuario.realizarLogin(
      correoElectronico,
      password
    );

    await gestorConexion.actualizarTokenUsuario(
      tokenNotificacion,
      tokens.usuario.nid_usuario
    );

    res.cookie(constantes.ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      secure: true, // Asegúrate de que tu aplicación esté sirviendo a través de HTTPS
      sameSite: "Strict", // Cambia esto según tus necesidades
      maxAge: constantes.TIEMPO_ACCESS_TOKEN * 1000, // 24 horas
    });

    res.status(200).send({
      error: false,
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        nid_usuario: tokens.usuario.nid_usuario,
        correoElectronico: tokens.usuario.correoElectronico,
        nombre: tokens.usuario.nombre,
      },
      refreshToken: tokens.refreshToken,
    });

    await gestorPersona.asociarUsuarioPersona(tokens.usuario.nid_usuario);
  } catch (error) {
    console.error("Error en el inicio de sesión");
    res.status(400).send({
      error: true,
      mensaje: error.message,
    });
  }
}

async function cambiarPassword(req, res) {
  const { passwordActual, nuevaPassword } = req.body;
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send({ error: true, mensaje: "No autenticado" });
  }

  jwt.verify(token, process.env.SESSION_SECRET, async (err, decoded) => {
    try {
      if (err) {
        console.error("Error al verificar el token:", err);
        return res.status(401).send({ error: true, mensaje: "No autenticado" });
      }

      await gestorUsuario.realizarCambioPassword(
        decoded.nid_usuario,
        passwordActual,
        nuevaPassword
      );
      res.status(200).send({
        error: false,
        mensaje: "Contraseña cambiada correctamente",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: true, mensaje: error.message });
    }
  });
}

function obtenerUsuario(req, res) {
  const token = req.cookies.access_token;
  if (!token) {
    return res
      .status(401)
      .send({ error: true, mensaje: "No autenticado", codigo: 1 });
  }

  jwt.verify(token, process.env.SESSION_SECRET, async (err, decoded) => {
    try {
      if (err) {
        console.error("Error al verificar el token:", err);
        return res
          .status(401)
          .send({ error: true, mensaje: "No autenticado", codigo: 2 });
      }

      console.log("Construyendo roles para el usuario:", decoded.nid_usuario);
      let roles = await gestorUsuario.construirRoles(decoded.nid_usuario);

      const usuario = {
        nid_usuario: decoded.nid_usuario,
        correoElectronico: decoded.correoElectronico,
        nombre: decoded.nombre,
      };
      res.status(200).send({ error: false, usuario: usuario, roles: roles });
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      res
        .status(400)
        .send({ error: true, mensaje: "Error al obtener el usuario" });
    }
  });
}

function refreshToken(req, res) {
  const token = req.body.refreshToken;
  if (!token) {
    console.log("No se proporcionó el token de actualización");
    return res.status(401).send({ error: true, mensaje: "No autenticado" });
  }

  jwt.verify(token, process.env.SESSION_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Error al verificar el token:", err);
      return res.status(401).send({ error: true, mensaje: "No autenticado" });
    }

    const usuario = await gestorUsuario.obtenerUsuario(decoded.nid_usuario);

    const nuevoToken = jwt.sign(
      {
        nid_usuario: decoded.nid_usuario,
        correoElectronico: usuario.correo_electronico,
        nombre:
          usuario.nombre +
          " " +
          usuario.primer_apellido +
          " " +
          usuario.segundo_apellido,
      },
      process.env.SESSION_SECRET,
      { expiresIn: constantes.TIEMPO_ACCESS_TOKEN }
    );

    res.cookie(constantes.ACCESS_TOKEN, nuevoToken, {
      httpOnly: true,
      secure: true, // Asegúrate de que tu aplicación esté sirviendo a través de HTTPS
      sameSite: "Strict", // Cambia esto según tus necesidades
      maxAge: constantes.TIEMPO_ACCESS_TOKEN * 1000,
    });

    res.status(200).send({ error: false, mensaje: "Token actualizado" });
  });
}

function logout(req, res) {
  res.clearCookie(constantes.ACCESS_TOKEN, { path: "/" });
  res.status(200).send({ error: false, mensaje: "Sesión cerrada" });
}

async function recuperarPassword(req, res) {
  try {
    const { correoElectronico } = req.body;
    if (!correoElectronico) {
      return res
        .status(400)
        .send({ error: true, mensaje: "Correo no proporcionado" });
    }

    const nuevaPassword =
      await gestorUsuario.recuperarPassword(correoElectronico);
    if (!nuevaPassword) {
      return res
        .status(200)
        .send({ error: false, mensaje: "Correo de recuperación enviado" });
    }

    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto; text-align: center;">
    <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 20px;">Recuperación de contraseña</h1>
    <p style="color: #333; font-size: 16px; line-height: 1.5;">
      Su nueva contraseña es: ${nuevaPassword}
    </p>
    <p style="color: #333; font-size: 16px; line-height: 1.5;">
      Por favor, cambie su contraseña después de iniciar sesión.
    </p>
  </div>`;

    const asunto = "Recuperación de contraseña";

    await nodeMail.enviarEmail(correoElectronico, asunto, html);

    res.status(200).send({
      error: false,
      mensaje: "Correo de recuperación enviado",
    });
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error);
    res.status(400).send({
      error: true,
      mensaje: "Error al recuperar la contraseña",
    });
  }
}

module.exports.registrarUsuario = registrarUsuario;
module.exports.verificarCorreo = verificarCorreo;
module.exports.login = login;
module.exports.obtenerUsuario = obtenerUsuario;
module.exports.refreshToken = refreshToken;
module.exports.logout = logout;
module.exports.recuperarPassword = recuperarPassword;
module.exports.cambiarPassword = cambiarPassword;
