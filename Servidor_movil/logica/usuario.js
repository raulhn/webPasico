const conexion = require("../conexion.js");
const bcrypt = require("bcrypt");
const constantes = require("../constantes.js");
const validacionEmail = require("./validacionEmail.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const gestorSocios = require("./socios.js");
const gestorPersona = require("./persona.js");
const gestorMusicos = require("./musicos.js");
const gestorMatriculas = require("./matricula.js");
const gestorRoles = require("./roles.js");
const gestorProfesor = require("./profesores.js");
const gestor_base_datos = require("./base_datos.js");

async function existeUsuario(correoElectronico, borrado = "N") {
  try {
    const query =
      "select count(*) num from " +
      constantes.ESQUEMA +
      ".usuarios where correo_electronico = " +
      conexion.dbConn.escape(correoElectronico) +
      " and borrado = " +
      conexion.dbConn.escape(borrado);
    const results = await gestor_base_datos.consulta(query);
    return results[0].num > 0;
  } catch (error) {
    console.error("Error al comprobar la existencia del usuario:", error);
    return false;
  }
}

async function obtenerUsuarioCorreo(correoElectronico, borrado = "N") {
  try {
    const query =
      "select * from " +
      constantes.ESQUEMA +
      ".usuarios where correo_electronico = " +
      conexion.dbConn.escape(correoElectronico) +
      " and borrado = " +
      conexion.dbConn.escape(borrado);

    const results = await gestor_base_datos.consulta(query);
    if (results.length == 0) {
      return null;
    } else {
      return results[0];
    }
  } catch (error) {
    console.error("Error al obtener el usuario por correo:", error);
    return null;
  }
}

async function existeUsuarioNid(nid_usuario) {
  try {
    const query =
      "select count(*) num from " +
      constantes.ESQUEMA +
      ".usuarios where nid_usuario = " +
      conexion.dbConn.escape(nid_usuario) +
      " and borrado = 'N'";

    const results = await gestor_base_datos.consulta(query);
    return results[0].num > 0;
  } catch (error) {
    console.error("Error al comprobar la existencia del usuario:", error);
    return false;
  }
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const saltRounds = constantes.SALT_ROUNDS; // Número de rondas de sal para bcrypt
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error al hashear la contraseña:", err);
        reject(new Error("Error al hashear la contraseña"));
      } else {
        resolve(hash);
      }
    });
  });
}

async function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correoElectronico,
  password,
) {
  try {
    const saltRounds = constantes.SALT_ROUNDS; // Número de rondas de sal para bcrypt
    let bExiste = await existeUsuario(correoElectronico);
    if (bExiste) {
      console.error("El usuario ya está registrado.");
      throw new Error("El usuario ya está registrado.");
    }
    let bExisteEliminado = await existeUsuario(correoElectronico, "S");
    let nid_usuario_eliminado = null;
    if (bExisteEliminado) {
      const usuario_eliminado = await obtenerUsuarioCorreo(
        correoElectronico,
        "S",
      );
      if (usuario_eliminado) {
        nid_usuario_eliminado = usuario_eliminado.nid_usuario;
      }
    }
    const hash = await hashPassword(password);
    let query = "";
    if (bExisteEliminado) {
      query =
        "UPDATE " +
        constantes.ESQUEMA +
        ".usuarios SET nombre = trim(" +
        conexion.dbConn.escape(nombre) +
        "), primer_apellido = trim(" +
        conexion.dbConn.escape(primerApellido) +
        "), segundo_apellido = trim(" +
        conexion.dbConn.escape(segundoApellido) +
        "), password = trim(" +
        conexion.dbConn.escape(hash) +
        "), borrado = 'N', verificado = 'N', nid_persona = null WHERE correo_electronico = " +
        conexion.dbConn.escape(correoElectronico);
    } else {
      query =
        "INSERT INTO " +
        constantes.ESQUEMA +
        ".usuarios (nombre, primer_apellido, segundo_apellido, correo_electronico, password) " +
        "VALUES (trim(" +
        conexion.dbConn.escape(nombre) +
        "), trim(" +
        conexion.dbConn.escape(primerApellido) +
        "), trim(" +
        conexion.dbConn.escape(segundoApellido) +
        "), trim(" +
        conexion.dbConn.escape(correoElectronico) +
        "), trim(" +
        conexion.dbConn.escape(hash) +
        "))";
    }

    const results = await gestor_base_datos.actualiza(query);
    let nid_usuario_registrado;
    if (nid_usuario_eliminado) {
      nid_usuario_registrado = nid_usuario_eliminado;
    } else {
      nid_usuario_registrado = results.insertId;
    }
    await validacionEmail.enviarEmailValidacion(
      nid_usuario_registrado,
      correoElectronico,
    );
    return results;
  } catch (error) {
    console.error("Error en el registro del usuario:", error.message);
    throw new Error(error);
  }
}

