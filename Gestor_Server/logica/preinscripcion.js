const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function obtener_preinscripciones()
{
    return new Promise(
        (resolve, reject) =>
        {
            try
            {
                let API_URL = constantes.URL_WEB + 'api/obtener_preinscripciones';
                fetch(API_URL, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.API_KEY
                    }})
                    .then(async (response) => 
                        {
                            let respuesta = await response.json()
                            resolve(respuesta.preinscripciones)
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


function obtener_preinscripciones_detalle(nid_preinscripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            try
            {
                let API_URL = constantes.URL_WEB + 'api/obtener_preinscripciones_detalle/' + nid_preinscripcion;

                fetch(API_URL, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.API_KEY
                    }})
                    .then(async (response) => 
                        {
                            let respuesta = await response.json()
                            resolve(respuesta.preinscripciones)
                    } )
            }
            catch (error)
            {
                console.log('preinscripcion.js - obtener_preinscripciones_detalle -> ' + error);
                reject('Error en obtener_preinscripciones_detalle');
            }
        }
    )
}

module.exports.obtener_preinscripciones = obtener_preinscripciones;
module.exports.obtener_preinscripciones_detalle = obtener_preinscripciones_detalle;
