const conexion = require("../conexion.js");

function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correoElectronico
) {
  return new Promise((resolve, reject) => {
    conexion.dbConn.query(
      "INSERT INTO usuario (nombre, primer_apellido, segundo_apellido, correo_electronico) VALUES (",
      conexion.dbConn.escape(nombre) +
        "," +
        conexion.dbConn.escape(primerApellido) +
        "," +
        conexion.dbConn.escape(segundoApellido) +
        "," +
        conexion.dbConn.escape(correoElectronico) +
        ")",
      (error, results) => {
        if (error) {
          console.error("Error al registrar el usuario:", error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

module.exports.registrarUsuario = registrarUsuario;
