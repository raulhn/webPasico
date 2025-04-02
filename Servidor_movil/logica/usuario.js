const conexion = require("../conexion.js");

function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correoElectronico
) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO usuario (nombre, primer_apellido, segundo_apellido, correo_electronico) VALUES (?, ?, ?, ?)";
    const values = [nombre, primerApellido, segundoApellido, correoElectronico];

    conexion.dbConn.query(query, (error, results) => {
      if (error) {
        console.error("Error al registrar el usuario:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports.registrarUsuario = registrarUsuario;
