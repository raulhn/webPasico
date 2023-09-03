
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

module.exports.comprobaciones = comprobaciones;