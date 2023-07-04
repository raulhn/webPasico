const persona = require('../logica/persona.js')
const gestion_usuarios = require('../logica/usuario.js')
const musico = require('../logica/musico.js')
const constantes = require('../constantes.js')
const comun = require('./servlet_comun.js')

async function registrar_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nif = req.body.nif;
            let nombre = req.body.nombre;
            let primer_apellido = req.body.primer_apellido;
            let segundo_apellido = req.body.segundo_apellido;
            let telefono = req.body.telefono;
            let fecha_nacimiento = req.body.fecha_nacimiento;

            bResultado = await persona.registrar_persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif);
            if (bResultado)
            {
                res.status(200).send({error: false, message: 'Registro creado'});
            }
            else{
                res.status(400).send({error: true, message: 'Error al registrar la persona'})
            }
        }
    )
}


async function obtener_personas(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            resultados = await persona.obtener_personas();
            res.status(200).send({error:false, personas: resultados})
        }
    )
}

async function obtener_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            resultados = await persona.obtener_persona(nid);
            res.status(200).send({error:false, persona: resultados})
        }
    )
}

async function actualizar_persona(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid = req.body.nid
            let nif = req.body.nif
            let nombre = req.body.nombre
            let primer_apellido = req.body.primer_apellido
            let segundo_apellido = req.body.segundo_apellido
            let telefono = req.body.telefono
            let fecha_nacimiento = req.body.fecha_nacimiento

            bResultado = await persona.actualizar_persona(nid, nif, nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento);
            if(bResultado)
            {
                res.status(200).send({error: false, message: 'Se ha actualizado la persona de forma correcta'})
            }
            else{
                res.status(400).send({error:true, message: 'Se ha producido un error al actualizar'})
            }
        }
    )
}


async function obtener_ficha_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona =  req.params.nid_persona;
            resultado_persona = await persona.obtener_persona(nid_persona);
            resultado_instrumentos = await musico.obtener_instrumentos_persona(nid_persona);
            res.status(200).send({error:false, persona: resultado_persona, instrumentos: resultado_instrumentos})
        }
    )
}

module.exports.registrar_persona = registrar_persona
module.exports.actualizar_persona = actualizar_persona

module.exports.obtener_personas = obtener_personas
module.exports.obtener_persona = obtener_persona

module.exports.obtener_ficha_persona = obtener_ficha_persona