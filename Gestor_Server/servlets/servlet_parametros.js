const parametros = require('../logica/parametros')
const comun = require('./servlet_comun')


function obtener_valor(req, res)
{
    comun.comprobaciones(req, res, 
        async () =>
        {
            let nombre = req.params.nombre;

            let valor = await parametros.obtener_valor(nombre);
            
            res.status(200).send({error: false, valor: valor});
        }
    )
}

function actualizar_valor(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nombre = req.body.nombre;
            let valor = req.body.valor;

            await parametros.actualizar_valor(nombre, valor);

            res.status(200).send({error: false, mensaje: 'Se ha realizado la actualización de forma correcta'})
        }
        
        
    )
}

module.exports.obtener_valor = obtener_valor;
module.exports.actualizar_valor = actualizar_valor;