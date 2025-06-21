const conexion = require("../conexion")
const constantes = require("../constantes")

function registrar_tipo_evento_musico(nid_evento_concierto, nid_tipo_musico)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    const instrunccionsql = "insert into " + constantes.ESQUEMA + 
                                ".tipo_evento_musico(nid_evento_concierto, nid_tipo_musico) " +
                                "values(" + conexion.dbConn.escape(nid_evento_concierto) + ", " +
                                conexion.dbConn.escape(nid_tipo_musico) + ")";
                    
                    conexion.dbConn.query(instrunccionsql,
                       (error, results, fields) =>
                        {
                            if(error)
                            {
                                console.log("tipo_evento_musico.js -> registrar_tipo_evento_musico: " + error);
                                conexion.dbConn.rollback();
                                reject("Se ha producio un error al asociar el tipo al evento");
                            }
                            else
                            {
                                conexion.dbConn.commit();
                                resolve();
                            }
                        } 
                    )
                }
            )
        }

    )
}

function obtener_tipos_evento(nid_evento_concierto)
{
    return new Promise(
        (resolve, reject) =>
        {
            const instruccionSql = "select ec.*, tm." +
                                "from " + constantes.ESQUEMA + ".evento_concierto ec, " + 
                                constantes.ESQUEMA + ".tipo_musico tm, " +
                                constantes.ESQUEMA + ".tipo_evento_musico tem " +
                                "where tm.nid_tipo_musico = tem.nid_tipo_musico " + 
                                    "and ec.nid_evento_concierto = tem.nid_evento_concierto " +
                                    "and tem.nid_evento_concierto = " + conexion.dbConn.escape(nid_evento_concierto);
            
            conexion.dbConn.query(instruccionSql,
                (error, results, fields) =>
                {
                    if(error)
                    {
                        console.log("tipo_evento_musico.js -> obtener_tipos_eventro: "+  error);
                        reject("Error al obtener los tipos de evento");
                    }
                    else
                    {
                        resolve(results);
                    }
                }
            )
        });
}

function eliminar_tipo_evento_musico(nid_evento_concierto, nid_tipo_musico)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    const instruccionSql = "delete from " + constantes.ESQUEMA + ".tipo_evento_musico  " +
                                           " where nid_evento_concierto = " + conexion.dbConn.escape(nid_evento_concierto) +
                                           "   and nid_tipo_musico = " + conexion.dbConn.escape(nid_tipo_musico);

                    conexion.dbConn.query(instruccionSql, 
                        (error, results, fields) =>
                        {
                            if(error)
                            {
                                console.log("tipo_evento_musico.js -> eliminar_tipo_evento_musico: " + error);
                                conexion.dbConn.rollback();
                                reject("Se ha producido un error al eliminar el tipo de evento");
                            }
                            else
                            {
                                conexion.dbConn.commit();
                                resolve();
                            }
                        }
                    )
                         
                }
            )
        }
    )
}

module.exports.registrar_tipo_evento_musico = registrar_tipo_evento_musico;
module.exports.obtener_tipos_evento = obtener_tipos_evento;
module.exports.eliminar_tipo_evento_musico = eliminar_tipo_evento_musico;