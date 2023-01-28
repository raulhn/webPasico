const conexion = require('./conexion.js');
const constantes = require('./constantes.js');

function obtiene_parametro(identificador)
{
    return new Promise(function(resolve, reject)
    {
        conexion.dbConn.query("select valor from " + constantes.ESQUEMA_BD + ".parametros where identificador = " +  conexion.dbConn.escape(identificador) , 
        function(error, results, fields)
        {
            if(error)  {console.log(error); reject();}
            if (results.lenfth < 1)
            {
                reject();
            }
            resolve(results[0]);
        });
    }
    )
}

module.exports.obtiene_parametro = obtiene_parametro;