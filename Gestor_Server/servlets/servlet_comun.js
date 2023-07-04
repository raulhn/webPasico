const gestion_usuarios = require('../logica/usuario.js')

async function comprobaciones(req, res, funcion_especifica)
{
    let usuario = req.session.nombre;
    if(await gestion_usuarios.existe_login(usuario))
    {
        try{
            funcion_especifica(req, res);
        }
        catch(error)
        {
            res.status(400).send({error: true, message: 'Se ha producido un error', info: error})
        }
    }
    else{
        res.status(401).send({error: true, message: 'No está autorizado'});
    }
}

module.exports.comprobaciones = comprobaciones;