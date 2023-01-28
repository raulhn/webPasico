const constantes = require('./constantes.js');
const conexion = require('./conexion.js');
const gestion_ficheros = require('./gestion_ficheros.js');

function obtiene_id_imagen(id_componente_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query(
                "select nid_imagen from " + constantes.ESQUEMA_BD + ".componente_imagen where nid_componente = " +  conexion.dbConn.escape(id_componente_imagen),
                (error, results, fields) =>
                {
                    if(error) resolve("-1");
                    else if (results.length < 1) resolve("-1");
                    else resolve(results[0]['nid_imagen']);
                }
            );
        }
    );
}

function obtiene_ruta_imagen(id_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            console.log(id_imagen);
            conexion.dbConn.query(
                "select ruta_servidor from " + constantes.ESQUEMA_BD + ".imagen where nid = " +  conexion.dbConn.escape(id_imagen),
                (error, results, fields) =>
                {
                    console.log(results);
                    if(error) {resolve(constantes.IMAGEN_NO_ENCONTRADA);}
                    else if(results.length < 1) {resolve(constantes.IMAGEN_NO_ENCONTRADA);}
                    else if(results[0]['ruta_servidor'] == null) {resolve(constantes.IMAGEN_NO_ENCONTRADA);}
                    else resolve(results[0]['ruta_servidor']);
                }
            );
        }
    );
}

function eliminar_imagen(id_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + "imagen where nid = " + conexion.dbConn.escape(id_imagen),
                        (error, results, fields) =>
                        {
                            if (error) { console.log(error); conexion.dbConn.rollback(); reject();}
                            else{
                                conexion.dbConn.commit(); resolve();
                            }
                        }
                    );
                }

            )
        }

    )
}

function actualizar_imagen_servidor(id_imagen, fichero)
{
    return new Promise(
        (resolve, reject) =>
        {
    let imagen = fichero.imagen;
    let nombre_imagen = id_imagen + "_" + imagen.name;

   
    conexion.dbConn.query("update " +  constantes.ESQUEMA_BD + ".imagen set ruta_servidor = " + 
            conexion.dbConn.escape(constantes.RUTA_SUBIDAS  + nombre_imagen) + " where nid = " +  conexion.dbConn.escape(id_imagen), 
    (error, results, field) =>
    {
        if(error) {console.log(error); conexion.dbConn.rollback(); reject(error);}
        else{
           
            gestion_ficheros.subir_ficheros(fichero, nombre_imagen).then(
            () => { conexion.dbConn.commit(); resolve();}
            ).catch(
              
                (error) => {console.log(error); conexion.dbConn.rollback(); reject(error);}
            )
        }
    }); 
}); 
}

function actualizar_imagen(id_componente_imagen, fichero)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    obtiene_id_imagen(id_componente_imagen).then(
                        (id_imagen) =>
                        {
                            actualizar_imagen_servidor(id_imagen, fichero).then(
                                () => {resolve();}
                            ).catch(
                                () => {reject();}
                            );
                        }
                    );
                }
            );
        }
    );

}

function subir_imagen(titulo, fichero)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    let imagen = fichero.imagen;
                    conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".imagen(titulo) values(" +
                        conexion.dbConn.escape(titulo) + ")", 
                    (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject(error);}
                        else
                        {
                            id_imagen = results.insertId;
                          
                            actualizar_imagen_servidor(id_imagen, fichero).then(
                                () => { conexion.dbConn.commit(); resolve(id_imagen); }
                            ).catch(
                                () => { conexion.dbConn.rollback(); reject(); }
                            );
                        }
                    }  
                    );
                });
        }
    )

}

module.exports.actualizar_imagen = actualizar_imagen;
module.exports.obtiene_id_imagen = obtiene_id_imagen;
module.exports.obtiene_ruta_imagen = obtiene_ruta_imagen;
module.exports.subir_imagen = subir_imagen;
module.exports.eliminar_imagen = eliminar_imagen;