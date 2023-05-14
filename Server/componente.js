const constantes = require('./constantes.js');
const conexion = require('./conexion.js');
const menu = require('./menu.js');
const imagen = require('./imagen');


function existe_componente(nid_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".componente where nid = " +  conexion.dbConn.escape(nid_componente), 
            function(error, results, fields) 
            {
                if (error)  return resolve(false);
                if (results.length <= 0)
                {
                    resolve(false);
                }
                resolve(true);
            });
            
        }
    
    );
}

function tipo_componente(nid_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select nTipo from " + constantes.ESQUEMA_BD + ".componente where nid = " +  conexion.dbConn.escape(nid_componente), 
            function(error, results, field)
            {
                if (error)  return reject();
                else if (results.length <= 0)
                {
                    reject();
                }
                else{
                console.log(results);
                resolve(results[0]['nTipo']);
                }
            });
        }
    
    );
}

function esComponente_texto(nid_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            existe_componente(nid_componente).then(
                function(existe)
                {
                    if(existe)
                    {
                        tipo_componente(nid_componente).then(
                            function(nTipo)
                            {
                                resolve(nTipo == constantes.TIPO_COMPONENTE_TEXTO);
                            }
                        );
                    }
                   
                }
            );
        }
    )
}

function actualizar_texto(texto_html, nid_componente)
{
    return new Promise(
        function(resolve, reject)
        {
        conexion.dbConn.beginTransaction(
            () =>
            {  
            esComponente_texto(nid_componente).then(
                function(bEsComponente_texto)
                {
                    if(bEsComponente_texto)
                    {
                        conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".componente_texto set cTexto = " +  conexion.dbConn.escape(texto_html) + 
                            " where nid = " + conexion.dbConn.escape(nid_componente),
                            function(error, results, fields)
                            {
                            if(error) {conexion.dbConn.rollback(); console.log(error); resolve(false);}
                            else {conexion.dbConn.commit(); resolve(true);}
                            });
                    }
                }
            ).catch()
            {
                reject();
            }
            });
        });
}

function obtener_ultimo_orden(id_pagina)
{

    return new Promise(
        (resolve, reject) => 
        {
            console.log('obtener_ultimo_orden -> llega');
            conexion.dbConn.query("select ifnull(max(nOrden), 0) orden from " + constantes.ESQUEMA_BD + ".pagina_componente where nid_pagina = " + conexion.dbConn.escape(id_pagina), 
                function(error, results, field)
                {
                    if(error) {console.log(error); resolve(0);}
                    else { resolve(results[0]['orden']);}
                }
            );
        }
    );
}

function registrar_c_texto(nid_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente_texto(nid) values(" + conexion.dbConn.escape(nid_componente) + ")",
                function(error, results, field)
                {
                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                   
                    resolve();
                } 
            );
        }
    )
}

function registrar_imagen(titulo)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".imagen(titulo) values(" + conexion.dbConn.escape(titulo) + ")",
                (error, results, fields) =>
                {
                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                    let id_imagen = results.insertId;
                    resolve(id_imagen);
                }
            )
        }
    )
}

function registrar_c_imagen(nid_componente, titulo)
{
    return new Promise(
        (resolve, reject) =>
        {
            registrar_imagen(titulo).then(
            (id_imagen) =>
            {
                conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente_imagen(nid_componente, nid_imagen) values(" +conexion.dbConn.escape(nid_componente) 
                    + ", " + conexion.dbConn.escape(id_imagen) +")",
                    function(error, results, field)
                    {
                        if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                        resolve();
                    } 
                );
            });
        }
    )
}

function registrar_componente(tipo_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            
            console.log('registrar_componente -> llega');
            
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente(nTipo) values(" + conexion.dbConn.escape(tipo_componente) + ")" ,
                function(error, results, fields)
                {
                    if(error){ console.log('componente->registrar_componente ' + error);  conexion.dbConn.rollback(); reject(error);}
                    else
                    {
                        let id_componente = results.insertId;
                        resolve(id_componente);
                    }
                }
            );
          //  reject();
        }
    )
}

