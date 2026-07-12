const conexion = require("../conexion.js");

function consulta(sql) {
  return new Promise((resolve, reject) => {
    try {
      conexion.bdPool.query(sql, (error, results) => {
        try {
          if (error) {
            console.log("base_datos.js -> actualiza:", error);
            reject(error);
          } else {
            resolve(results);
          }
        } catch (error) {
          console.log("base_datos.js -> actualiza:", error);
          reject(error);
        }
      });
    } catch (error) {
      console.log("base_datos.js -> actualiza:", error);
      reject(error);
    }
  });
}

function actualiza(sql) {
  return new Promise((resolve, reject) => {
    try {
      conexion.bdPool.getConnection((error, connection) => {
        try {
          if (error) {
            console.log("base_datos.js -> actualiza:", error);
            reject(error);
          } else {
            connection.beginTransaction((error) => {
              try {
                if (error) {
                  console.log("base_datos.js -> actualiza:", error);
                  reject(error);
                } else {
                  connection.query(sql, (error, results) => {
                    try {
                      if (error) {
                        connection.rollback();
                        console.log("base_datos.js -> actualiza:", error);
                        reject(error);
                      } else {
                        connection.commit((error) => {
                          if (error) {
                            connection.rollback();
                            console.log("base_datos.js -> actualiza:", error);
                            reject(error);
                          } else {
                            resolve(results);
                          }
                        });
                      }
                    } catch (error) {
                      console.log("base_datos.js -> actualiza:", error);
                      reject(error);
                    }
                  });
                }
              } catch (error) {
                console.log("base_datos.js -> actualiza:", error);
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
      console.log("base_datos.js -> actualiza:", error);
      reject(error);
    }
  });
}

module.exports.consulta = consulta;
module.exports.actualiza = actualiza;
