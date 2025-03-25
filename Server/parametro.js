const conexion = require('./conexion.js')
const constantes = require('./constantes.js')

function obtieneParametro (identificador) {
  return new Promise(
    function (resolve, reject) {
      conexion.dbConn.query('select valor from ' + constantes.ESQUEMA_BD + '.parametros where identificador = ' + conexion.dbConn.escape(identificador),
        function (error, results, fields) {
          if (error) { console.log(error); reject(new Error('Error al recuperar el parámetro')) }
          if (results.lenfth < 1) {
            reject(new Error('Error al recuperar el parámetro'))
          }
          resolve(results[0])
        })
    }
  )
}

module.exports.obtieneParametro = obtieneParametro