function registrar_componente_pagina(id_componente, id_pagina, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            // Asocia el componente a la página
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".pagina_componente(nid_pagina, nid_componente, nOrden) values(" + 
                conexion.dbConn.escape(id_pagina) + ", " + conexion.dbConn.escape(id_componente) + ", " + conexion.dbConn.escape(nOrden) + " + 1)",
            (error, results, fields) =>
            {
                if(error) {console.log(error); reject();}
                resolve();
            }
            );
 
        }
    );
}

function registrar_componente_componentes(id_componente, id_componente_padre, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            // Asocia el componente a la página
            console.log('registrar_componente_componentes -> ' + nOrden);
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente_componentes(nid_componente, nid_componente_hijo, nOrden) values(" + 
                conexion.dbConn.escape(id_componente_padre) + ", " + conexion.dbConn.escape(id_componente) + ", " + conexion.dbConn.escape(nOrden) + ")",
            (error, results, fields) =>
            {
                if(error) reject();
                resolve();
            }
            );
     
        }
    );
}

function registrar_componente_comun(tipo_componente, id, tipo_asociacion, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {   
                    console.log('componente->registrar_componente_comun ' + tipo_asociacion);
                    registrar_componente(tipo_componente).then(
                        (id_componente) =>
                        {
                            console.log('componente->registrar_componente_comun ' + id_componente);
                            if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                            {
                                console.log('componente->registrar_componente_comun-> pagina ');

                                registrar_componente_pagina(id_componente, id, nOrden).then(
                                () => {resolve(id_componente);}
                                )
                                .catch(
                                () => {reject();}
                                );
                            
                            }
                            else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                            {
                                console.log('componente->registrar_componente_comun-> componentes ');
                                registrar_componente_componentes(id_componente, id, nOrden).then(
                                    () => {resolve(id_componente);}
                                ).catch(
                                    () => {reject();}
                                );
                            }
                        }
                    ).catch(
                        (error) => {console.log(error); console.log('error'); reject();},
                        () => {console.log("Se ha producido un error");}
                    );
                }

            );
        }
    );
}

function registrar_componente_texto_orden(id, tipo_asociacion, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            console.log('registrar_componente_texto -> llega');
            registrar_componente_comun(constantes.TIPO_COMPONENTE_TEXTO, id, tipo_asociacion, nOrden).then(
                (nid_componente) =>
                {
                    console.log('registrar_componente_texto -> 1');
                    registrar_c_texto(nid_componente).then(
                        () => { conexion.dbConn.commit(); resolve();});
                }

            ).catch(
                () =>{
                    conexion.dbConn.rollback(); reject();
                }
            )
      
        }
    );
}

function registrar_componente_texto(id, tipo_asociacion)
{
    return new Promise(
    (resolve, reject) =>
    {
        
        obtener_ultimo_orden(id).then((max_orden) =>{
  
            registrar_componente_texto_orden(id, tipo_asociacion, max_orden).then(
                () => {resolve();}
            )
        }).catch(
            () => {reject();}
        )
        ;
    }
    );
}

function registrar_componente_imagen_orden(id, titulo, tipo_asociacion, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            registrar_componente_comun(constantes.TIPO_COMPONENTE_IMAGEN, id, tipo_asociacion, nOrden).then(
                (nid_componente) =>
                {
                    registrar_c_imagen(nid_componente, titulo).then(
                        () => { conexion.dbConn.commit(); resolve();});
                }

            ).catch(
                () =>{
                    conexion.dbConn.rollback(); reject();
                }
            )
      
        }
    );
}

function registrar_componente_imagen(id, titulo, tipo_asociacion)
{
    return new Promise(
        (resolve, reject) =>
        {
		console.log('Registrar_componente_imagen');
            obtener_ultimo_orden(id).then(
            (max_orden) => {
  			
                registrar_componente_imagen_orden(id, titulo, tipo_asociacion, max_orden).then(
                    () => {conexion.dbConn.commit(); resolve();}
                ).catch(
                    () => {conexion.dbConn.rollback(); reject();}
                )
            
            }).catch( () => {console.log('Error imagen');});
        }

    );
}

