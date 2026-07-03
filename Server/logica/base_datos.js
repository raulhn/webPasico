const conexion = require("../conexion.js");

function consulta(sql) {
  return new Promise((resolve, reject) => {
    try {
      conexion.pool.query(sql, (error, results) => {
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

function actualiza(sql) {
  return new Promise((resolve, reject) => {
    try {
      conexion.pool.beginTransaction((error) => {
        try {
          if (error) {
            reject(error);
          } else {
            conexion.pool.query(sql, (error, results) => {
              try {
                if (error) {
                  conexion.pool.rollback();
                  reject(error);
                } else {
                  conexion.pool.commit((error) => {
                    if (error) {
                      conexion.pool.rollback();
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
    } catch (error) {
      reject(error);
    }
  });
}

module.exports.consulta = consulta;
module.exports.actualiza = actualiza;
