const constantes = require('../constantes.js');
const conexion = require('../conexion.js');
const ficheros = require('./ficheros.js')




function existe_imagen(id_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num from ' + constantes.ESQUEMA_BD + 
                   '.imagenes where nid_imagen = ' + conexion.dbConn.escape(id_imagen),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject(error)}
                    else {resolve(results[0]['num'] > 0)}
                }
            )

        }
    )
}

function registrar_imagen(fichero, nombre, id_imagen)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste_Imagen = await(existe_imagen(id_imagen));

            if(bExiste_Imagen)
            {
                
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        ficheros.subir_ficheros(fichero, nombre);
                    }
                );
                    
            }
        }
    )
}