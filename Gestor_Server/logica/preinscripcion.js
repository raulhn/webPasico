const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function obtener_preinscripciones()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn_web.query('select * from ' + constantes.ESQUEMA_BD_WEB + '.preinscripcion',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                });
        }
    )
}

module.exports.obtener_preinscripciones = obtener_preinscripciones;