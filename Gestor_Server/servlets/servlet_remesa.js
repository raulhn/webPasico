const constantes = require('../constantes.js')
const comun = require('./servlet_comun.js')
const remesa = require('../logica/remesa.js')

function registrar_remesa_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid = req.body.nid;

            await remesa.registrar_remesa_persona(nid);
        }
    );
}


function obtener_remesas(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let fecha_desde = req.body.fecha_desde;
            let fecha_hasta = req.body.fecha_hasta;

            let remesas = await remesa.obtener_remesas(fecha_desde, fecha_hasta);

            res.status(200).send({error:false, remesas: remesas});
        }
        
    )
}

module.exports.registrar_remesa_persona = registrar_remesa_persona;
module.exports.obtener_remesas = obtener_remesas;