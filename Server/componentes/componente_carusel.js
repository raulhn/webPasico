const constantes = require('../constantes.js')
const conexion = require('../conexion.js')
const componente = require('./componente.js')
const imagen = require('../imagen.js')

function obtenerElementosCarusel (idComponente) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.elemento_carusel where nid_componente = ' +
                                  conexion.dbConn.escape(idComponente) + ' order by nid_imagen desc',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener los elementos del carrusel')) } else { resolve(results) }
      }
      )
    }
  )
}

async function asyncObtenerComponenteCarusel (idComponente, resolve, reject) {
  const bExiste = await componente.existeComponente(idComponente)
  if (!bExiste) {
    reject()
  } else {
    conexion.dbConn.query('select nid_componente, elementos_simultaneos from ' + constantes.ESQUEMA_BD + '.componente_carusel where nid_componente = ' +
                               conexion.dbConn.escape(idComponente),
    (error, results, fields) => {
      if (error) { console.log('error'); console.log(error); reject(new Error('Error al obtener el componente de Carrusel')) } else { console.log('resolve'); resolve(results) }
    }
    )
  }
}

function obtenerComponenteCarusel (idComponente) {
  return new Promise(
    (resolve, reject) => {
      asyncObtenerComponenteCarusel(idComponente, resolve, reject)
    }
  )
}

function addElementoCarusel (nidComponente, titulo, fichero) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        async () => {
          try {
            const nidImagen = await imagen.subirImagen(titulo, fichero)
            conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.elemento_carusel(nid_componente, nid_imagen) values (' +
                            conexion.dbConn.escape(nidComponente) + ', ' + conexion.dbConn.escape(nidImagen) + ')',
            (error, results, fields) => {
              if (error) { console.log('Error: ' + error); reject(new Error('Error al añadir nuevo elemento en el carrusel')) } else {
                conexion.dbConn.commit()
                resolve()
              }
            }
            )
          } catch (e) {
            console.log(e)
            reject(new Error('Error al añadir nuevo elemento en el carrusel'))
          }
        }
      )
    }
  )
}

function actualizaElementosSimultaneos (nidComponente, elementosSimultaneos) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.componente_carusel set elementos_simultaneos = ' +
                            conexion.dbConn.escape(elementosSimultaneos) + ' where nid_componente = ' + conexion.dbConn.escape(nidComponente),
          (error, results, fields) => {
            if (error) { console.log(error); reject(new Error('Error al actualizar elementos simultaneos')) } else {
              resolve()
            }
          }
          )
        }
      )
    }
  )
}

function eliminarImagenCarusel (idComponente, idImagen) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.elemento_carusel where nid_componente = ' +
                            conexion.dbConn.escape(idComponente) + ' and nid_imagen = ' + conexion.dbConn.escape(idImagen),
          (error, results, fields) => {
            if (error) { console.log('Error ' + error); conexion.dbConn.rollback(); reject(new Error('Error al eliminar una imagen del carrusel')) } else {
              conexion.dbConn.commit()
              console.log('Elemento eliminado')
              resolve()
            }
          }
          )
        }
      )
    }
  )
}

module.exports.obtenerElementosCarusel = obtenerElementosCarusel
module.exports.obtenerComponenteCarusel = obtenerComponenteCarusel
module.exports.addElementoCarusel = addElementoCarusel
module.exports.actualizaElementosSimultaneos = actualizaElementosSimultaneos
module.exports.eliminarImagenCarusel = eliminarImagenCarusel
