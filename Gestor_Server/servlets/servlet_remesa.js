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

            res.status(200).send({error:false, message: 'Registra remesa'})
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
            let v_resumen_matricula = await remesa.obtener_precio_matricula(nid_matricula);

            res.status(200).send({error:false, resumen_mensualidad: v_resumen_matricula})
        }
        
    )
}


function obtener_remesa(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let lote = req.params.lote;
            let remesas = await remesa.obtener_remesa(lote);
            
            res.status(200).send({error:false, remesas: remesas})
        }
        
    )
}


function obtener_lineas_remesa(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_remesa = req.params.nid_remesa;
            
            let lineas_remesa = await remesa.obtener_lineas_remesa(nid_remesa);

            res.status(200).send({error: false, lineas_remesa: lineas_remesa})
        }
        
    )
}

function obtener_descuentos_remesa(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_remesa = req.params.nid_remesa;

            let descuentos = await remesa.obtener_descuentos_remesa(nid_remesa);

            res.status(200).send({error: false, descuentos_remesa: descuentos})
        }
    )
}

function obtener_ultimo_lote(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let ultimo_lote = await remesa.obtener_ultimo_lote();

            res.status(200).send({error:false, ultimo_lote: ultimo_lote})
        }
        
    )
}


function obtener_remesa_nid(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_remesa = req.params.nid_remesa;
            
            let remesa_recuperada = await remesa.obtener_remesa_nid(nid_remesa)

            res.status(200).send({error:false, remesa: remesa_recuperada})
        }
    )
}

function aprobar_remesa(req, res)
{
    comun.comprobaciones(req, res,
       async () =>
       {
          let nid_remesa = req.body.nid_remesa;

          await remesa.aprobar_remesa(nid_remesa);
       } 
    )
}

function rechazar_remesa(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_remesa = req.body.nid_remesa;
            await remesa.rechazar_remesa(nid_remesa)
        }   
    )
}

function aprobar_remesas(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let lote = req.body.lote;
            await remesa.aprobar_remesas(lote);
        }
    )
}

module.exports.registrar_remesa_persona = registrar_remesa_persona;
module.exports.obtener_remesas = obtener_remesas;
module.exports.obtener_mensualidad = obtener_mensualidad;

module.exports.obtener_remesa = obtener_remesa;
module.exports.obtener_lineas_remesa = obtener_lineas_remesa;
module.exports.obtener_descuentos_remesa = obtener_descuentos_remesa;
module.exports.obtener_remesa_nid = obtener_remesa_nid;

module.exports.obtener_ultimo_lote = obtener_ultimo_lote;

module.exports.rechazar_remesa = rechazar_remesa;
module.exports.aprobar_remesa = aprobar_remesa;
module.exports.aprobar_remesas = aprobar_remesas;