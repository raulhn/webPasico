const conexion = require('../conexion.js')
const constantes = require('../constantes.js')
const persona = require('./persona.js')



function existe_socio(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.socios where nid_persona = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error);}
                    else { resolve(results[0]['cont']);}
                }
            )
        }
    )
}

function registrar_socio(nid_persona, num_socio, fecha_alta)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExistePersona = await persona.existe_nid(nid_persona);
            bExisteSocio = await existe_socio(nid_persona);
            
            if (!bExistePersona)
            {
                reject('No existe la persona')
            }
            else if(bExisteSocio)
            {
                reject('El socio ya está registrado')
            }
            else
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.socios(nid_persona, num_socio, fecha_alta) values(' +
                                conexion.dbConn.escape(nid_persona) + ', ' + conexion.dbConn.escape(num_socio) + ', '
                                 +  'str_to_date(nullif(' + conexion.dbConn.escape(fecha_alta) + ', \'\') , \'%Y-%m-%d\'))',
                            (error, results, fields) =>
                            {
                                if(error)
                                {
                                    console.log(error);
                                    conexion.dbConn.rollback();
                                    reject(error);
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
        }
    );
}

function actualizar_socio(nid_persona, num_socio, fecha_alta, fecha_baja)
{
    return new Promise(
        async(resolve, reject) =>
        {
            bExisteSocio = await existe_socio(nid_persona);
            if(bExisteSocio)
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.socios set fecha_baja = str_to_date(nullif(' + conexion.dbConn.escape(fecha_baja) + ', \'\') , \'%Y-%m-%d\'),' +
                                ' fecha_alta =  str_to_date(nullif(' + conexion.dbConn.escape(fecha_alta) + ', \'\') , \'%Y-%m-%d\'), ' +
                                ' num_socio = ' + conexion.dbConn.escape(num_socio) +
                                ' where nid_persona = ' + conexion.dbConn.escape(nid_persona),
                            (error, results, fields) =>
                            {
                                if(error)
                                {
                                    console.log(error);
                                    conexion.dbConn.rollback();
                                    reject(error);
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
            else
            {
                reject('No existe socio')
            }
        }
    )
}

function obtener_socios()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select p.*, s.fecha_alta, s.fecha_baja from ' + constantes.ESQUEMA_BD + '.socios s, ' + constantes.ESQUEMA_BD + '.persona p where s.nid_persona = p.nid',
                (error, results, fields) =>
                {
                    if (error) {console.log(error); reject(error)}
                    else{
                        resolve(results);
                    }
                }
            )
        }
    )
}

function obtener_socio(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.socios where nid_persona = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error);}
                    else{resolve(results); }
                }
            )
        }
    )
}

module.exports.registrar_socio = registrar_socio;
module.exports.actualizar_socio = actualizar_socio;
module.exports.obtener_socios = obtener_socios;
module.exports.obtener_socio = obtener_socio;