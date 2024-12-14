const constantes = require('../constantes.js');
const conexion = require('../conexion.js');

function obtener_canciones()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".canciones_eu order by nid_cancion_eu",
                (error, results, fields) =>
                {
                    if (error) {console.log(error); reject();}
                    else {resolve(results);}
                }

            )
        }
    )
}

function obtener_votaciones()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select ce.nid_cancion_eu, ifnull(vce.votos, 0) votos" +
                                 " from pasico.canciones_eu ce " +
                                 " left join pasico.votacion_canciones_eu vce " +
                                 " on ce.nid_cancion_eu = vce.nid_cancion_eu " +
                                 " order by  ifnull(vce.votos, 0) desc ",
                (error, results, fields) =>
                {
                    if (error) {console.log(error); reject();}
                    else {resolve(results)}
                }
                                )
        }
    )
}

module.exports.obtener_canciones = obtener_canciones;
module.exports.obtener_votaciones = obtener_votaciones;