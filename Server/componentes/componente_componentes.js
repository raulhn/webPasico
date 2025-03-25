const constantes = require('../constantes.js')
const conexion = require('../conexion.js')
const componente = require('./componente.js')

function registrarCComponentes (nidComponente, nColumnas) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.tabla_componentes(nid, nColumnas) values(' +
                conexion.dbConn.escape(nidComponente) + ', ' + conexion.dbConn.escape(nColumnas) + ')',

      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al reegistrar componente de componentes')) } else { resolve() }
      }
      )
    }
  )
}

function insertarComponenteComponentesOrden (id, nColumnas, tipoAsociacion, nOrden) {
  console.log('componente_componentes->insertar_componente_componentes-> entra')
  return new Promise(
    (resolve, reject) => {
      console.log('componente_componentes->insertar_componente_componentes-> id_pagina ' + id)
      componente.registrarComponenteComun(constantes.TIPO_COMPONENTE_COMPONENTES, id, tipoAsociacion, nOrden).then(
        (nidComponente) => {
          console.log('componente_componentes->insertar_componente_componentes-> ' + nidComponente)
          registrarCComponentes(nidComponente, nColumnas).then(
            () => { conexion.dbConn.commit(); resolve() })
        }).catch(
        () => {
          conexion.dbConn.rollback(); reject(new Error('Error al insertar componente de componentes'))
        }
      )
    }
  )
}

function insertarComponenteComponentes (id, nColumnas, tipoAsociacion) {
  return new Promise(
    (resolve, reject) => {
      componente.obtenerUltimoOrden(id).then(
        (maxOrden) => {
          insertarComponenteComponentesOrden(id, nColumnas, tipoAsociacion, maxOrden).then(
            () => { conexion.dbConn.commit(); resolve() }
          ).catch(
            () => { conexion.dbConn.rollback(); reject(new Error('Error al insertar Componente de Componentes')) }
          )
        })
    }

  )
}

function obtieneNumComponentes (idComponente) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select count(*) num_componentes from ' + constantes.ESQUEMA_BD + '.componente_componentes where nid_componente = ' +
                conexion.dbConn.escape(idComponente),
      (error, results, fields) => {
        if (error) { console.log('componente_componentes->obtiene_num_componentes ' + error); reject(new Error('Error al obtener el número de componentes')) } else { resolve(results[0].num_componentes) }
      }
      )
    }
  )
}

function obtieneNumComponentesDefinidos (idComponente) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select nColumnas from ' + constantes.ESQUEMA_BD + '.tabla_componentes where nid = ' +
                conexion.dbConn.escape(idComponente),
      (error, results, fields) => {
        if (error) {
          console.log('componente_componentes->obtiene_num_componentes ' + error)
          reject(new Error('Error al obtener el número de componentes definidos'))
        } else if (results.length < 1) { reject(new Error('Error al obtener el número de componentes definidos')) } else { resolve(results[0].nColumnas) }
      }
      )
    }
  )
}

function existeComponenteComponentes (idComponente, nOrden) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select count(*) nExiste from ' + constantes.ESQUEMA_BD + '.componente_componentes where nid_componente = ' +
                conexion.dbConn.escape(idComponente) + ' and nOrden = ' + conexion.dbConn.escape(nOrden),
      (error, results, fields) => {
        if (error) { console.log('componente_componentes->existe_componente_componentes ' + error); reject(new Error('Error al comprobar si existe componente')) } else {
          if (results[0].nExiste === 0) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
      })
    }

  )
}

function obtieneComponenteComponentes (idComponente, nOrden) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.componente_componentes where nid_componente = ' +
            conexion.dbConn.escape(idComponente) + ' and nOrden = ' + conexion.dbConn.escape(nOrden),
      (error, results, fields) => {
        if (error) { console.log('componente_componentes->obtiene_componente_componentes ' + error); reject(new Error('Error al obtener componente de componentes')) }
        if (results.length < 1) { reject(new Error('Error al obtener el componente de componentes')) } else resolve(results[0])
      })
    }

  )
}

function eliminarTablaComponentes (idComponente) {
  return new Promise(
    (resolve, reject) => {
      console.log('Eliminar tabla --------' + idComponente)
      conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.tabla_componentes where nid = ' + conexion.dbConn.escape(idComponente),
        (error, results, fields) => {
          if (error) { console.log(error); reject(new Error('Error al eliminar tabla de componentes')) } else { console.log('Eliminado de tabla componentes'); resolve() }
        })
    }
  )
}

function eliminarComponenteComponentes (idPagina, idComponente) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          console.log('eliminar_componente_componentes')
          obtieneNumComponentes(idComponente).then(
            (numComponentes) => {
              console.log('Num componentes ' + numComponentes)
              if (numComponentes === 0) {
                eliminarTablaComponentes(idComponente).then(
                  () => {
                    componente.eliminarPaginaComponente(idPagina, idComponente).then(
                      () => { console.log('Eliminado ---------------'); conexion.dbConn.commit(); resolve() }
                    )
                      .catch(
                        () => { conexion.dbConn.rollback(); reject(new Error('Error al eliminar componente de componentes')) }
                      )
                  }
                )
                  .catch(
                    () => { conexion.dbConn.rollback(); reject(new Error('Error al eliminar componente de componentes')) }
                  )
              } else {
                conexion.dbConn.rollback()
                reject(new Error('Error al eliminar componente de componentes'))
              }
            }
          )
        }
      )
    }
  )
}

module.exports.insertarComponenteComponentes = insertarComponenteComponentes
module.exports.obtieneNumComponentes = obtieneNumComponentes
module.exports.obtieneNumComponentesDefinidos = obtieneNumComponentesDefinidos

module.exports.existeComponenteComponentes = existeComponenteComponentes
module.exports.obtieneComponenteComponentes = obtieneComponenteComponentes

module.exports.eliminarComponenteComponentes = eliminarComponenteComponentes
