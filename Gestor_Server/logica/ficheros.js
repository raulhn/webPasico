const fs = require('fs');

const constantes = require('../constantes.js')

function subir_ficheros(fichero, nombre_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            try
            {
                if(!fichero)
                {
                    reject('Error al subir fichero');
                }
                else
                {
                    let archivo = fichero.imagen;
                    archivo.mv(constantes.RUTA_SUBIDAS + nombre_imagen);

                    resolve();
                }
            }
            catch(e){
                reject(e)
            }
        }
    );
}


function createFile(fileName, content) {
  return new Promise(
    (resolve, reject) =>
    {
        fs.writeFile(fileName.toString(), content, (err) => {
            if (err) {
                console.error('Error al crear el archivo:', err);
                reject(err);
            } 
            else {
                 console.log('Archivo creado con éxito');
                 resolve();
            }
        });
    });
}


function readFile(fileName) {
  return new Promise(
    (resolve, reject) =>
    {
        fs.readFile(fileName.toString(), 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo:', err);
                reject(err);
            } 
            else {
              resolve(data);
            }
        });
    })
}




module.exports.subir_ficheros = subir_ficheros;
module.exports.readFile = readFile;
module.exports.createFile  = createFile;