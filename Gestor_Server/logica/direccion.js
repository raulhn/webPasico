const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function tiene_direccion(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num from ' + constantes.ESQUEMA_BD + '.persona where nid_direccion is not null and nid_direccion <> \'\'',
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

function registrar_direccion(nid_persona, direccion, municipio, provincia, codigo_postal, numero, puerta, escalera)
{   
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                async () =>
                {
                    bExiste = await tiene_direccion(nid_persona);

                    if(!bexiste)
                    {
                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '(direccion, municipio, provincia, codigo_postal, numero, puerta, escalera) values('
                                + conexion.dbConn.escape(direccion) + ', ' + conexion.dbConn.escape(municipio) + ', ' + conexion.dbConn.escape(provincia) + ', '
                                + conexion.dbConn.escape(codigo_postal) + ', ' + conexion.dbConn.escape(numero) + ', ' + conexion.dbConn.escape(puerta) + ', '
                                + conexion.dbConn.escape(escalera) + ')',
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                else {conexion.dbConn.commit(); resolve();}
                            }
                        )
                    }
                    else
                    {
                        conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.direccion set ' +
                                'direccion = ' + conexion.dbConn.escape(direccion) + ', ' +
                                'municipio = ' + conexion.dbConn.escape(municipio) + ', ' +
                                'provincia = ' + conexion.dbConn.escape(provincia) + ', ' +
                                'codigo_postal = ' + conexion.dbConn.escape(codigo_postal) + ', ' +
                                'numero = ' + conexion.dbConn.escape(puerta) + ', ' +
                                'puerta = ' + conexion.dbConn.escape(puerta) + ', ' +
                                'escalera = ' + conexion.dbConn.escape(escalera),
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
    conexion.dbConn.query('select d.* from ' + constantes.ESQUEMA_BD + '.direccion d, ' + constantes.ESQUEMA_BD + '.persona p ' +
            'where d.nid_direccion = p.nid_direccion and p.nid = ' + conexion.dbConn.escape(nid_persona),
        (error, results, fields) =>
        {
            if(error) {console.log(error); reject();}
            else if(results.length < 1) {reject();}
            else {resolve(results[0])}
        }
    
    )
}

module.exports.registrar_direccion = registrar_direccion;
module.exports.obteener_direccion = obtener_direccion;