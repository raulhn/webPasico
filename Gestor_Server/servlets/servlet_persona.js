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

    bResultado = await persona.registrar_persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif);
    return bResultado;
}



/**
 * Se comprueba que la persona a registrarse tiene un nif, y que esté no fue registrado con anterioridad,
 * si todo es correcto se registra a la persona como músico
 * @param {*} req Petición que se recibe
 * @param {*} res Respuesta que se enviará
 */
async function registrar_musico(req, res)
{
    const MSJ_ERROR = 'Error al registrar al músico'
    let nif = req.body.nif;
    let usuario = req.session.nombre;

    bExisteLogin = await gestion_usuarios.existe_login(usuario)

    // Quien realiza la petición está logueado en la aplicación, el nif no existe en la base de datos y el nif no es una cadena vacía //
    if (bExisteLogin && ! await persona.existe_nif(nif) && nif.length > 0)
    {

        bResultado = await registrar_persona(req, res)
        if (bResultado)
        {
            let nid = await persona.obtener_nid_persona(nif)
            if(await persona.asignar_tipo_persona(nid, constantes.TIPO_PERSONA_MUSCIO))
            {
                res.status(200).send({error: false, message: 'Se ha registrado al musico'})
            }
            else{
                res.status(400).send({error:true, message: MSJ_ERROR})
            }
        }
        else{
            res.status(400).send({error:true, message: MSJ_ERROR})
        }
    }
    else{
        res.status(400).send({error:true, message: MSJ_ERROR})
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
            resultados = await persona.obtener_persona(nid)
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

async function obtener_musicos(req, res)
{
    let usuario = req.session.nombre
    if(await gestion_usuarios.existe_login(usuario))
    {
        try{
            resultados = await persona.obtener_persona_tipo(constantes.TIPO_PERSONA_MUSICO)
            res.status(200).send({error:false, persona: resultados})
        }
        catch(e)
        {
            console.log(e)
            res.status(400).send({error: true, message: 'Se ha producido un error'})
        }
    }
    else{
        res.status(401).send({error: true, message: 'Usuario no autorizado'})
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

        if(nid.length > 1)
        {
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
module.exports.registrar_musico = registrar_musico
module.exports.actualizar_persona = actualizar_persona

module.exports.obtener_personas = obtener_personas
module.exports.obtener_persona = obtener_persona
module.exports.obtener_musicos = obtener_musicos