const constantes = require('../constantes.js');
const conexion = require('../conexion.js');
const componente = require('./componente.js');

const server = require('../server.js');

function registrar_c_componentes(nid_componente, nColumnas)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".tabla_componentes(nid, nColumnas) values(" + 
                conexion.dbConn.escape(nid_componente) + ", " + conexion.dbConn.escape(nColumnas) + ")", 
                
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve();}
                }
            )
        }
    )
}

function insertar_componente_componentes_orden(id, nColumnas, tipo_asociacion, nOrden)
{
    console.log('componente_componentes->insertar_componente_componentes-> entra');
    return new Promise(
        (resolve, reject) =>
        {
            console.log('componente_componentes->insertar_componente_componentes-> id_pagina ' + id);
            componente.registrar_componente_comun(constantes.TIPO_COMPONENTE_COMPONENTES, id, tipo_asociacion, nOrden).then(
                (nid_componente) =>
                {
                    console.log('componente_componentes->insertar_componente_componentes-> ' + nid_componente);
                    registrar_c_componentes(nid_componente, nColumnas).then(
                        () => { conexion.dbConn.commit(); resolve();});
                }).catch(
                    () =>{
                        conexion.dbConn.rollback(); reject();
                    }
                )
        }
    );
}

function insertar_componente_componentes(id, nColumnas, tipo_asociacion)
{
    return new Promise(
        (resolve, reject) =>
        {

            componente.obtener_ultimo_orden(id).then(
            (max_orden) =>{
                
                insertar_componente_componentes_orden(id, nColumnas, tipo_asociacion, max_orden).then(
                    () => {conexion.dbConn.commit(); resolve();}
                ).catch(
                    () => {conexion.dbConn.rollback(); reject();}
                )
            
            });
        }

    );
}

function obtiene_num_componentes(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select count(*) num_componentes from " + constantes.ESQUEMA_BD + ".componente_componentes where nid_componente = " + 
                conexion.dbConn.escape(id_componente), 
            (error, results, fields) =>
            {
                if(error) {console.log('componente_componentes->obtiene_num_componentes ' + error); reject();}
                else {resolve(results[0]['num_componentes']);}
            }
            )
        }
    )
}


function obtiene_num_componentes_definidos(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select nColumnas from " + constantes.ESQUEMA_BD + ".tabla_componentes where nid = " + 
                conexion.dbConn.escape(id_componente), 
            (error, results, fields) =>
            {
                if(error) {console.log('componente_componentes->obtiene_num_componentes ' + error); reject();}
                else if(results.length < 1) {reject();}
                else {resolve(results[0]['nColumnas']);}
            }
            )
        }
    )
}


function existe_componente_componentes(id_componente, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select count(*) nExiste from " + constantes.ESQUEMA_BD + ".componente_componentes where nid_componente = " + 
                conexion.dbConn.escape(id_componente) + " and nOrden = " + conexion.dbConn.escape(nOrden),
            (error, results, fields) =>
            {
                if(error) {console.log('componente_componentes->existe_componente_componentes ' + error); reject();}

                else{
                  
                    if (results[0]['nExiste'] == 0)
                    {
                        resolve(false);
                    }
                    else{
                        resolve(true);
                    }
                }
            })
        }

    )
}

function obtiene_componente_componentes(id_componente, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".componente_componentes where nid_componente = " + 
            conexion.dbConn.escape(id_componente) + " and nOrden = " + conexion.dbConn.escape(nOrden),
            (error, results, fields) =>
            {
                if(error) {console.log('componente_componentes->obtiene_componente_componentes ' + error); reject();}
                if(results.length < 1) {reject();}
                else resolve(results[0]);
            });
        }

    )
}

function eliminar_tabla_componentes(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            console.log('Eliminar tabla --------' + id_componente);
            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".tabla_componentes where nid = " + conexion.dbConn.escape(id_componente),
            (error, results, fields) =>
            {
                if(error) {console.log(error); reject();}
                else {console.log('Eliminado de tabla componentes'); resolve();}
            })
        }
    )

}

function eliminar_componente_componentes(id_pagina, id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    console.log('eliminar_componente_componentes');
                    obtiene_num_componentes(id_componente).then(
                        (num_componentes) =>
                        {
                            console.log('Num componentes ' + num_componentes);
                            if (num_componentes == 0)
                            {
                                eliminar_tabla_componentes(id_componente).then(
                                    () => {
                                        componente.eliminar_pagina_componente(id_pagina, id_componente).then(
                                            () => {console.log('Eliminado ---------------'); conexion.dbConn.commit(); resolve();}
                                        )
                                        .catch(
                                            () => {conexion.dbConn.rollback(); reject();}
                                        )
                                    }
                                )
                                .catch(
                                    () => {conexion.dbConn.rollback(); reject();}
                                )
                                ;
                            }
                            else{
                                conexion.dbConn.rollback(); 
                                reject();
                            }
                        }
                    )
                }
            )
        }
    )

}


module.exports.insertar_componente_componentes = insertar_componente_componentes;
module.exports.obtiene_num_componentes = obtiene_num_componentes;
module.exports.obtiene_num_componentes_definidos = obtiene_num_componentes_definidos;

module.exports.existe_componente_componentes = existe_componente_componentes;
module.exports.obtiene_componente_componentes = obtiene_componente_componentes;

module.exports.eliminar_componente_componentes = eliminar_componente_componentes;