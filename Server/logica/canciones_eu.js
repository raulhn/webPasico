const constantes = require('../constantes.js')
const conexion = require('../conexion.js')

function obtenerCanciones () {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.canciones_eu order by nid_cancion_eu',
        (error, results, fields) => {
          if (error) { console.log(error); reject(new Error('Error al obtener las canciones')) } else { resolve(results) }
        }
      )
    }
  )
}

function obtenerVotaciones () {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select ce.nid_cancion_eu, ifnull(vce.votos, 0) votos' +
                ' from pasico.canciones_eu ce ' +
                ' left join pasico.votacion_canciones_eu vce ' +
                ' on ce.nid_cancion_eu = vce.nid_cancion_eu ' +
                ' order by  ifnull(vce.votos, 0) desc ',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las votaciones')) } else { resolve(results) }
      }
      )
    }
  )
}

module.exports.obtenerCanciones = obtenerCanciones
module.exports.obtenerVotaciones = obtenerVotaciones