function registrar_c_video(nid_componente, url)
{
    return new Promise(
        (resolve, reject) =>
        {
        
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente_video(nid_componente, url) values(" +conexion.dbConn.escape(nid_componente) 
                + ", " + conexion.dbConn.escape(url) +")",
                function(error, results, field)
                {
                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                    resolve();
                } 
            );
        
        }
    )
}

function registrar_componente_video_orden(id, url, tipo_asociacion, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            registrar_componente_comun(constantes.TIPO_COMPONENTE_VIDEO, id, tipo_asociacion, nOrden).then(
                (nid_componente) =>
                {
                    registrar_c_video(nid_componente, url).then(
                        () => { conexion.dbConn.commit(); resolve();});
                }

            ).catch(
                () =>{
                    conexion.dbConn.rollback(); reject();
                }
            )
      
        }
    );
}

function registrar_componente_video(id, url, tipo_asociacion)
{
    return new Promise(
        (resolve, reject) =>
        {
            console.log('Registrar_componente_video');
            obtener_ultimo_orden(id).then(
                (max_orden) =>
                {
                    registrar_componente_video_orden(id, url, tipo_asociacion, max_orden).then(
                        () => {conexion.dbConn.commit(); resolve();}
                    ).catch(
                            () => {conexion.dbConn.rollback(); reject();}
                    )
                }
            ).catch( () => {console.log('Error Video'); reject();});
        }
    )
}

function registrar_c_galeria(nid_componente, titulo, descripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
        
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente_galeria(nid_componente, titulo, descripcion) values(" +
                conexion.dbConn.escape(nid_componente) +
                ", " + conexion.dbConn.escape(titulo) +
                ", " + conexion.dbConn.escape(descripcion) +
                ")",
                function(error, results, field)
                {
                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                    resolve();
                } 
            );
        
        }
    )
}

function registrar_componente_galeria_orden(id, titulo, descripcion, tipo_asociacion, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            registrar_componente_comun(constantes.TIPO_COMPONENTE_GALERIA, id, tipo_asociacion, nOrden).then(
                (nid_componente) =>
                {
                    registrar_c_galeria(nid_componente, titulo, descripcion).then(
                        () => { conexion.dbConn.commit(); resolve();});
                }

            ).catch(
                () =>{
                    conexion.dbConn.rollback(); reject();
                }
            )
      
        }
    );
}


function registrar_componente_galeria(id, titulo, descripcion, tipo_asociacion)
{
    return new Promise(
        (resolve, reject) =>
        {
            console.log('Registrar componente_galeria');
            obtener_ultimo_orden(id).then(
                (max_orden) =>
                {
                    registrar_componente_galeria_orden(id, titulo, descripcion, tipo_asociacion, max_orden).then(
                        () => {conexion.dbConn.commit(); resolve()}
                    ).catch(
                        () => {conexion.dbConn.rollback(); reject();}
                    )
                }
            ).catch( () => {console.log('Error galeria'); reject();})
        }
    )
}




/**
 * Componente para listas de páginas
 * @param {Id de la página donde se ubicará el componente} id 
 * @param {Si la asociación del componente es a un a página o a un compoennte de componentes} tipo_asociacion 
 * @param {Orden en el que se va a colocar la página} nOrden 
 * @returns 
 */
function registrar_componente_paginas_orden(id, tipo_asociacion, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            registrar_componente_comun(constantes.TIPO_COMPONENTE_PAGINAS, id, tipo_asociacion, nOrden).then(
                (nid_componente) =>
                {
                     console.log('Nuevo componente ' + nid_componente);
                     conexion.dbConn.commit(); 
                     resolve();
                })
            .catch(
                () =>{
                    conexion.dbConn.rollback(); reject();
                }
            )
      
        }
    );
}

/**
 * Componente para listas de páginas
 * @param {Id de la página donde se ubicará el componente} id 
 * @param {Si la asociación del componente es a un a página o a un compoennte de componentes} tipo_asociacion 
 * @returns 
 */
