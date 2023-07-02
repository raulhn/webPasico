const persona = require('../logica/persona.js')
const gestion_usuarios = require('../usuario.js')
const constantes = require('../constantes.js')

async function registrar_persona(req, res)
{
    let nif = req.body.nif;
    let nombre = req.body.nombre;
    let primer_apellido = req.body.primer_apellido;
    let segundo_apellido = req.body.segundo_apellido;
    let telefono = req.body.telefono;
    let fecha_nacimiento = req.body.fecha_nacimiento;

    let usuario = req.session.nombre;

    try
    {
        bExisteLogin = await gestion_usuarios.existe_login(usuario);
        if (bExisteLogin)
        {
            bResultado = await persona.registrar_persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif);
            if (bResultado)
            {
                res.status(200).send({error: false, message: 'Registro creado'});
            }
            else{
                res.status(400).send({error: true, message: 'Error al registrar la persona'})
            }
        }
        else{
            res.status(401).send({error: true, message: 'Usuario no autorizado'})
        }
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({error: true, message: error})
    }
}


async function obtener_personas(req, res)
{
    // Quien realiza la petición tiene que estar registrado como usuario
    let usuario = req.session.nombre
    if (await gestion_usuarios.existe_login(usuario))
    {
        try{
            resultados = await persona.obtener_personas();
            console.log
            res.status(200).send({error:false, personas: resultados})
        }
        catch(e)
        {
            console.log(e)
            res.status(400).send({error: true, message: e})
        }
    }
    else{
        res.status(401).send({error: true, message: 'Usuario no autorizado'})
    }
}

async function obtener_persona(req, res)
{
    let usuario = req.session.nombre
    if(await gestion_usuarios.existe_login(usuario))
    {
        let nid = req.params.nid
        try{
            resultados = await persona.obtener_persona(nid);
            res.status(200).send({error:false, persona: resultados})
        }
        catch(error)
        {
            console.log(error)
            res.status(400).send({error:true, message: 'Se ha producido un error en la consulta'})
        }
    }
    else{
        res.status(401).send({error:true, message: 'Usuario no autorizado'})
    }
}

async function actualizar_persona(req, res)
{
    let usuario = req.session.nombre
    if(await gestion_usuarios.existe_login(usuario))
    {
        let nid = req.body.nid
        let nif = req.body.nif
        let nombre = req.body.nombre
        let primer_apellido = req.body.primer_apellido
        let segundo_apellido = req.body.segundo_apellido
        let telefono = req.body.telefono
        let fecha_nacimiento = req.body.fecha_nacimiento

        console.log(nid !== undefined)
        if(nid !== undefined)
        {
            console.log('lanza actualizacion')
            bResultado = await persona.actualizar_persona(nid, nif, nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento);
            if(bResultado)
            {
                res.status(200).send({error: false, message: 'Se ha actualizado la persona de forma correcta'})
            }
            else{
                res.status(400).send({error:true, message: 'Se ha producido un error al actualizar'})
            }
        }
        else{
            res.status(400).send({error: true, message: 'Se ha producido un error al actualizar'})
        }
    }
}

module.exports.registrar_persona = registrar_persona
module.exports.actualizar_persona = actualizar_persona

module.exports.obtener_personas = obtener_personas
module.exports.obtener_persona = obtener_persona