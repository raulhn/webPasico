const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function obtener_preinscripciones()
{
    return new Promise(
        (resolve, reject) =>
        {
            try
            {
                let API_URL = 'https://ladelpasico.es/api/obtener_preinscripciones';
                console.log(process.env.API_KEY)
                fetch(API_URL, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'API_KEY': process.env.API_KEY
                    }})
                    .then(response => 
                        {
                            console.log(response)
                            resolve(response.preinscripciones)
                    } )
            }
            catch (error)
            {
                console.log('preinscripcion.js - obtener_preinscripciones -> ' + error);
                reject('Error en obtener_preinscripciones');
            }
        }
    )
}

module.exports.obtener_preinscripciones = obtener_preinscripciones;