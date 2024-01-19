const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function tiene_direccion(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num from ' + constantes.ESQUEMA_BD + '.persona where nid_direccion is not null and nid_direccion <> \'\' ' +
                    ' and nid = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else if(results[0]['num'] < 1) {resolve(false)}
                    else {resolve(true)}
                }
            )
        }
    )
}

function obtiene_nid_direccion(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select nid_direccion from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    if (error) {console.log(error); reject();}
                    else {resolve(results[0]['nid_direccion'])}
                }
            
            )
        }
    )
}

function registrar_direccion_persona(nid_persona, nid_direccion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.persona set nid_direccion = ' + conexion.dbConn.escape(nid_direccion) +
                    ' where nid = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    console.log('c')
                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                    else {resolve();}
                }
            
            )
        }
    )
}

function registrar_direccion(nid_persona, direccion, municipio, provincia, codigo_postal, numero, puerta, escalera)
{   
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                async () =>
                {
                    let bExiste = await tiene_direccion(nid_persona);
                    if(!bExiste)
                    {
                        console.log('No existe')
                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.direccion(direccion, municipio, provincia, codigo_postal, numero, puerta, escalera) values('
                                + conexion.dbConn.escape(direccion) + ', ' + conexion.dbConn.escape(municipio) + ', ' + conexion.dbConn.escape(provincia) + ', '
                                + conexion.dbConn.escape(codigo_postal) + ', ' + conexion.dbConn.escape(numero) + ', ' + conexion.dbConn.escape(puerta) + ', '
                                + conexion.dbConn.escape(escalera) + ')',
                            async (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                else {
                                    await registrar_direccion_persona(nid_persona, results.insertId);
                                    conexion.dbConn.commit(); 
                                    resolve();}
                            }
                        )
                    }
                    else
                    {
                      console.log('Existe')
                        let nid_direccion = await obtiene_nid_direccion(nid_persona);
                        console.log(nid_direccion)
                        
                        conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.direccion set ' +
                                'direccion = ' + conexion.dbConn.escape(direccion) + ', ' +
                                'municipio = ' + conexion.dbConn.escape(municipio) + ', ' +
                                'provincia = ' + conexion.dbConn.escape(provincia) + ', ' +
                                'codigo_postal = ' + conexion.dbConn.escape(codigo_postal) + ', ' +
                                'numero = ' + conexion.dbConn.escape(numero) + ', ' +
                                'puerta = ' + conexion.dbConn.escape(puerta) + ', ' +
                                'escalera = ' + conexion.dbConn.escape(escalera) +
                                ' where nid_direccion = ' + conexion.dbConn.escape(nid_direccion),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                else {conexion.dbConn.commit(); resolve();}
                            } 
                                
                        )
                    }
                }
            )
        }
    )
}

function obtener_direccion(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select d.* from ' + constantes.ESQUEMA_BD + '.direccion d, ' + constantes.ESQUEMA_BD + '.persona p ' +
                    'where d.nid_direccion = p.nid_direccion and p.nid = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else if(results.length < 1) {reject();}
                    else {resolve(results[0])}
                }
            
            )
        })
}

module.exports.registrar_direccion = registrar_direccion;
module.exports.obtener_direccion = obtener_direccion;