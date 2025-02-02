const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function obtener_cantidad_prestada(nid_inventario)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select sum(cantidad) cantidad_prestada' + 
                                 ' from ' + constantes.ESQUEMA_BD + '.prestamos ' +
                                 ' where nid_inventario = ' + conexion.dbConn.escape(nid_inventario) +
                                 '   and fecha_inicio <=  ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\')' +
                                        'and (fecha_fin is null or fecha_fin >= ' +'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\'))) ',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error)}
                    else {resolve(results['cantidad_prestada'])}
                }
            )
        }
    )
}


function comprueba_prestamo(nid_inventario, fecha_inicio, cantidad)
{
    return new Promise(
        async (resolve, reject) =>
        {
            let cantidad_prestada = await obtener_cantidad_prestada(nid_inventario);

            conexion.dbConn.query('select count(*) num' +
                ' from ' + constantes.ESQUEMA_BD + '.inventario i, ' +
                         + constantes.ESQUEMA_BD + '.prestamos p ' +
                ' where i.nid_inventario = p.nid_inventario ' +
                '   and not (fecha_inicio <=  ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\')' +
                               'and (fecha_fin is null or fecha_fin >= ' +'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\'))) ' +
                '   and i.cantidad - ' + conexion.dbConn.escape(cantidad_prestada) + ' >= ' + conexion.dbConn.escape(cantidad),
            (error, results, fields) =>
            {
                if(error)  {console.log(error); reject(error)}
                else {resolve(results[0][num] > 0)}
            } 
        )
        }
    )

}

function registrar_prestamo(nid_persona, nid_inventario, fecha_inicio, cantidad)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bComprueba_prestamo = await(comprueba_prestamo(nid_inventario, fecha_inicio, cantidad))

            if(bComprueba_prestamo)
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn('insert into ' + constantes.ESQUEMA_BD + '.prestamos(nid_persona, nid_inventario, fecha_inicio, cantidad) values(' +
                                conexion.dbConn.escape(nid_persona) + ', ' + conexion.dbConn.escape(nid_inventario) + ', ' + 
                                'str_to_date(nullif(' + conexion.dbConn.escape(fecha_inicio) + ', \'\') , \'%Y-%m-%d\'))) ' + ', ' +
                                conexion.dbConn.escape(cantidad),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(), reject(error)}
                                else {conexion.dbConn.commit(); resolve()}
                            }

                        )
                    }
                )
            }
        }
    )

}

module.exports.registrar_prestamo = registrar_prestamo;