function registrar_componente_paginas(id, tipo_asociacion)
{
    return new Promise(
        (resolve, reject) =>
        {
            obtener_ultimo_orden(id).then(
                (max_orden) =>
                {
                    registrar_componente_paginas_orden(id, tipo_asociacion, max_orden).then(
                        () => {conexion.dbConn.commit(); resolve()}
                    ).catch(
                        () => {console.log('Error'); conexion.dbConn.rollback(); reject();}
                    )
                }
            ).catch( () => {console.log('Error componente paginas'); reject();})
        }

    )
}
 
function registrar_componente_carusel_orden(id, tipo_asociacion, elementos_simultaneos, nOrden)
{
    return new Promise(
        (resolve, reject) =>
        {
            console.log('Tipo de asociacion ' + tipo_asociacion)
            registrar_componente_comun(constantes.TIPO_COMPONENTE_CARUSEL, id, tipo_asociacion, nOrden).then(
                (nid_componente) =>
                {
                    console.log('Nuevo componente ' + nid_componente);
                    conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente_carusel(nid_componente, elementos_simultaneos) values("
                        + conexion.dbConn.escape(nid_componente) + ", " + conexion.dbConn.escape(elementos_simultaneos) + ")",
                        (error, results, fields) =>
                        {
                            if (error) { console.log(error);  conexion.dbConn.rollback(); reject();}
                            else{
                                conexion.dbConn.commit(); 
                                resolve();
                            }
                        }
                        );
                }
            ).catch( () => {console.log('Error componente carusel'); reject();})
        }
    )
}
function registrar_componente_carusel(id, tipo_asociacion, elementos_simultaneos)
{
    return new Promise(
        (resolve, reject) =>
        {       console.log('4')
            obtener_ultimo_orden(id).then(
                (max_orden) =>
                {
                    registrar_componente_carusel_orden(id, tipo_asociacion, elementos_simultaneos, max_orden).then(
                        () => {conexion.dbConn.commit(); resolve()}
                    ).catch(
                        () => {console.log('Error'); conexion.dbConn.rollback(); reject();}
                    )
                }
            )
        }
    )
}

function obtiene_componente_texto(id_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".componente_texto where nid = " + conexion.dbConn.escape(id_componente), function(error, results, field)
            {
                if(error) {console.log(error); reject;}
                if (results.length < 1)
                {
                    reject();
                }
                resolve(results[0]);
            });
        }

    )
}

function eliminar_componente(id_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("delete from " +  constantes.ESQUEMA_BD + ".componente where nid = " + conexion.dbConn.escape(id_componente), 
            function(error, results, field)
            {
                if(error) {console.log(error); reject();}

                else{resolve();}
            });
        }
    )
}

function eliminar_pagina_componente(id_pagina, id_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            console.log('eliminar_pagina_componente');
            obtiene_orden(id_pagina, id_componente).then(
                (nOrden) =>
                {
                    console.log('Orden ' + nOrden);
                    conexion.dbConn.query("delete from " +  constantes.ESQUEMA_BD + ".pagina_componente where nid_componente = " + conexion.dbConn.escape(id_componente), 
                    function(error, results, field)
                    {
                        if(error) {console.log(error); reject();}
                    
                        conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".pagina_componente set nOrden = nOrden - 1 where nOrden > " + conexion.dbConn.escape(nOrden) + 
                        " and nid_pagina = " + conexion.dbConn.escape(id_pagina),
                            (error, results, field) =>
                            {
                                console.log('actualiza orden')
                                if(error) {console.log(error); reject();}
                                else{
                                    console.log('elimina componente');
                                    eliminar_componente(id_componente).then(() => {resolve();}).catch(() => reject());
                                }
                            }
                        );
                    });
                }
                
            );
        });
}

function eliminar_componente_componentes(id_componente)
{
    return new Promise(
        function(resolve, reject)
        {
           
                    conexion.dbConn.query("delete from " +  constantes.ESQUEMA_BD + ".componente_componentes where nid_componente_hijo = " + conexion.dbConn.escape(id_componente), 
                    function(error, results, field)
                    {
                        if(error) {console.log(error); reject();}
                        resolve();
                      
                    });
                }
                
            );

}

