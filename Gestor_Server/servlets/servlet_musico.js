const musico = require('../logica/musico.js')
const comun = require('./servlet_comun.js')

async function registrar_musico(req, res)
{
    let usuario = req.session.nombre;
    comun.comprobaciones(req, res, 
        async() =>
        {
            let nid_persona = req.body.nid_persona;
            let nid_instrumento = req.body.nid_instrumento;
            await musico.registrar_instrumento_persona(nid_persona, nid_instrumento);
            res.status(200).send({error: false, message: 'Se ha registrado correctamente'})
        }    
    )
}

async function eliminar_instrumento_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.body.nid_persona;
            let nid_instrumento = req.body.nid_instrumento;
            await musico.eliminar_instrumento_persona(nid_persona, nid_instrumento);
            res.status(200).send({error:false, message: 'Se ha eliminado correctamente'})
        }
    )
}

async function obtener_personas_instrumento(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_instrumento = req.params.nid_instrumento;
            resultado = await musico.obtener_personas_instrumento(nid_instrumento);
            res.status(200).send({error: false, personas: resultado})
        }
    );
}

module.exports.registrar_musico = registrar_musico;
module.exports.eliminar_instrumento_musico = eliminar_instrumento_persona;
module.exports.obtener_personas_instrumento = obtener_personas_instrumento;