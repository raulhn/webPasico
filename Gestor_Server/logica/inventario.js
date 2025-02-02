const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function existe_inventario(nid_inventario)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num from ' + constantes.ESQUEMA_BD + '.inventario where nid_inventario = ' + conexion.dbConn.escape(nid_inventario),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error);}
                    else {resolve(results[0]['num'] > 0)}
                }
            )
        }
    )
}

function registrar_inventario(nid_inventario, descripcion, cantidad, modelo, num_serie, comentarios)
{
    return new Promise(
        async(resolve, reject) =>
        {
            bExiste_inventario = await existe_inventario(nid_inventario);

            if(bExiste_inventario)
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.inventario set descripcion = ' + conexion.dbConn.escape(descripcion) +
                                ', cantidad = ' + conexion.dbConn.escape(cantidad) + ', modelo = ' + conexion.dbConn.escape(modelo) + 
                                ', num_serie = ' + conexion.dbConn.escape(num_serie) + ', comentarios = ' + conexion.dbConn.escape(comentarios) +
                                ' where nid_inventario = ' + conexion.dbConn.escape(nid_inventario),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject(error);}
                                else {conexion.dbConn.commit(); resolve();}
                            }
                    )
                    }
                )
            }
            else
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.inventario(descripcion, cantidad, modelo, num_serie, comentarios) values(' +
                                conexion.dbConn.escape(descripcion) + ', ' + conexion.dbConn.escape(cantidad) + ', ' + conexion.dbConn.escape(modelo) +
                                ', ' + conexion.dbConn.escape(num_serie) + ', ' + conexion.dbConn.escape(comentarios) + ')',
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject(error)}
                                else {conexion.dbConn.commit(); resolve(results.insertId);}
                            }
                        )
                    }
                )
            }
        }
    )
}


function obtener_inventarios()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.inventario',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error);}
                    else {resolve(results)}
                }
            )
        }
    )
}


function obtener_inventario(nid_inventario)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.inventario where nid_inventariro = ' + conexion.dbConn.escape(nid_inventario),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error);}
                    else if(results.length() == 0)
                    {
                        let mensaje = 'No se ha encontrado el inventario';
                        console.log(mensaje);
                        reject(mensaje);
                    }
                    else
                    {
                        resolve(results[0])
                    }
                 })
        }
    )
}

module.exports.registrar_inventario = registrar_inventario;
module.exports.obtener_inventarios = obtener_inventarios;
module.exports.obtener_inventario = obtener_inventario;