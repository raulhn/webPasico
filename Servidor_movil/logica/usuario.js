const conexion = require("../conexion.js");

function registrarUsuario(
  nombre,
  primerApellido,
  segundoApellido,
  correoElectronico,
  password
) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      const query =
        "INSERT INTO usuario (nombre, primer_apellido, segundo_apellido, correo_electronico, password) VALUES (trim(?), trim(?), trim(?), ?)";
      const values = [
        nombre,
        primerApellido,
        segundoApellido,
        correoElectronico,
        password,
      ];

      conexion.dbConn.query(query, (error, results) => {
        if (error) {
          console.error("Error al registrar el usuario:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}

module.exports.registrarUsuario = registrarUsuario;
