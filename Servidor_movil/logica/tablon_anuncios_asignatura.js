const constantes = require("../constantes");
const conexion = require("../conexion");

function insertarTablonAnuncioAsignatura(nidTablonAnuncio, nidAsignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            const sql = "insert into " + constantes.ESQUEMA + 
                        ".tablon_anuncios_asignatura(nid_tablon_anuncio, nid_asignatura) " +
                        "values(" + conexion.dbConn.escape(nidTablonAnuncio) + ", " +
                        "nullif(" + conexion.dbConn.escape(nidAsignatura) + ",''))";

            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query(sql,
                        (error, results, fields) =>
                        {
                            if(error)
                            {
                                console.log("tablon_anuncios_asignatura.js -> insertarTablonAnunciosAsignatura: ", error);
                                conexion.dbConn.rollback();
                                reject("Se ha producido un erro ral insetar el tablon anuncio en la asignatura");
                            }
                            else
                            {
                                conexion.dbConn.commit();
                                resolve(results.insertId);
                            }
                        }
                    )
                }
            )
        }
    )
}

function actualizarTablonAnuncioAsignatura(nidTablonAnuncioAsingatura, nidTablonAnuncio, nidAsignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            const sql = "update " + constantes.ESQUEMA + 
                        "tablon_anuncios_asignatura " +
                        "set nid_tablon_anuncio = " + conexion.dbConn.escape(nidTablonAnuncio) +
                        ", nid_asignatura = nullif(" + conexion.dbConn.escape(nidAsignatura) + ", '')" +
                        " where nid_tablon_anuncio_asignatura = " + conexion.dbConn.escape(nidTablonAnuncioAsingatura);

            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query(
                        sql,
                        (error, results, fields) =>
                        {
                            if(error)
                            {
                                console.log("tablon_anuncios_asignatura.js -> actualizarTablonAnuncioAsignatura: ", error);
                                conexion.dbConn.rollback();
                                reject("Se ha producido un error al actualizar el tablon asignatura");
                            }
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


function obtenerTablonAnuncioAsignatura(nidTablonAnuncioAsignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            const sql = "select * " 
                        " from " + constantes.ESQUEMA + ".tablon_anuncios_asignatura " 
                        " where nid_tablon_anuncio_asignatura = " + conexion.dbConn.escape(nidTablonAnuncioAsignatura);

            conexion.dbConn.query(sql,
                (error, results, fields) =>
                {
                    if(error)
                    {
                        console.log("tablon_anuncios_asignatura.js -> obtenerTablonAnuncioAsignatura: ", error);
                        reject("Se ha producido un error al recuperar el tablón asignatura");
                    }
                    else if( results.length == 0)
                    {
                        console.log("tablon_anuncios_asignatura.js -> obtenerTablonAnuncioAsignatura: No se ha encontrado el tablon asignatura");
                        reject("No se ha encontrado el tablon asignatura");
                    }
                    else
                    {
                        resolve(results[0]);
                    }
                }
            )
        }
    )
}


module.exports.insertarTablonAnuncioAsignatura = insertarTablonAnuncioAsignatura;
module.exports.actualizarTablonAnuncioAsignatura = actualizarTablonAnuncioAsignatura;
module.exports.obtenerTablonAnuncioAsignatura = obtenerTablonAnuncioAsignatura;