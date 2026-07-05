const conexion = require("../conexion.js");

function consulta(sql) {
  return new Promise((resolve, reject) => {
    try {
      conexion.pool.getConnection((error, connection) => {
        try {
          if (error) {
            reject(error);
          } else {
            connection.query(sql, (error, results) => {
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

function actualiza(sql) {
  return new Promise((resolve, reject) => {
    try {
      conexion.pool.getConnection((error, connection) => {
        try {
          if (error) {
            reject(error);
          } else {
            connection.beginTransaction((error) => {
              try {
                if (error) {
                  reject(error);
                } else {
                  connection.query(sql, (error, results) => {
                    try {
                      if (error) {
                        connection.rollback();
                        reject(error);
                      } else {
                        connection.commit((error) => {
                          if (error) {
                            connection.rollback();
                            reject(error);
                          }
                        });
                        resolve(results);
                      }
                    } catch (error) {
                      reject(error);
                    }
                  });
                }
              } catch (error) {
                reject(error);
              }
            });
          }
        } catch (error) {
          console.log("base_datos.js -> actualiza:", error);
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports.consulta = consulta;
module.exports.actualiza = actualiza;