async function permisosMusico(nid_persona) {
  try {
    let esMusico = await gestorMusicos.esMusico(nid_persona);
    if (esMusico) {
      return true;
    } else {
      //Compruebo si es padre de musico, no tengo en cuenta los hijos que ya son socios
      let esPadreMusico = await gestorMusicos.esPadreMusico(nid_persona, false);
      if (esPadreMusico) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(
      "usuario.js -> permisosMusico: Error al comprobar permisos de músico:",
      error.message,
    );
    throw new Error("Error al comprobar permisos de músico");
  }
}

async function permisosEscuela(nid_persona) {
  try {
    const bEsAlumno = await gestorMatriculas.esAlumno(nid_persona);

    if (bEsAlumno) {
      return true;
    } else {
      //Comprueba si la persona es padre de alumno sin tener en cuenta alumnos que sean socios

      const bEsPadreAlumno = await gestorMatriculas.esPadreAlumno(
        nid_persona,
        false,
      );
      if (bEsPadreAlumno) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(
      "usuario.js -> permisosEscuela: Error al comprobar permisos de escuela:",
      error,
    );
    throw new Error("Error al comprobar permisos de escuela");
  }
}

async function construirRoles(nid_usuario) {
  try {
    const rolesExistentes = await gestorRoles.obtenerRoles(nid_usuario);

    let roles = [];

    for (let i = 0; i < rolesExistentes.length; i++) {
      const rolRecuperado = rolesExistentes[i].nombre;
      roles.push({ rol: rolRecuperado });
    }

    const persona = await gestorPersona.obtenerPersonaUsuario(nid_usuario);

    if (!persona) {
      return roles; // Si no hay persona asociada, devuelve los roles existentes
    }
    // Rol Socio //
    let esSocio = await gestorSocios.esSocio(persona.nid_persona);
    if (esSocio) {
      roles.push({ rol: "SOCIO" });
    }

    // Rol Musico //
    let esMusico = await permisosMusico(persona.nid_persona);

    if (esMusico) {
      roles.push({ rol: "MUSICO" });
    }

    // Rol Alumno //
    const bEsAlumno = await permisosEscuela(persona.nid_persona);

    if (bEsAlumno) {
      roles.push({ rol: "ALUMNO" });
    }

    // Rol Profesor //
    const profesores = await gestorProfesor.obtenerProfesor(
      persona.nid_persona,
    );
    if (profesores.length > 0) {
      roles.push({ rol: "PROFESOR" });
    }

    return roles;
  } catch (error) {
    console.error("Error al construir los roles:", error.message);
    throw new Error("Error al construir los roles");
  }
}

async function obtenerUsuario(nid_usuario, borrado = "N") {
  try {
    const query =
      "SELECT nid_usuario, nombre, primer_apellido, segundo_apellido, correo_electronico, nid_persona FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario) +
      " and borrado = " +
      conexion.dbConn.escape(borrado);

    const results = await gestor_base_datos.consulta(query);
    if (results.length > 0) {
      return results[0];
    } else {
      console.error("El usuario no existe.");
      throw new Error("El usuario no existe.");
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw new Error("Error al obtener el usuario");
  }
}

async function obtenerUsuarioNoVerificado(correoElectronico) {
  try {
    const query =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE correo_electronico = " +
      conexion.dbConn.escape(correoElectronico) +
      " and verificado = 'N'  ";

    const results = await gestor_base_datos.consulta(query);
    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al comprobar la existencia del usuario:", error);
    throw new Error("Error al comprobar la existencia del usuario");
  }
}

async function reenviarCorreoVerificacion(correoElectronico, password) {
  try {
    const usuario = await login(correoElectronico, password);

    if (usuario == null) {
      const usuarioNoVerificado =
        await obtenerUsuarioNoVerificado(correoElectronico);

      if (usuarioNoVerificado) {
        let compara = await comparaPasswords(
          password,
          usuarioNoVerificado.password,
        );
        if (compara) {
          await validacionEmail.enviarEmailValidacion(
            usuarioNoVerificado.nid_usuario,
            correoElectronico,
          );
          return;
        }
      }
    }
    throw new Error("Error al reenviar el correo de verificación");
  } catch (error) {
    console.error(
      "Error al reenviar el correo de verificación:",
      error.message,
    );
    throw new Error("Error al reenviar el correo de verificación");
  }
}

function comparar_passwords(password, password2) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, password2, (err, result) => {
      if (err) {
        console.error("Error al comparar las contraseñas:", err);
        reject(new Error("Error al comparar las contraseñas"));
      } else {
        resolve(result);
      }
    });
  });
}

