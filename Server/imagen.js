const constantes = require('./constantes.js')
const conexion = require('./conexion.js')
const gestionFicheros = require('./gestion_ficheros.js')

function obtieneIdImagen (idComponenteImagen) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query(
        'select nid_imagen from ' + constantes.ESQUEMA_BD + '.componente_imagen where nid_componente = ' + conexion.dbConn.escape(idComponenteImagen),
        (error, results, fields) => {
          if (error) resolve('-1')
          else if (results.length < 1) resolve('-1')
          else resolve(results[0].nid_imagen)
        }
      )
    }
  )
}

function obtieneRutaImagen (idImagen) {
  return new Promise(
    (resolve, reject) => {
      console.log(idImagen)
      conexion.dbConn.query(
        'select ruta_servidor from ' + constantes.ESQUEMA_BD + '.imagen where nid = ' + conexion.dbConn.escape(idImagen),
        (error, results, fields) => {
          console.log(results)
          if (error) { resolve(constantes.IMAGEN_NO_ENCONTRADA) } else if (results.length < 1) { resolve(constantes.IMAGEN_NO_ENCONTRADA) } else if (results[0].ruta_servidor == null) { resolve(constantes.IMAGEN_NO_ENCONTRADA) } else resolve(results[0].ruta_servidor)
        }
      )
    }
  )
}

function eliminarImagen (idImagen) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + 'imagen where nid = ' + conexion.dbConn.escape(idImagen),
            (error, results, fields) => {
              if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al eliminar la imagen')) } else {
                conexion.dbConn.commit(); resolve()
              }
            }
          )
        }

      )
    }

  )
}

function actualizarImagenServidor (idImagen, fichero) {
  return new Promise(
    (resolve, reject) => {
      console.log(fichero)
      const imagen = fichero.imagen

      const nombreImagen = idImagen + '_' + imagen.name

      console.log('Actualiza imagen ' + nombreImagen)
      conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.imagen set ruta_servidor = ' +
            conexion.dbConn.escape(constantes.RUTA_SUBIDAS + nombreImagen) + ' where nid = ' + conexion.dbConn.escape(idImagen),
      (error, results, field) => {
        if (error) { console.log(error); conexion.dbConn.rollback(); reject(error) } else {
          gestionFicheros.subirFicheros(fichero, nombreImagen).then(
            () => { conexion.dbConn.commit(); resolve() }
          ).catch(

            (error) => { console.log(error); conexion.dbConn.rollback(); reject(error) }
          )
        }
      })
    })
}

function actualizarImagen (idComponenteImagen, fichero) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          obtieneIdImagen(idComponenteImagen).then(
            (idImagen) => {
              actualizarImagenServidor(idImagen, fichero).then(
                () => { resolve() }
              ).catch(
                () => { reject(new Error('Error al actualizar la imagen')) }
              )
            }
          )
        }
      )
    }
  )
}

function subirImagen (titulo, fichero) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          console.log('registrar imagen')
          conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.imagen(titulo) values(' +
                        conexion.dbConn.escape(titulo) + ')',
          (error, results, fields) => {
            if (error) { console.log(error); reject(error) } else {
              const idImagen = results.insertId
              console.log('Subir imagen')
              console.log(fichero)
              actualizarImagenServidor(idImagen, fichero).then(
                () => { conexion.dbConn.commit(); resolve(idImagen) }
              ).catch(
                () => { conexion.dbConn.rollback(); reject(new Error('Error al subir la imagen')) }
              )
            }
          }
          )
        })
    }
  )
}

module.exports.actualizarImagen = actualizarImagen
module.exports.obtieneIdImagen = obtieneIdImagen
module.exports.obtieneRutaImagen = obtieneRutaImagen
module.exports.subirImagen = subirImagen
module.exports.eliminarImagen = eliminarImagen
