const constantes = require('./constantes.js');
const conexion = require('./conexion.js');


function registrar_menu(titulo, padre, tipo_pagina, enlace)
{
    return new Promise(
        function(resolve)
        {
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".menu(vTitulo, padre, nTipo_Pagina, vEnlace) values(" +
                conexion.dbConn.escape(titulo) +", " +  conexion.dbConn.escape(padre) + ", " +  conexion.dbConn.escape(tipo_pagina) + ", " +  conexion.dbConn.escape(enlace) +")" ,
                    function(error, results, field)
                    {
                        if(error) {console.log(error); resolve(false);}
                        else {resolve(true);}
                    });
        });
}

function registrar_menu_id(titulo, padre, tipo_pagina, enlace)
{
    return new Promise(
        function(resolve)
        {
            console.log('Insertar menu id');
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".menu(vTitulo, padre, nTipo_Pagina, vEnlace) values(" +
                conexion.dbConn.escape(titulo) +", " +  conexion.dbConn.escape(padre) + ", " +  conexion.dbConn.escape(tipo_pagina) + ", " +  conexion.dbConn.escape(enlace) +")" ,
                    function(error, results, field)
                    {
                        if(error) {console.log(error); resolve(-1);}
                        else {resolve(results.insertId);}
                    });
        });
}

function obtiene_menu(id_menu)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".menu where padre = " +  conexion.dbConn.escape(id_menu)
             + " order by norden"
            , function(error, results, field)
            {
                if(error) {console.log(error); reject();}
                else {resolve(results);}
            }
            );
        }

    );
}

function obtiene_titulo(id_menu)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select vTitulo from " + constantes.ESQUEMA_BD + ".menu where nid =" + conexion.dbConn.escape(id_menu),
                (error, results, field) =>
                {
                    console.log(results.length);
                    if(results.length < 1) reject();
                    else if(error) reject();
                    else {
                        let titulo = results[0]['vTitulo'];
                        resolve(titulo);
                    }
                }
            )
        }

    )
}

function obtiene_url_menu(id_menu)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".menu where nid =" + conexion.dbConn.escape(id_menu),
                (error, results, field) =>
                {
                    console.log(results.length);
                    if(results.length < 1) reject();
                    else if(error) reject();
                    else {
                        let tipo_pagina = results[0]['nTipo_pagina'];
                        if (tipo_pagina = constantes.TIPO_PAGINA_GENERAL)
                        {
                            resolve('/general/' + id_menu);
                        }
                    }
                }
            )
        }

    )
}


function menu_tiene_componentes(id_menu)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select count(*) num_componentes from " + constantes.ESQUEMA_BD + ".pagina_componente where nid_pagina = " + conexion.dbConn.escape(id_menu),
                (error, results, field) =>
                {
                    let num_componentes = results[0]['num_componentes'];
                    if(num_componentes > 0)
                    {
                        resolve(true);
                    }
                    else
                    {
                        resolve(false);
                    }
                }
            );
        }
    )
}

function menu_tiene_hijos(id_menu)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select count(*) num_hijos from " + constantes.ESQUEMA_BD + ".menu where padre = " + conexion.dbConn.escape(id_menu),
            (error, results, field) =>
            {
                let num_hijos = results[0]['num_hijos'];
                console.log(num_hijos);
                if(num_hijos > 0)
                {
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }
            )
        }
    )
}



function eliminar_menu(id_menu)
{
    return new Promise(
        (resolve, reject) =>
        {
            menu_tiene_componentes(id_menu).then(
                (bTiene_componentes) =>
                {
                    menu_tiene_hijos(id_menu).then(
                        (bTiene_hijos) =>
                        {
                            if(bTiene_componentes || bTiene_hijos)
                            {
                                reject('La pagina tiene componentes');
                            }
                            else
                            {
                                conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".menu where nid = " + conexion.dbConn.escape(id_menu),
                                (error, results, field) =>
                                {
                                    if (error) {reject();}
                                    resolve();
                                }
                                )
                            }
                        }
                    )
                }
            )
        }
    );
}

function actualizar_titulo_menu(id_menu, titulo)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".menu set vTitulo = " + conexion.dbConn.escape(titulo) + " where nid = " + conexion.dbConn.escape(id_menu),
              (error, results, field) =>
              {
                if(error) {reject();}
                else{resolve();}
              }
            )
           
        }
    );
}

module.exports.registrar_menu = registrar_menu;
module.exports.registrar_menu_id = registrar_menu_id;
module.exports.obtiene_menu = obtiene_menu;
module.exports.obtiene_url_menu = obtiene_url_menu;
module.exports.eliminar_menu = eliminar_menu;
module.exports.actualizar_titulo_menu = actualizar_titulo_menu;
module.exports.obtiene_titulo = obtiene_titulo;