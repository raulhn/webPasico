const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function comprueba_prestamo (nid_inventario, fecha_inicio) {
  return new Promise(
    async (resolve, reject) => {
      conexion.dbConn.query('select count(*) num' +
                ' from ' + constantes.ESQUEMA_BD + '.inventario i, ' +
                          constantes.ESQUEMA_BD + '.prestamos p ' +
                ' where i.nid_inventario = p.nid_inventario ' +
                '   and i.nid_inventario = ' + conexion.dbConn.escape(nid_inventario) +
                '   and not (fecha_inicio <=  ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\')' +
                               'and (fecha_fin is null or fecha_fin >= ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\'))) ',
      (error, results, fields) => {
        if (error) { console.log(error); reject(error) } else { resolve(results[0].num == 0) }
      }
      )
    }
  )
}

function registrar_prestamo (nid_persona, nid_inventario, fecha_inicio) {
  return new Promise(
    async (resolve, reject) => {
      try {
        const disponible = await comprueba_prestamo(nid_inventario, fecha_inicio)

        if (disponible) {
          conexion.dbConn.beginTransaction(
            () => {
              conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.prestamos(nid_persona, nid_inventario, fecha_inicio) values(' +
                                    conexion.dbConn.escape(nid_persona) + ', ' + conexion.dbConn.escape(nid_inventario) + ', ' +
                                    'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\')) ',
              (error, results, fields) => {
                if (error) { console.log(error); conexion.dbConn.rollback(); reject(error) } else { conexion.dbConn.commit(); resolve(results.insertId) }
              }

              )
            }
          )
        } else {
          console.log('El instrumento no está disponible')
          reject('El instrumento no está disponible')
        }
      } catch (error) {
        console.log('prestamos.js - registrar_prestamo -> ' + error)
        reject('Error al registrar el prestamo')
      }
    }
  )
}

function actualizar_prestamo (nid_prestamo, nid_persona, nid_inventario, fecha_inicio, fecha_fin) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.prestamos set fecha_inicio = ' +
                    'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\') ' +
                    ', fecha_fin = ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fecha_fin) + ', \'\') , \'%Y-%m-%d\') ' +
                    ', nid_persona = ' + conexion.dbConn.escape(nid_persona) +
                    ', nid_inventario = ' + conexion.dbConn.escape(nid_inventario) +
                    ' where nid_prestamo = ' + conexion.dbConn.escape(nid_prestamo),
          (error, results, fields) => {
            if (error) {
              console.log(error)
              conexion.dbConn.rollback()
              reject('Error al actualizar el prestamo')
            } else {
              conexion.dbConn.commit()
              resolve()
            }
          }

          )
        }
      )
    }
  )
}

function obtener_prestamos () {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select concat(p.nombre, \' \', p.primer_apellido, \' \', p.segundo_apellido) etiqueta_persona, i.descripcion etiqueta_inventario, ' +
                           ' pr.nid_inventario, pr.nid_persona, pr.nid_prestamo, date_format(pr.fecha_fin, \'%Y-%m-%d\') fecha_fin, date_format(pr.fecha_inicio, \'%Y-%m-%d\') fecha_inicio ' +
                            ' from ' + constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.inventario i, ' + constantes.ESQUEMA_BD + '.prestamos pr' +
                            ' where p.nid = pr.nid_persona  ' +
                            '   and i.nid_inventario = pr.nid_inventario ' +
                            '   and pr.activo = \'S\'',
      (error, results, fields) => {
        if (error) {
          console.log(error)
          reject()
        } else { resolve(results) }
      }
      )
    }
  )
}

function obtener_prestamo (nid_prestamo) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select concat(p.nombre, \' \', p.primer_apellido, \' \', p.segundo_apellido) etiqueta_persona, i.descripcion etiqueta_inventario, ' +
                ' pr.nid_inventario, pr.nid_persona, pr.nid_prestamo, date_format(pr.fecha_fin, \'%Y-%m-%d\') fecha_fin, date_format(pr.fecha_inicio, \'%Y-%m-%d\') fecha_inicio ' +
                ' from ' + constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.inventario i, ' + constantes.ESQUEMA_BD + '.prestamos pr ' +
                ' where p.nid = pr.nid_persona  ' +
                '   and i.nid_inventario = pr.nid_inventario ' +
                '   and pr.nid_prestamo = ' + conexion.dbConn.escape(nid_prestamo) +
                '   and pr.activo = \'S\'',
      (error, results, fields) => {
        if (error) {
          console.log(error)
          reject()
        } else if (results.length < 1) {
          console.log('No se ha encontrado el prestamo')
          reject()
        } else { resolve(results[0]) }
      }
      )
    }
  )
}

function dar_baja_prestamo (nid_prestamo) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.prestamos set activo = \'N\' where nid_prestamo = ' + conexion.dbConn.escape(nid_prestamo),
            (error, results, fields) => {
              if (error) { console.log(error); conexion.dbConn.rollback(); reject('Error al eliminar el prestamo') } else { conexion.dbConn.commit(); resolve() }
            })
        }
      )
    }
  )
}

module.exports.registrar_prestamo = registrar_prestamo
module.exports.actualizar_prestamo = actualizar_prestamo
module.exports.obtener_prestamos = obtener_prestamos
module.exports.obtener_prestamo = obtener_prestamo
module.exports.dar_baja_prestamo = dar_baja_prestamo
