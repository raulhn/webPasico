const fs = require('fs');
var docxConverter = require('docx-pdf');

const constantes = require('../constantes.js')

function subir_ficheros(fichero, nombre_imagen)
{
    return new Promise(
        (resolve, reject) =>
        {
            if(!fichero)
            {
                reject('Error al subir fichero');
                
            }
            else
            {
                let archivo = fichero.imagen;
                console.log(constantes.DIRECTORIO_IMAGENES + nombre_imagen);
                archivo.mv(constantes.DIRECTORIO_IMAGENES + nombre_imagen);

                resolve();
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


function convertir_pdf(path_entrada, path_salida)
{
    return new Promise(
        (resolve, reject) =>
        {
            docxConverter(path_entrada, path_salida,
                function(err,result){
                    if(err)
                    {
                        console.log(err);
                        reject(err)
                    }
                    else
                    {
                        resolve();
                    }
                }
        )
        }
)
}

module.exports.subir_ficheros = subir_ficheros;
module.exports.readFile = readFile;
module.exports.createFile  = createFile;