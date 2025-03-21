const gestion_usuarios = require('../usuario.js')

async function comprobaciones(req, res, funcion_especifica)
{
    try{
        await funcion_especifica();
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({error: true, message: 'Se ha producido un error', info: error})
    }
}

async function comprobaciones_login(req, res, funcion_especifica)
{
    if (await gestion_usuarios.esAdministrador(req.session.nombre))
    {
        console.log(req.session.nombre)
        try{
            await funcion_especifica();
        }
        catch(error)
        {
            console.log(error);
            res.status(400).send({error: true, message: 'Se ha producido un error', info: error})
        }
    }
    else{
        res.status(404).send({error: true, message: 'No autorizado'})
    }
}

function comprobaciones_api(req, res, funcion_especifica)
{
    try{
        let api_key_solicitud = req.api_key;
        console.log(req.headers);
        console.log(req.headers.api_key);
        console.log(api_key_solicitud);
        console.log(process.env.API_KEY);
        if(api_key_solicitud == process.env.API_KEY)
        {
            funcion_especifica();
        }
        else
        {
            res.status(404).send({error: true, message: 'No autorizado'})
        }
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({error: true, message: 'Se ha producido un error', info: error})
    }
}

module.exports.comprobaciones = comprobaciones;
module.exports.comprobaciones_login = comprobaciones_login;
module.exports.comprobaciones_api = comprobaciones_api;