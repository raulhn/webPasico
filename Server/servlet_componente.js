const componente = require('./componente.js');
const constantes = require('./constantes.js');
const componente_carusel = require('./componentes/componente_carusel.js');

async function registrar_componente_carusel(req, res)
{
    let id = req.body.id;
    let tipo_asociacion = req.body.tipo_asociacion;
    let elementos_simultaneos = req.body.elementos_simultaneos;

    try{
        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
        {
            await componente.registrar_componente_carusel(id, elementos_simultaneos, tipo_asociacion);
            return res.status(200).send({error: false, message: 'Componente creado'})
        }
        else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
        {
            let nOrden = req.body.nOrden;
            await componente.registrar_componente_carusel_orden(id, tipo_asociacion, elementos_simultaneos, nOrden);
            return res.status(200).send({error: false, message: 'Componente creado'})
        } 
    }
    catch(e)
    {
        return res.status(400).send({error: true, message: 'Error al registrar el componente de carrusel'});
    }
}

async function obtener_componente_carusel(req, res)
{
    let id_componente = req.params.id_componente;
    try{
        console.log('Obteniendo componente carusel');
        resultado_carusel = await componente_carusel.obtener_componente_carusel(id_componente);
        console.log('Obteniendo elementos carusel')
        elementos_carusel = await componente_carusel.obtener_elementos_carusel(id_componente);
        return res.status(200).send({error: false, componente_carusel: resultado_carusel, elementos_carusel: elementos_carusel});
    }
    catch(error)
    {
        console.log('Error ' + error)
        return res.status(400).send({error: true, message: 'Error al obtener el componente carusel: ' + error});
    }
}

module.exports.registrar_componente_carusel = registrar_componente_carusel;
module.exports.obtener_componente_carusel = obtener_componente_carusel;