const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function registrar_persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {  
                    conexion.dbConn.query('insert into ' +  constantes.ESQUEMA_BD + '.persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif) ' +
                                        ' values(' + conexion.dbConn.escape(nombre) + ', ' + conexion.dbConn.escape(primer_apellido) + ', ' + 
                                        conexion.dbConn.escape(segundo_apellido) + ','  +
                                        'cast(nullif(' +
                                        conexion.dbConn.escape(telefono) +
                                        ', \'\') as unsigned)'
                                        + ',' + 
                                        'str_to_date(nullif(' + conexion.dbConn.escape(fecha_nacimiento) + ', \'\') , \'%d/%m/%Y\')' + 
                                        ', ' + conexion.dbConn.escape(nif) + ')',
                                        (error, results, fields) =>
                                        {
                                            if (error) {conexion.dbConn.rollback();  console.log(error); resolve(false);}
                                            else {conexion.dbConn.commit(); console.log('Usuario registrado'); resolve(true); }
                                        }
                                        )
                })
        }
    )
}

function asignar_tipo_persona(nid_persona, nid_tipo)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.tipo_persona_persona(nid_persona, nid_tipo_persona) values(' +
                                    conexion.dbConn.escape(nid_persona) + ', ' + conexion.dbConn.escape(nid_tipo) + ')',
                        (error, results, fields) => 
                        {
                            if(error) {conexion.dbConn.rollback(); resolve(false);}
                            else{
                                conexion.dbConn.commit();
                                resolve(true);
                            }
                        }
                    )
                }
            )
        }
    )
}

async function existe_nif(nif)
{
    return new Promise(
        (resolve, reject) =>
        {
            if (nif.length === 0)
            {
                resolve(false)
            }
            else{
                conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.persona where nif = ' + conexion.dbConn.escape(nif),
                  (error, results, fields) =>
                  {
                    if (error) {resolve(false)}
                    else{
                        resolve(results[0]['cont'] > 0)
                    }
                  }
                )
            }
        }
    )
}

function obtener_nid_persona(nif)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_nif(nif)
            if(bExiste)
            {
                conexion.dbConn.query('select nid from ' + constantes.ESQUEMA_BD + '.persona where nif = ' + conexion.dbConn.escape(nif),
                    (error, results, fields) =>
                    {
                        if (error) {console.log(error); reject('');}
                        else if(results.length < 1) {resolve('')}
                        else{
                            resolve(results[0]['nid']);
                        }
                    }
                )
            }
            else{
                resolve('')
            }
        }

    )
    
}

function obtener_personas()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.persona', 
              (error, results, fields) =>
              {
                if(error) {console.log(error);  reject();}
                else if (results.length < 1) {reject();}
                else {
                    resolve(results);
                }
              }
            )
        }
    )
}

function obtener_persona_tipo(tipo_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.tipo_persona_persona tp ' +
                ' from tp.nid_persona = p.nid and tp.nid_tipo_persona =' + conexion.dbConn.escape(tipo_persona),
                (error, results, fields) =>
                {
                    if(error){console.log(error); reject();}
                    else {resolve(results)}
                }
                )
        }
    )
}

function obtener_persona(nid)
{
    return new Promise(
        (reject, resolve) =>
        {
            console.log('select * from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nid))
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nid),
            (error, results, fields) =>
            {
                if(error) {console.log(error); reject(error);}
                else {resolve(results)}
            }
            )
        }
    )
}
function actualizar_persona(nid, nif, nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.persona set' +
                        ' nif = ' + conexion.dbConn.escape(nif) +
                        ', nombre = ' + conexion.dbConn.escape(nombre) +
                        ', primer_apellido = ' + conexion.dbConn.escape(primer_apellido) +
                        ', segundo_apellido = ' + conexion.dbConn.escape(segundo_apellido) +
                        ', telefono = cast(nullif(' +  conexion.dbConn.escape(telefono) + ', \'\') as unsigned)' +
                        ', fecha_nacimiento = cast(nullif(' + conexion.dbConn.escape(fecha_nacimiento) + ', \'\'), \'%d/%m/%Y\')' +
                        ' where nid = ' + conexion.dbConn.escape(nid),
                        (error, results, fields) => 
                        {
                            if(error){console.log(error); conexion.dbConn.rollback(); resolve(false)}
                            else{conexion.dbConn.commit(); resolve(true)}
                        }

                    )
                }
            )
        }
    )
}






module.exports.registrar_persona = registrar_persona
module.exports.actualizar_persona = actualizar_persona

module.exports.asignar_tipo_persona = asignar_tipo_persona
module.exports.existe_nif = existe_nif
module.exports.obtener_nid_persona = obtener_nid_persona
module.exports.obtener_personas = obtener_personas
module.exports.obtener_persona = obtener_persona

module.exports.obtener_persona_tipo = obtener_persona_tipo