async function login(correoElectronico, password) {
  try {
    const query =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE correo_electronico = " +
      conexion.dbConn.escape(correoElectronico) +
      " and verificado = 'S' and borrado = 'N'";

    const results = await gestor_base_datos.consulta(query);
    if (results.length > 0) {
      const passwordMatch = await comparar_passwords(
        password,
        results[0].password,
      );
      if (!passwordMatch) {
        console.error("La contraseña es incorrecta.");
        throw new Error("Error al realizar el login");
      } else {
        return results[0];
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al comprobar la existencia del usuario:", error);
    throw new Error("Error al realizar el login");
  }
}

function comparaPasswords(password, password2) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, password2, (err, result) => {
      if (err) {
        resolve(false);
      } else {
        if (!result) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  });
}

async function realizarLogin(correoElectronico, password) {
  try {
    const usuario = await login(correoElectronico, password);

    if (usuario == null) {
      const usuarioNoVerificado =
        await obtenerUsuarioNoVerificado(correoElectronico);

      if (usuarioNoVerificado) {
        let compara = await comparaPasswords(
          password,
          usuarioNoVerificado.password,
        );
        if (compara) {
          // await validacionEmail.enviarEmailValidacion(
          //   usuarioNoVerificado.nid_usuario,
          //   correoElectronico,
          // );
          console.error("El usuario no está verificado.");
          return {
            usuario: null,
            error: 1,
            mensaje:
              "El usuario no está verificado. Se ha enviado un correo de verificación. Compruebe su bandeja de entrada y la bandeja de correo no deseado.",
          };
        }
        throw new Error("Error al realizar login");
      } else {
        console.error("Error al realizar login");
        throw new Error("Error al realizar login");
      }
    }
    const sesion = jwt.sign(
      {
        nid_usuario: usuario.nid_usuario,
        correoElectronico: usuario.correo_electronico,
        nombre:
          usuario.nombre +
          " " +
          usuario.primer_apellido +
          " " +
          usuario.segundo_apellido,
      },
      process.env.SESSION_SECRET,
      {
        expiresIn: constantes.TIEMPO_ACCESS_TOKEN,
      },
    );

    const refreshToken = jwt.sign(
      { nid_usuario: usuario.nid_usuario },
      process.env.SESSION_SECRET,
      {
        expiresIn: constantes.TIEMPO_REFRESH_TOKEN,
      },
    );

    return {
      error: 0,
      accessToken: sesion,
      refreshToken: refreshToken,
      usuario: {
        nid_usuario: usuario.nid_usuario,
        nombre: usuario.nombre,
        primer_apellido: usuario.primer_apellido,
        segundo_apellido: usuario.segundo_apellido,
        correoElectronico: usuario.correo_electronico,
      },
    };
  } catch (error) {
    console.error("Error en el inicio de sesión:", error.message);
    throw new Error(error.message);
  }
}

async function recuperarPassword(correoElectronico) {
  try {
    let obtenerUsuario = await existeUsuario(correoElectronico);
    if (!obtenerUsuario) {
      console.error("El usuario no existe.");
      // Si el usuario no existe no se debe mostrar un mensaje de error
      throw new Error("El usuario no existe.");
    } else {
      const token = crypto.randomBytes(6).toString("hex");

      const hash = hashPassword(token);
      const query =
        "UPDATE " +
        constantes.ESQUEMA +
        ".usuarios SET password = " +
        conexion.dbConn.escape(hash) +
        " WHERE correo_electronico = " +
        conexion.dbConn.escape(correoElectronico);

      const results = await gestor_base_datos.actualiza(query);
      return token;
    }
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error.message);
    throw new Error("Error al recuperar la contraseña");
  }
}

