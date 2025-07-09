const gestorTipoTablon = require("../logica/tipo_tablon")
const servlet_comun = require("./servlet_comun")
const constantes = require("../constantes")

async function insertarTipoTablon(req, res)
{
    try
    {
    const rolesPermitidos = [constantes.ADMINISTRADOR];
    let rolAdministrador = await servlet_comun.comprobarRol(req, res, rolesPermitidos);
    if (!rolAdministrador) {
        res.status(403).send({
            error: true,
            mensaje: "Acceso no autorizado"
        })
    }
    else
    {
        const descripcion = req.body.descripcion;

        const nidTipoTablon = await gestorTipoTablon.insertarTipoTablon(descripcion);

        res.status(200).send(
            {
                error: false,
                mensaje: "Insercción correcta"
            }
        )
    }
    }
    catch(error)
    {
        console.log("servlet_tipo_tablon.js -> insertarTipoTablon: ", error);
        res.status(500).send(
            {
                error:true,
                mensaje: "Se ha producido un error al insertar el tipo de tablón"
            }
        )
    }
}

async function actualizarTipoTablon(req, res)
{
    try
    {
        const rolesPermitidos = [constantes.ADMINISTRADOR];
        const bAdministrador = await servlet_comun.comprobarRol(req, rolesPermitidos);

        if(bAdministrador)
        {
        const nidTipoTablon = req.body.nid_tipo_tablon;
        const descripcion = req.body.descripcion;

        await gestorTipoTablon.actualizarTipoTablon(nidTipoTablon, descripcion);

        res.status(200).send(

            {
                error:false,
                mensaje: "Actualización correcta"
            }
        )
    }
    else
    {
        res.status(403).send({
            error: true,
            mensaje: "Acceso no autorizado"
        })
    }
    }
    catch(error)
    {
        console.log("servlet_tipo_tablon.js -> actualizarTipoTablon: ", error);
        res.status(500).send(
            {
                error:true,
                mensaje: "Se ha producido un error al actualizar el tipo de tablón"
            }
        )
    }
}

async function obtenerTiposTablon(req, res)
{
    try
    {
        const tipoTablones = await gestorTipoTablon.obtenerTiposTablon();

        res.status(200).send(
            {
                error: false,
                tipo_tablones: tipoTablones
            }
        )
    }
    catch(error)
    {
        console.log("servlet_tipo_tablon.js -> obtenerTiposTablon: ", error);
        res.status(500).send(
            {
                error: true,
                mensaje: "Se ha producido un error al consultar los tipos de tablones"
            }
        )
    }
}


module.exports.insertarTipoTablon = insertarTipoTablon;
module.exports.actualizarTipoTablon = actualizarTipoTablon;
module.exports.obtenerTiposTablon = obtenerTiposTablon;