function eliminar_componente_texto(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.beginTransaction(
            function()
            {
              
            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".componente_texto where nid = " + conexion.dbConn.escape(id_componente),
                function(error, results, field)
                {
                    if(error) {reject();}
                    console.log('eliminar_componente_texto-> Eliminar ' +  tipo_asociacion);
                    if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                    {
                      eliminar_pagina_componente(id_pagina, id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                    else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                    {
                        eliminar_componente_componentes(id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                
                }
            );
            });
        }
    )
}

function eliminar_componente_imagen(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.beginTransaction(
            function()
            {
                console.log('Eliminar ' + id_componente);
            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".componente_imagen where nid_componente = " + conexion.dbConn.escape(id_componente),
                function(error, results, field)
                {
                    if(error) {console.log(error); reject();}
                    if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                    {
                      eliminar_pagina_componente(id_pagina, id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                    else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                    {
                        console.log('componente componentes');
                        eliminar_componente_componentes(id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                
                }
            );
            });
        }
    )
}

function eliminar_componente_video(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.beginTransaction(
            function()
            {
                console.log('Eliminar ' + id_componente);
            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".componente_video where nid_componente = " + conexion.dbConn.escape(id_componente),
                function(error, results, field)
                {
                    if(error) {console.log(error); reject();}
                    if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                    {
                      eliminar_pagina_componente(id_pagina, id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                    else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                    {
                        console.log('componente componentes');
                        eliminar_componente_componentes(id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                
                }
            );
            });
        }
    )
}

function eliminar_componente_galeria(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.beginTransaction(
            function()
            {
            

                conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".componente_galeria where nid_componente = " + conexion.dbConn.escape(id_componente),
                function(error, results, field)
                {
                    if(error) {console.log(error); reject();}
                    if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                    {
                      eliminar_pagina_componente(id_pagina, id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                    else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                    {
                        console.log('componente componentes');
                        eliminar_componente_componentes(id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                
                }
            );
            });
        }
    )
}


function eliminar_componente_paginas(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.beginTransaction(
            function()
            {
                console.log('Eliminar ' + id_componente);
                console.log('Eliminar ' + id_componente + ' Pagina ' + id_pagina);
            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".componente_paginas where nid_componente = " + conexion.dbConn.escape(id_componente),
                function(error, results, field)
                {
                    if(error) {console.log(error); reject();}
                    if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                    {
                      console.log('eliminar_componente_paginas -> Eliminar pagina componente')
                      eliminar_pagina_componente(id_pagina, id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => {console.log('Error al eliminar paginas componente'); conexion.dbConn.rollback(); reject();});
                    }
                    else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                    {
                        console.log('componente componentes');
                        eliminar_componente_componentes(id_componente).then(() => {conexion.dbConn.commit(); resolve();})
                        .catch(() => { conexion.dbConn.rollback(); reject();});
                    }
                
                }
            );
            });
        }
    )
}

function eliminar_componente_carusel(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        async (resolve, reject) =>
        {
            try
            {
                if (tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                {
                    console.log('eliminar_componente_carusel -> Eliminar carusel componente')
                    await eliminar_pagina_componente(id_pagina, id_compnente);
                    conexion.dbConn.commit();
                    resolve();
                }
                else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                {
                    await eliminar_componente_componentes(id_componente);
                    conexion.dbConn.commit();
                    resolve();
                }
            }
            catch(e)
            {
                reject();
            }
        }
    )
}

function obtiene_url_video(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            
            conexion.dbConn.query("select url from " + constantes.ESQUEMA_BD + ".componente_video where nid_componente = " + conexion.dbConn.escape(id_componente),
                function(error, results, field)
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results[0]['url']);}
                }
            )
        }
    )
}

function obtiene_componentes(id_pagina)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".pagina_componente where nid_pagina = " + conexion.dbConn.escape(id_pagina) + " order by nOrden",
                function(error, results, field)
                {
                    if(error) {console.log(error); reject();}
                    resolve(results);
                }
            )
        });
}

