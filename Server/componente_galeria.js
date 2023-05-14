const constantes = require('./constantes.js');
const conexion = require('./conexion.js');
const componente = require('./componente.js');
const imagen = require('./imagen.js');



function add_imagen_galeria(id_componente, titulo, fichero)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
            () =>
            {
                imagen.subir_imagen(titulo, fichero).then(
                    (id_imagen) =>
                    {
                        console.log('Galeria ' + id_imagen)
                        conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".galeria_imagen(nid_componente, nid_imagen) values(" +
                            conexion.dbConn.escape(id_componente) + ", " + conexion.dbConn.escape(id_imagen) + ")",
                        
                        (error, results, field) =>
                        {
                            if (error) { console.log(error); conexion.dbConn.rollback(); reject(); }
                            else{
                                conexion.dbConn.commit();
                                resolve();
                            }
                        }
                        );
                    }
                ).catch(
                    () => { conexion.dbConn.rollback(); reject(); }
                )
            }
            );
        }
    );
}

function eliminar_imagen_galeria(id_componente, id_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".galeria_imagen where nid_componente = " +
                      conexion.dbConn.escape(id_componente) + " and nid_imagen = " + conexion.dbConn.escape(id_imagen),
                      
                      (error, results, field) =>
                      {
                        if(error) { console.log(error); conexion.dbConn.rollback(); reject(); }
                        else{
                            conexion.dbConn.commit(); resolve();
                        }
                      })
                }
            )
        }
    )

}

function obtiene_imagenes_galeria(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select nid_imagen  from " + constantes.ESQUEMA_BD + ".galeria_imagen where nid_componente = " + conexion.dbConn.escape(id_componente),
              (error, results, field) =>
              {
                if(error) {console.log(error); reject();}
                else{
                    resolve(results);
                }
              }

            );
        }
    )
}



module.exports.add_imagen_galeria = add_imagen_galeria;
module.exports.eliminar_imagen_galeria = eliminar_imagen_galeria;
module.exports.obtiene_imagenes_galeria =  obtiene_imagenes_galeria;