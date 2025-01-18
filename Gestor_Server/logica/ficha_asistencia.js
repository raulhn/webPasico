const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function crear_ficha_asistencia(nombre, fecha, nid_asignatura, nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.ficha_asistencia(nombre, fecha, nid_asignatura, nid_profesor) values(' + 
                        conexion.dbConn.escape(nombre) + ', ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fecha) + ', \'\') , \'%Y-%m-%d\') ' + 
                          ', ' + conexion.dbConn.escape(nid_asignatura) + ', ' + conexion.dbConn.escape(nid_profesor) + ')',
                        (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject(error);}
                            else{conexion.dbConn.commit(); resolve(results.insertId)}
                        }
                    )
                }
            )
        }
    )
}


function obtener_fichas_asistencias(nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select concat(fa.nombre, \' - \', trim(to_char(fa.fecha, \'dd/mm/yyyy\')), \' - \' , a.descripcion) etiqueta, fa.nid_ficha_asistencia ' +
                                  ' from ' + constantes.ESQUEMA_BD + '.ficha_asistencia fa, ' + constantes.ESQUEMA_BD +'.asignatura a ' +
                                  ' where fa.nid_asignatura = a.nid and fa.nid_profesor = ' + conexion.dbConn.escape(nid_profesor) +
                                  ' order by fa.fecha desc',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error);}
                    else {resolve(results)}
                }
            )
        }
    )
}


function obtener_alumnos_ficha_seleccion(nid_ficha_asistencia, nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select concat(p.nombre, \' \', p.primer_apellido, \' \', p.segundo_apellido) etiqueta, p.nid ' +
                                 ' from ' + constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.ficha_asistencia fa, ' + constantes.ESQUEMA_BD + '.matricula m, ' +
                                      ' ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' + constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam ' +
                                 ' where fa.nid_profesor = pam.nid_profesor ' +
                                   ' and pam.nid_matricula_asignatura = ma.nid ' +
                                   ' and ma.nid_matricula = m.nid ' +
                                   ' and ma.nid_asignatura = fa.nid_asignatura ' +
                                   ' and m.nid_persona = p.nid ' +
                                   ' and fa.nid_ficha_asistencia = ' + conexion.dbConn.escape(nid_ficha_asistencia) +
                                   ' and fa.nid_profesor = ' + conexion.dbConn.escape(nid_profesor),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error)}
                    else {resolve(results)}
                }              
            )
        }
    )
}

module.exports.crear_ficha_asistencia = crear_ficha_asistencia;
module.exports.obtener_fichas_asistencias = obtener_fichas_asistencias;
module.exports.obtener_alumnos_ficha_seleccion = obtener_alumnos_ficha_seleccion