function decrementa_orden(id_pagina, id_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.beginTransaction(
                function()
                {
            obtiene_orden(id_pagina, id_componente).then(
                (orden) => {
                    conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".pagina_componente set nOrden = nOrden + 1 where nOrden = " + conexion.dbConn.escape(orden) + 
                        " - 1 and nid_pagina = " + conexion.dbConn.escape(id_pagina),
                    function(error, results, field)
                    {
                        if(error) {console.log(error); reject();}
                        else{
                            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".pagina_componente set nOrden = nOrden - 1 where nid_pagina = " + 
                                conexion.dbConn.escape(id_pagina) +  " and nid_componente = " + conexion.dbConn.escape(id_componente),
                            function(error, results, field)
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                else {conexion.dbConn.commit(); resolve();}
                            });
                        }
                    }
                    )
                }
            )
         });
                
           
        }
    )
}


function incrementa_orden(id_pagina, id_componente)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.beginTransaction(
                function()
                {
            obtiene_orden(id_pagina, id_componente).then(
                (orden) => {
                    conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".pagina_componente set nOrden = nOrden - 1 where nOrden = " + conexion.dbConn.escape(orden) + 
                        "+ 1 and nid_pagina = " + conexion.dbConn.escape(id_pagina),
                    function(error, results, field)
                    {
                        if(error) {console.log(error); reject();}
                        else{
                            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".pagina_componente set nOrden = nOrden + 1 where nid_pagina = " + 
                                conexion.dbConn.escape(id_pagina) + " and nid_componente = " + conexion.dbConn.escape(id_componente),
                            function(error, results, field)
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                else {conexion.dbConn.commit(); resolve();}
                            });
                         }
                    }
                    )
                }
            )
            });
        }
    )
}

function obtiene_numero_componente(id_pagina)
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query("select count(*) numero from " + constantes.ESQUEMA_BD + ".pagina_componente where nid_pagina = " + conexion.dbConn.escape(id_pagina),
                function(error, results, field)
                {
                if(error) {console.log(error); reject();}
                resolve(results[0]['numero']);
                });
        }
    );
}

function obtiene_orden(id_pagina, id_componente)
{
    return new Promise(
        function(resolve, reject)
        {

            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("select nOrden from " + constantes.ESQUEMA_BD + ".pagina_componente where nid_pagina = " + 
                        conexion.dbConn.escape(id_pagina) + " and nid_componente = " + conexion.dbConn.escape(id_componente),
                        function(error, results, field)
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else
                            {
                                console.log('Error ' + error);
                                console.log('Resultados', results); 
                                conexion.dbConn.commit();
                                resolve(results[0]['nOrden']);
                            }
                        });
                }
            );
        }
    );
}

function actualiza_orden(nOrden, bAumento)
{
    return new Promise(
        (resolve, reject) =>
        {
            var condicion;
            if(bAumento)
            {
                condicion =  'orden + 1';
            }
            else{
                condicion = 'orden - 1';
            }
            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + '.componente_paginas set orden = ' + condicion + ' where orden > ' + conexion.dbConn.escape(nOrden),
                (error, results, fields) =>
                {
                    if (error) {console.log(error); reject();}
                    else {resolve();}
                }
            )
        }
    )
}

function get_orden_pagina(nid_componente, nid_pagina)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select orden from " + constantes.ESQUEMA_BD + ".componente_paginas where nid_componente = " +
            conexion.dbConn.escape(nid_componente) + " and nid_pagina = " + conexion.dbConn.escape(nid_pagina),
            (error, results, fields) =>
            {
                if(error) { console.log(error); reject();}
                else if(results.length < 1) { console.log('No se han obtenido resultados'); resolve(0);}
                else { resolve(results[0]['orden']);}
            } )
        }
    )
}

