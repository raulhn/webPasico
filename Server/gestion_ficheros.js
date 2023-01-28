const constantes = require('./constantes.js');

//https://attacomsian.com/blog/uploading-files-nodejs-express
function subir_ficheros(fichero, nombre_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            
            try{

                if(!fichero)
                {
                    reject('Error al subir fichero');
                    
                }
                else{
                    let archivo = fichero.imagen;
                    console.log(constantes.RUTA_SUBIDAS + nombre_imagen);
                    archivo.mv(constantes.RUTA_SUBIDAS + nombre_imagen);

                resolve();
                }
            } catch(err)
            {
                console.log(err);
                reject(err);
                
            }
        }
    );
}

module.exports.subir_ficheros = subir_ficheros;
