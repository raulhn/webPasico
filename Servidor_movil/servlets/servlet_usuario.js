const servletConexion = require("./servlet_conexiones.js");
const gestorUsuario = require("../logica/usuario.js");
const validacionEmail = require("../logica/validacionEmail.js");
const nodeMail = require("../logica/nodemail.js");

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
  const { correoElectronico, password } = req.body;

  try {
    const tokens = await gestorUsuario.realizarLogin(
      correoElectronico,
      password
    );

    res.cookie("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: true, // Asegúrate de que tu aplicación esté sirviendo a través de HTTPS
      sameSite: "Strict", // Cambia esto según tus necesidades
      maxAge: 60 * 60 * 1000 * 24, // 24 horas
    });

    res.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: true, // Asegúrate de que tu aplicación esté sirviendo a través de HTTPS
      sameSite: "Strict", // Cambia esto según tus necesidades
      path: "/refresh_token", // Asegúrate de que el token de actualización solo esté disponible en la ruta de actualización
      maxAge: 60 * 60 * 1000 * 24 * 7, // 7 días
    });

    res.status(200).send({
      error: false,
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id_usuario: tokens.usuario.id_usuario,
        correoElectronico: tokens.usuario.correoElectronico,
        nombre: tokens.usuario.nombre,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión");
    res.status(400).send({
      error: true,
      mensaje: error.message,
    });
  }
}

function obtenerUsuario(req, res) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send({ error: true, mensaje: "No autenticado" });
  }

  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error al verificar el token:", err);
      return res.status(401).send({ error: true, mensaje: "No autenticado" });
    }

    const usuario = {
      id_usuario: decoded.id_usuario,
      correoElectronico: decoded.correoElectronico,
      nombre: decoded.nombre,
    };
    res.status(200).send({ error: false, usuario: usuario });
  });
}

function refreshToken(req, res) {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.status(401).send({ error: true, mensaje: "No autenticado" });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Error al verificar el token:", err);
      return res.status(401).send({ error: true, mensaje: "No autenticado" });
    }

    const usuario = await gestorUsuario.obtenerUsuario(decoded.id_usuario);

    const nuevoToken = jwt.sign(
      {
        id_usuario: decoded.id_usuario,
        correoElectronico: usuario.correo_electronico,
        nombre:
          usuario.nombre +
          " " +
          usuario.primer_apellido +
          " " +
          usuario.segundo_apellido,
      },
      process.env.SESSION_SECRET,
      { expiresIn: 86400 } // 24 horas
    );

    res.cookie("access_token", nuevoToken, {
      httpOnly: true,
      secure: true, // Asegúrate de que tu aplicación esté sirviendo a través de HTTPS
      sameSite: "Strict", // Cambia esto según tus necesidades
      maxAge: 60 * 60 * 1000 * 24, // 24 horas
    });

    res.status(200).send({ error: false, mensaje: "Token actualizado" });
  });
}

function logout(req, res) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/refresh_token" });
  res.status(200).send({ error: false, mensaje: "Sesión cerrada" });
}

async function recuperarContraseña(req, res) {
  try {
    const { correoElectronico } = req.body;
    if (!correoElectronico) {
      return res
        .status(400)
        .send({ error: true, mensaje: "Correo no proporcionado" });
    }

    const nuevaContraseña =
      gestorUsuario.recuperarContraseña(correoElectronico);
    if (!nuevaContraseña) {
      return res
        .status(400)
        .send({ error: true, mensaje: "Error al recuperar" });
    }

    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: 0 auto; text-align: center;">
    <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 20px;">Recuperación de contraseña</h1>
    <p style="color: #333; font-size: 16px; line-height: 1.5;">
      Su nueva contraseña es: ${nuevaContraseña}
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
module.exports.recuperarContraseña = recuperarContraseña;
