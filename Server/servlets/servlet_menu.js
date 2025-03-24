const servlet_comun = require('../servlets/servlet_comun.js')
const menu = require ('../logica/menu.js')


function add_menu(req, res)
{
    servlet_comun.comprobaciones_administrador_jwt(
        req, res,
        async () =>
        {
            let titulo = req.body.titulo;
            let padre = req.body.padre;
            let tipo_pagina = req.body.tipo_pagina;
            let enlace = req.body.enlace;

            await menu.registrar_menu(titulo, padre, tipo_pagina, enlace);
            res.status(200).send({error: false, message: 'Menu creado'})
        }
    )
}

async function obtener_menu(req, res)
{
    try
    {
        let id_menu = req.params.id;
        let resultado = await menu.obtiene_menu(id_menu);
        return res.status(200).send({error: false, padre: id_menu, data: resultado, message: 'Lista de menu'});
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({error: true, message: 'Error al obtener el menu'})
    }
}


async function obtener_titulo(req, res)
{
    try
    {
        let id_menu = req.params.id;

        let vTitulo = await menu.obtiene_titulo(id_menu);
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send({error: true, message: 'Error al obtener el titulo del menu'})
    }
}

async function eliminar_menu(req, res) 
{
    servlet_comun.comprobaciones_administrador_jwt(req, res,
        async () =>
        {
            let id_menu = req.body.id_menu;
            await menu.eliminar_menu(id_menu);
            res.status(200).send({error: false, message: 'Menu eliminado'})
        }
    )
}

async function actualizar_titulo_menu(req, res)
{
    servlet_comun.comprobaciones_administrador_jwt(req, res,
        async () =>
        {
            let id_menu = req.body.id_menu;
            let titulo = req.body.titulo;
            await menu.actualizar_titulo_menu(id_menu, titulo);
            res.status(200).send({error: false, message: 'Menu actualizado'})
        }
    )
}



module.exports.add_menu = add_menu;
module.exports.obtener_menu = obtener_menu;
module.exports.obtener_titulo = obtener_titulo;
module.exports.eliminar_menu = eliminar_menu;
module.exports.actualizar_titulo_menu = actualizar_titulo_menu;