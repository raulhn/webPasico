const constantes = require("../constantes");
const conexion = require("../conexion");

function insertarTipoTablon(descripcion)
{
    return new Promise((resolve, reject) =>
    {
        const sql = "insert into " + constantes.ESQUEMA +
                    ".tipo_tablon(descripcion) values(" +
                    conexion.dbConn.escape(descripcion) + ")";
        
        conexion.dbConn.beginTransaction(
            () =>
            {
                conexion.dbConn.query(sql,
                    (error, results, fields) =>
                    {
                        if(error)
                        {
                            console.log("tipo_tablon.js -> insertarTipoTablon: " + error);
                            conexion.dbConn.rollback();
                            reject("Se ha producido un error al insertar el tipo de tablon");
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
    })
}

function actualizarTipoTablon(nidTipoTablon, descripcion)
{
    return new Promise((resolve, reject) =>
    {
        const sql = "update " + constantes.ESQUEMA + 
                    ".tipo_tablon set descripcion = " +
                    conexion.dbConn.escape(descripcion) +
                    " where nid_tipo_tablon = " +
                    conexion.dbConn.escape(nidTipoTablon);

        conexion.dbConn.beginTransaction(() =>
        {
            conexion.dbConn.query(sql, 
                (error, results, fields) =>
                {
                    if(error)
                    {
                        console.log("tipo_tablon.js -> actualizarTipoTablon: " + error);
                        conexion.dbConn.rollback();
                        reject("Se ha producido un error al actualizar el tipo de tablón");
                    }
                    else
                    {
                        conexion.dbConn.commit();
                        resolve();
                    }
                }
            )
        })
    })
}

function obtenerTipoTablon(nidTipoTablon)
{
    return new Promise((resolve, reject) =>
    {
        const sql = "select * from " + constantes.ESQUEMA +
                    ".tipo_tablon where nid_tipo_tablon " +
                    conexion.dbConn.escape(nidTipoTablon);

        conexion.dbConn.query(sql,
            (error, results, fields) =>
            {
                if(error)
                {
                    console.log("tipo_tablon.js -> obtenerTipoTablon: ", error);
                    reject("Se ha producido un error al recuperar el tipo de tablón")
                }
                else if(results.length == 0)
                {
                    console.log("No se ha encontrado el tipo de tablón")
                    reject("No se ha encontrado el tipo de tablón");
                }
                else
                {
                    resolve(results[0])
                }
            }
        )
    })
}

function obtenerTiposTablon()
{
    return new Promise((resolve, reject) =>
    {
        const sql = "select * from " + constantes.ESQUEMA + 
                    ".tipo_tablon";

        conexion.dbConn.query(sql,
            (error, results, fields) =>
            {
                if(error)
                {
                    console.log("tipo_tablon.js -> obtenerTiposTablon: ", error);
                    reject("Se ha producido un error al recuperar los tipos de tablon");
                }
                else
                {
                    resolve(results);
                }
            }
        )
    })
}


module.exports.insertarTipoTablon = insertarTipoTablon;
module.exports.actualizarTipoTablon = actualizarTipoTablon;
module.exports.obtenerTipoTablon = obtenerTipoTablon;
module.exports.obtenerTiposTablon = obtenerTiposTablon;