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

function obtener_mensualidad(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_matricula = req.params.nid_matricula;

            console.log('Matricula ' + nid_matricula)
            let v_resumen_matricula = await remesa.obtener_precio_matricula(nid_matricula);

            res.status(200).send({erro:false, resumen_mensualidad: v_resumen_matricula})
        }
        
    )
}

module.exports.registrar_remesa_persona = registrar_remesa_persona;
module.exports.obtener_remesas = obtener_remesas;
module.exports.obtener_mensualidad = obtener_mensualidad;