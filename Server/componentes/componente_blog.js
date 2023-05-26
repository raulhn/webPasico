const constantes = require('../constantes.js');
const conexion = require('../conexion.js');
const componente = require('../componente.js');
const menu = require('../menu.js');
const imagen = require('../imagen.js');

function add_componente_blog(id_componente, titulo, fecha, imagen_, descripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                async () =>
                {
                    let id_padre = await componente.obtener_pagina_de_componente(id_componente);
                    let id_pagina = await menu.registrar_menu_id(titulo, id_padre, constantes.TIPO_PAGINA_GENERAL, '');
                    let id_imagen = await imagen.subir_imagen(titulo, imagen_);
                    
                    conexion.dbConn.query(
                        'insert into ' + constantes.ESQUEMA_BD + '.componente_blog(nid_componente, titulo, fecha, nid_imagen, nid_menu, descripcion) values(' +
                            conexion.dbConn.escape(id_componente) + ', ' +  conexion.dbConn.escape(titulo) +  ', ' +
                            'str_to_date(' +  conexion.dbConn.escape(fecha) + ', "%Y-%m-%d")' + ', ' + conexion.dbConn.escape(id_imagen) +  ', ' +
                            conexion.dbConn.escape(id_pagina) + ', ' + conexion.dbConn.escape(descripcion) +')',

                        (error, results, fields) => 
                        {
                            if(error) 
                            {
                                console.log(error); 
                                conexion.dbConn.rollback();
                                reject()
                            }
                            else 
                            {
                                conexion.dbConn.commit();
                                resolve()
                            }
                        }     
                    )
                }
            )
        }
    )
}

function obtener_componente_blog(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select nid_componente, titulo, fecha, nid_imagen, nid_menu, descripcion from ' + constantes.ESQUEMA_BD + '.componente_blog where nid_componente = ' + 
                conexion.dbConn.escape(id_componente),
                (error, results, fields) =>
                {
                    if (error)
                    {
                        console.log(error);
                        reject();
                    }
                    else{
                        if (results.length > 0)
                        {
                            resolve(results);
                        }
                        else{
                            reject();
                        }
                    }
                }
            
            )
        }
    )
}

function eliminar_componente_blog(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                async () =>
                {
                    conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.componente_blog where nid_componente = ' +  
                            conexion.dbConn.escape(id_componente),
                        async (error, result, fields) =>
                        {
                            if (error)
                            {
                                console.log(error);
                                conexion.dbConn.rollback();
                                reject();
                            }
                            else{
                                try
                                {componente.eliminar_componente_comun(id_pagina, id_componente, tipo_asociacion)}
                                catch(e)
                                {
                                    console.log(e);
                                    reject();
                                }
                            }
                        }
                        
                    )
                }
            )
        }
    )
}

module.exports.add_componente_blog = add_componente_blog
module.exports.obtener_componente_blog = obtener_componente_blog
module.exports.eliminar_componente_blog = eliminar_componente_blog