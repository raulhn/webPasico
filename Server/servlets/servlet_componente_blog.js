const componente = require('../componente.js');
const constantes = require('../constantes.js');
const componente_blog = require('../componentes/componente_blog.js');
const usuario = require('../usuario.js')


async function registrar_componente_blog(req, res)
{
    let id = req.body.id;
    let tipo_asociacion = req.body.tipo_asociacion;
    let nOrden;

    try{
        if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
        {
            nOrden = await componente.obtener_ultimo_orden(id);
        }
        else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
        {
            return res.status(400).send({error: true, message: 'No permitido'})
        } 
        let id_componente = await componente.registrar_componente_comun(constantes.TIPO_COMPONENTE_BLOG, id, tipo_asociacion, nOrden);
        return res.status(200).send({error: false, message: 'Se ha registrado el componente'})
    }
    catch(e)
    {
        return res.status(400).send({error: true, message: 'Error al registrar el componente de blog'});
    }
}

async function add_elemento_blog(req, res)
{
    let titulo = req.body.titulo;
    let fecha = req.body.fecha;
    let fichero = req.files
    let id_componente = req.body.id_componente;
    let descripcion = req.body.descripcion;

    try{
        bAdministrador = usuario.esAdministrador(req.session.nombre);
        if(bAdministrador)
        {
            await componente_blog.add_componente_blog(id_componente, titulo, fecha, fichero, descripcion);
        }
        else{
            return res.status(400).send({error: false, message: 'Error al registrar el componente de blog'})
        }
    }
    catch(error)
    {
        return res.status(400).send({error: true, message: 'Error al registrar el componente de blog'})
    }

}


async function obtener_componente_blog(req, res)
{
    let id_componente = req.params.id_componente;
    try
    {
        let resultado = await componente_blog.obtener_componente_blog(id_componente);
        return res.status(200).send({error: false, componente_blog: resultado})
    }
    catch(error)
    {
        console.log(error);
        return res.status(400).send({error: true, message: 'Error al obtener el componente'})
    }
}

function eliminar_componente_blog(id_pagina, id_componente, tipo_asociacion)
{
    return new Promise(
        async (resolve, reject) =>
        {
            try{
                await componente_blog.eliminar_componente_blog(id_pagina, id_componente, tipo_asociacion)
                resolve();
            }
            catch(e)
            {
               reject();
            }
        }
    )
}

module.exports.registrar_componente_blog = registrar_componente_blog;
module.exports.add_elemento_blog = add_elemento_blog;
module.exports.obtener_componente_blog = obtener_componente_blog;
module.exports.eliminar_componente_blog = eliminar_componente_blog;