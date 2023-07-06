const conexion = require('../conexion.js')
const constantes = require('../constantes.js')
const persona = require('./persona.js')


function existe_instrumento(nid_instrumento)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.instrumentos where nid = ' + conexion.dbConn.escape(nid_instrumento),
                (error, results, fields) =>
                {
                    if (error) {resolve(false)}
                    else{ resolve(results[0]['cont'] > 0)}
                }
            )
        }
    )
}

function obtener_instrumentos()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.instrumentos',
                (error, results, fields) =>
                {
                    if(error) {reject(error);}
                    else
                    {
                        resolve(results);
                    }
                }
            )
        }
    )
}

async function registrar_instrumento_persona(nid_persona, nid_instrumento)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExistePersona = await persona.existe_nid(nid_persona);
            bExisteInstrumento = await existe_instrumento(nid_instrumento);
        
            if(bExistePersona && bExisteInstrumento)
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.musico(nid_persona, nid_instrumento) values(' + conexion.dbConn.escape(nid_persona) +
                                ', ' + conexion.dbConn.escape(nid_instrumento) + ')',
                            (error, results, fields) =>
                            {
                                if (error) {console.log(error); conexion.dbConn.rollback(); reject(error)}
                                else {conexion.dbConn.commit(); resolve();}
                            } 
                        )
                    }
                )
            }
            else
            {
                reject('Error al registrar al músico')
            }
        }
    )
}

function obtener_instrumentos_persona(nid_persona)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExistePersona = await persona.existe_nid(nid_persona);
            if (bExistePersona)
            {
                conexion.dbConn.query('select i.* from ' + constantes.ESQUEMA_BD + '.musico m, ' + constantes.ESQUEMA_BD + '.instrumentos i where m.nid_persona = ' +
                        conexion.dbConn.escape(nid_persona) + ' and m.nid_instrumento = i.nid',
                    (error, results, fields) =>
                    {
                        if (error) {console.log(error); reject(error);}
                        else {resolve(results)}
                    }
                )
            }
            else
            {
                reject('Error al obtener la información');
            }
        }
    )
}

function eliminar_instrumento_persona(nid_persona, nid_instrumento)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.musico where nid_persona ' + conexion.dbConn.escape(nid_persona) + 
                            ' and nid_instrumento = ' + conexion.dbConn.escape(nid_instrumento),
                        (error, results, fields) =>
                        {
                            if (error) {console.log(error); conexion.dbConn.rollback(); reject(error)}
                            else {conexion.dbConn.commit(); resolve()}
                        }
                    )
                }
            )
        }
    )
}

function obtener_personas_instrumento(nid_instrumento)
{
    return new Promise(
        async (resolve, reject) =>
        {
            if(await existe_instrumento(nid_instrumento))
            {
                conexion.dbConn.query('select p.* from ' + constantes.ESQUEMA_BD + 'persona p, ' + constantes.ESQUEMA_BD + '.musico m where m.nid_persona = p.nid and ' +
                        'm.nid_instrumento = ' + conexion.dbConn.escape(nid_instrumento),
                    (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject(error)}
                        else {
                            resolve(results);
                        }
                    }
                )
            }
            else
            {
                reject('No existe instrumento')
            }
        }
    )
}

module.exports.obtener_instrumentos = obtener_instrumentos;

module.exports.registrar_instrumento_persona = registrar_instrumento_persona
module.exports.obtener_instrumentos_persona = obtener_instrumentos_persona
module.exports.eliminar_instrumento_persona = eliminar_instrumento_persona
module.exports.obtener_personas_instrumento = obtener_personas_instrumento