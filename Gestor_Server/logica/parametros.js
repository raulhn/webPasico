const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function obtener_valor(p_nombre)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select nombre, valor from ' + constantes.ESQUEMA_BD + '.parametros ' +
                    'where nombre = ' + conexion.dbConn.escape(p_nombre),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else{resolve(results[0])}
                }    
                    
            )
        }
    )
}

function actualizar_valor(p_nombre, p_valor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.parametros ' +
                        'set valor = ' + conexion.dbConn.escape(p_valor) +  ' where nombre = ' + conexion.dbConn.escape(p_nombre),
                        (error, reults, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else {conexion.dbConn.commit(); resolve();}
                        }
                    )
                }
            )
        }
    )
}


module.exports.obtener_valor = obtener_valor;
module.exports.actualizar_valor = actualizar_valor;