function add_pagina_componente(nid_componente, padre, titulo, descripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            console.log('Registrar menu');
            menu.registrar_menu_id(titulo, padre, constantes.TIPO_PAGINA_GENERAL, '').then(
                (id_pagina) =>
                {
                    console.log(id_pagina);
                    if(id_pagina > 0)
                    {
                        actualiza_orden(-1, true).then(
                            () =>
                            {
                                conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".componente_paginas(nid_componente, nid_pagina, descripcion, orden) values(" +
                                conexion.dbConn.escape(nid_componente) + 
                                ", " + conexion.dbConn.escape(id_pagina) + 
                                ", " + conexion.dbConn.escape(descripcion) +
                                ", 0)",
                                function(error, results, field)
                                {
                                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                    else {console.log('INSERTADO'); resolve();}
                                });
                         })
                        .catch(
                            () => {conexion.dbConn.rollback(); reject();}
                        )
                    }
                    else{
                        console.log('Error');
                        reject();
                    }
                }            );
        }
    );
    
}


function remove_pagina_componente(nid_componente, nid_pagina)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
            () => {

           get_orden_pagina(nid_componente, nid_pagina).then(
            (orden) =>
            {
                conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".componente_paginas where nid_componente = " +
                                    conexion.dbConn.escape(nid_componente) + " and nid_pagina = " + conexion.dbConn.escape(nid_pagina),
                    (error, results, fields) =>
                    {
                        if (error) {console.log(error); conexion.dbConn.rollback(); reject();}
                        else{
                            actualiza_orden(orden, false);
                            menu.eliminar_menu(nid_pagina).then(
                                () => { conexion.dbConn.commit(); resolve();}
                            )
                            .catch(
                                () =>
                                {
                                    conexion.dbConn.rollback(); reject();
                                }
                            )
                          
                        }
                    });            
                }
                )
            .catch(
                () =>
                {
                    conexion.dbConn.rollback();
                    reject();
                }
            )   
            });   
        }
    )

}

function obtener_paginas_componente(nid_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + ".componente_paginas where nid_componente = "
            + conexion.dbConn.escape(nid_componente) + " order by orden asc",
            
            (error, results, fields) =>
            {
                if(error) {console.log(error); reject();}
                if(results.length <= 0) {console.log('No hay resultados'); reject();}
                else{ resolve(results);}
            })
        }
    )
}


module.exports.tipo_componente = tipo_componente;
module.exports.existe_componente = existe_componente;
module.exports.actualizar_texto = actualizar_texto;

module.exports.registrar_componente_comun = registrar_componente_comun;

module.exports.registrar_componente_texto = registrar_componente_texto;
module.exports.registrar_componente_texto_orden = registrar_componente_texto_orden;

module.exports.registrar_componente_imagen = registrar_componente_imagen;
module.exports.registrar_componente_imagen_orden = registrar_componente_imagen_orden;

module.exports.registrar_componente_video = registrar_componente_video;
module.exports.registrar_componente_video_orden = registrar_componente_video_orden;

module.exports.registrar_componente_galeria = registrar_componente_galeria;
module.exports.registrar_componente_galeria_orden = registrar_componente_galeria_orden;

module.exports.registrar_componente_carusel = registrar_componente_carusel;
module.exports.registrar_componente_carusel_orden = registrar_componente_carusel_orden;

module.exports.registrar_componente_paginas = registrar_componente_paginas;

module.exports.registrar_componente = registrar_componente;

module.exports.obtiene_componente_texto = obtiene_componente_texto;
module.exports.obtiene_componentes = obtiene_componentes;

module.exports.eliminar_componente_texto = eliminar_componente_texto;
module.exports.eliminar_componente_imagen = eliminar_componente_imagen;
module.exports.eliminar_componente_video = eliminar_componente_video;
module.exports.eliminar_componente_galeria = eliminar_componente_galeria;
module.exports.eliminar_componente_paginas = eliminar_componente_paginas;
module.exports.eliminar_componente_carusel = eliminar_componente_carusel;

module.exports.decrementa_orden = decrementa_orden;
module.exports.incrementa_orden = incrementa_orden;
module.exports.obtiene_numero_componente = obtiene_numero_componente;
module.exports.obtiene_orden = obtiene_orden;

module.exports.obtiene_url_video = obtiene_url_video;

module.exports.obtener_ultimo_orden = obtener_ultimo_orden;

module.exports.add_pagina_componente = add_pagina_componente;
module.exports.remove_pagina_componente = remove_pagina_componente;
module.exports.obtener_paginas_componente = obtener_paginas_componente;

