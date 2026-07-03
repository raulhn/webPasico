const conexion = require("../conexion.js");

function consulta(sql) {
  return new Promise((resolve, reject) => {
    try {
      conexion.dbConn.query(sql, (error, results) => {
        try {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports.consulta = consulta;
