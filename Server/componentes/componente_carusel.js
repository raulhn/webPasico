const constantes = require('../constantes.js');
const conexion = require('../conexion.js');
const componente = require('./componente.js');
const imagen = require('../imagen.js');

function obtener_elementos_carusel(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.elemento_carusel where nid_componente = ' + 
                                  conexion.dbConn.escape(id_componente),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results);}
                }
            )
        }
    )
}

function obtener_componente_carusel(id_componente)
{
    return new Promise(
        async (resolve, reject) =>
        {
          bExiste = await componente.existe_componente(id_componente);
          if(!bExiste)
          {
            reject();
          }
          else{
            conexion.dbConn.query('select nid_componente, elementos_simultaneos from ' + constantes.ESQUEMA_BD + '.componente_carusel where nid_componente = ' +
                                 conexion.dbConn.escape(id_componente),
                (error, results, fields) =>
                {
                    if(error) {console.log('error'); console.log(error); reject();}
                    else{console.log('resolve'); resolve(results);}
                }              
                )
          }
        }
    )
}

function add_elemento_carusel(nid_componente, titulo, fichero)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                async () =>
                {
                    try
                    {
                        let nid_imagen = await imagen.subir_imagen(titulo, fichero);
                        conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".elemento_carusel(nid_componente, nid_imagen) values (" +
                            conexion.dbConn.escape(nid_componente) + ", " + conexion.dbConn.escape(nid_imagen) + ")",
                          (error, results, fields) =>
                          {
                            if(error) {console.log('Error: ' + error); reject();}
                            else{
                                conexion.dbConn.commit();
                                resolve();
                            }
                          }
                        );
                    }
                    catch(e)
                    {
                        console.log(e)
                        reject();
                    }
                }
            )
        }
    )
}

function actualiza_elementos_simultaneos(nid_componente, elementos_simultaneos)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".componente_carusel set elementos_simultaneos = " +
                            conexion.dbConn.escape(elementos_simultaneos) + " where nid_componente = " + conexion.dbConn.escape(nid_componente), 
                        (error, results, fields) =>
                        {
                            if(error){console.log(error); reject();}
                            else{
                                resolve();
                            }
                        }
                    )
                }
            )
        }
    )
}

function eliminar_imagen_carusel(id_componente, id_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {          
                    conexion.dbConn.query("delete from " +  constantes.ESQUEMA_BD + ".elemento_carusel where nid_componente = " +
                            conexion.dbConn.escape(id_componente) + " and nid_imagen = " + conexion.dbConn.escape(id_imagen),
                        (error, results, fields) =>
                        {
                            if(error) {console.log('Error ' + error); conexion.dbConn.rollback(); reject();}
                            else{
                                conexion.dbConn.commit();
                                console.log('Elemento eliminado');
                                resolve();
                            }
                        }   
                    ) 
                }
                )
            }
    )
}


module.exports.obtener_elementos_carusel = obtener_elementos_carusel;
module.exports.obtener_componente_carusel = obtener_componente_carusel;
module.exports.add_elemento_carusel = add_elemento_carusel;
module.exports.actualiza_elementos_simultaneos = actualiza_elementos_simultaneos;
module.exports.eliminar_imagen_carusel = eliminar_imagen_carusel;