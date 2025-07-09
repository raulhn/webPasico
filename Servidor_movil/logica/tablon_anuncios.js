const constantes = require("../constantes");
const conexion = require("../conexion");

function insertarTablonAnuncio(
    titulo,
    descripcion,
    nidTipoTablon
)
{
    return new Promise((resolve, reject) =>
    {
        const sql = "insert into " + constantes.ESQUEMA + 
                    ".tablon_anuncios(titulo, descripcion, nid_tipo_tablon) " +
                    "values(" + conexion.dbConn.escape(titulo) +
                    ", " +
                    conexion.dbConn.escape(descripcion) +
                    ", " +
                    conexion.dbConn.escape(nidTipoTablon) +
                    ")";
        
        conexion.dbConn.beginTransaction(
            () =>
            {
                conexion.dbConn.query(sql,
                    (error, results, fields) =>
                    {
                        if(error)
                        {
                            console.log("tablon_anuncios.js -> insertarTablonAnuncio: ", error);
                            conexion.dbConn.rollback();
                            reject("Error al insertar el tablón de anuncios");
                        }
                        {
                            conexion.dbConn.commit();
                            resolve(results.insertId);
                        }
                    }
                )
            }
        )
    })
}

function actualizarTablonAnuncio(
    nidTablonAnuncio,
    titulo,
    descripcion,
    nidTipoTablon
)
{
    return new Promise(
        (resolve, reject) =>
        {
            const sql = "update " + constantes.ESQUEMA +
                        ".tablon_anuncios " +
                        "set titulo = " + conexion.dbConn.escape(titulo) +
                        ", descripcion = " + conexion.dbConn.escape(descripcion) +
                        ", nidTipoTablon = " + conexion.dbConn.escape(nidTipoTablon) +
                        " where nid_tablon_anuncio = " + conexion.dbConn.escape(nidTablonAnuncio); 
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query(
                        sql,
                         (error, results, fields) =>
                        {
                            if(error)
                            {
                                console.log("tablon_anuncios.js -> actualizarTablonAnuncio: ", error);
                                conexion.dbConn.rollback();
                                reject("Se ha producido un error al actualizar el tabón");
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

function obtenerTablonAnuncio(nidTablonAnuncio)
{
    return new Promise(
        (resolve, reject) =>
        {
            const sql = "select * from " + constantes.ESQUEMA +
                        ".tablon_anuncios " +
                        "where nid_tablon_anuncio = " + conexion.dbConn.escape(nidTablonAnuncio);

            conexion.dbConn.query(sql,
                (error, results, fields) =>
                {
                    if(error)
                    {
                        console.log("tablon_anuncios.js -> obtenerTabonAnuncio: ", error);
                        reject("Se ha producido un error al recuperar el tablón");
                    }
                    else if(results.length == 0)
                    {
                        reject("No se ha encontrado el tablón")
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

function obtenerTablonesAnuncio()
{
    return new Promise(
        (resolve, reject) =>
        {
            const sql = "select * from " + constantes.ESQUEMA + 
                        ".tablon_anuncios ";

            conexion.dbConn.query(sql,
                (error, results, fields) =>
                {
                    if(error)
                    {
                        console.log("tablon_anuncios.js -> obtenerTablonesAnuncion: ", error);
                        reject("Se ha producido un error al recuperar los tablones");
                    }
                    else
                    {
                        resolve(results);
                    }
                }
            )
        }
    )
}

function obtenerTablonesAnuncioTipo(nidTipoTablon)
{
    return new Promise(
        (resolve, reject) =>
        {
            const sql = "select * from " + constantes.ESQUEMA +
                        ".tablon_anuncios " +
                        "where nid_tipo_tablon = " + conexion.dbConn.escape(nidTipoTablon);

            conexion.dbConn.query(sql, 
                (error, results, fields) =>
                {
                    if(error)
                    {
                        console.log("tablon_anuncios.js -> obtenerTablonesAnuncioTipo: ", error);
                        reject("Se ha producido un error al recuperar los tablones por tipo");
                    }
                    else
                    {
                        resolve(results)
                    }
                }
            )
        }
    )
}

module.exports.insertarTablonAnuncio = insertarTablonAnuncio;
module.exports.actualizarTablonAnuncio = actualizarTablonAnuncio;
module.exports.obtenerTablonAnuncio = obtenerTablonAnuncio;
module.exports.obtenerTablonesAnuncio = obtenerTablonesAnuncio;
module.exports.obtenerTablonesAnuncioTipo = obtenerTablonesAnuncioTipo;