async function actualizarPassword(nid_usuario, password) {
  try {
    const hash = await hashPassword(password);
    const query =
      "UPDATE " +
      constantes.ESQUEMA +
      ".usuarios SET password = " +
      conexion.dbConn.escape(hash) +
      " WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario) +
      " and borrado = 'N'";

    const results = await gestor_base_datos.actualiza(query);
    return results;
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error.message);
    throw new Error("Error al actualizar la contraseña");
  }
}

async function realizarCambioPassword(
  nid_usuario,
  passwordActual,
  passwordNuevo,
) {
  try {
    const query =
      "SELECT * FROM " +
      constantes.ESQUEMA +
      ".usuarios WHERE nid_usuario = " +
      conexion.dbConn.escape(nid_usuario) +
      " and borrado = 'N'";

    const results = await gestor_base_datos.consulta(query);
    let compara = comparar_passwords(passwordActual, results[0].password);
    if (compara) {
      await actualizarPassword(nid_usuario, passwordNuevo);
    } else {
      throw new Error("La contraseña actual es incorrecta.");
    }
  } catch (error) {
    console.error("Error al realizar el cambio de contraseña:", error.message);
    throw new Error("Error al realizar el cambio de contraseña");
  }
}

async function obtenerUsuarios() {
  try {
    const query =
      "SELECT u.nid_usuario, u.nombre, u.primer_apellido, u.segundo_apellido, u.correo_electronico, c.token FROM " +
      constantes.ESQUEMA +
      ".usuarios u, " +
      constantes.ESQUEMA +
      ".conexiones c " +
      "WHERE u.nid_usuario = c.nid_usuario and borrado = 'N'";

    const results = await gestor_base_datos.consulta(query);
    return results;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw new Error("Error al obtener los usuarios");
  }
}

async function eliminar_usuario(nid_usuario) {
  try {
    const query =
      "update  " +
      constantes.ESQUEMA +
      ".usuarios set borrado = 'S' where nid_usuario = " +
      conexion.dbConn.escape(nid_usuario);

    const results = await gestor_base_datos.actualiza(query);
    return results;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw new Error("Error al eliminar el usuario");
  }
}

module.exports.existeUsuario = existeUsuario;
module.exports.existeUsuarioNid = existeUsuarioNid;
module.exports.registrarUsuario = registrarUsuario;
module.exports.reenviarCorreoVerificacion = reenviarCorreoVerificacion;
module.exports.realizarLogin = realizarLogin;
module.exports.construirRoles = construirRoles;
module.exports.obtenerUsuario = obtenerUsuario;
module.exports.recuperarPassword = recuperarPassword;
module.exports.realizarCambioPassword = realizarCambioPassword;
module.exports.obtenerUsuarios = obtenerUsuarios;

module.exports.permisosMusico = permisosMusico;
module.exports.permisosEscuela = permisosEscuela;
module.exports.eliminar_usuario = eliminar_usuario;
