const direccion = require('../logica/direccion.js')
const comun = require('./servlet_comun.js')

function registrar_direccion(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let domicilio = req.body.direcion;
            let municipio = req.body.municipio;
            let provincia = req.body.provincia;
            let codigo_postal = req.body.codigo_postal;
            let numero = req.body.numero;
            let puerta = req.body.puerta;
            let escalera = req.body.escalera;

            let nid_persona = req.body.nid_persona;
            await direccion.registrar_direccion(nid_persona, domicilio, municipio, provincia, codigo_postal, numero, puerta, escalera);

            res.status(200).send({error:false, message: 'Direccion registrada'});
        }
    )
}

function obtener_direccion(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.params.nid_persona;

            let resultado = await direccion.obtener_direccion(nid_persona);

            res.status(200).send({error:false, direccion: resultado});
        }
    )
}

module.exports.registrar_direccion = registrar_direccion;
module.exports.obtener_direccion = obtener_direccion;