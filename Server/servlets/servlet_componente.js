const componente = require('../componentes/componente.js');
const constantes = require('../constantes.js');
const componente_carusel = require('../componentes/componente_carusel.js');
const gestion_usuarios = require('../usuario.js')

const servlet_comun = require('./servlet_comun.js')
const servlet_componente_blog = require('./servlet_componente_blog.js')

async function registrar_componente_carusel(req, res)
{
    let id = req.body.id;
    let tipo_asociacion = req.body.tipo_asociacion;
    let elementos_simultaneos = req.body.elementos_simultaneos;

    bEsAdministrador = await gestion_usuarios.esAdministrador(req.session.nombre);
    if(bEsAdministrador)
    {
        try{
            if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
            {
                await componente.registrar_componente_carusel(id, tipo_asociacion, elementos_simultaneos);
                return res.status(200).send({error: false, message: 'Componente creado'})
            }
            else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
            {
                let nOrden = req.body.nOrden;
                await componente.registrar_componente_carusel_orden(id, tipo_asociacion, elementos_simultaneos, nOrden);
                return res.status(200).send({error: false, message: 'Componente creado'})
            } 
        }
        catch(e)
        {
            return res.status(400).send({error: true, message: 'Error al registrar el componente de carrusel'});
        }
    }
    else{
        return res.status(400).send({error: true, message: 'Error al registrar el componente de carrusel'});
    }
}

async function obtener_componente_carusel(req, res)
{
    let id_componente = req.params.id_componente;
    try{
        resultado_carusel = await componente_carusel.obtener_componente_carusel(id_componente);
        elementos_carusel = await componente_carusel.obtener_elementos_carusel(id_componente);
        return res.status(200).send({error: false, componente_carusel: resultado_carusel, elementos_carusel: elementos_carusel});
    }
    catch(error)
    {
        return res.status(400).send({error: true, message: 'Error al obtener el componente carusel'});
    }
}

async function add_imagen_carusel(req, res)
{
    let id_componente = req.body.id_componente;
    let titulo = req.body.titulo;
    let fichero = req.files;

    try{
        bEsAdministrador = await gestion_usuarios.esAdministrador(req.session.nombre);
        if(bEsAdministrador)
        {
            await componente_carusel.add_elemento_carusel(id_componente, titulo, fichero);
            return res.status(200).send({error: false, message: 'Se ha registado el nuevo elemento'})
        }
        else{
            return res.status(400).send({error: true, message: 'Error al incluir el elemento al carrusel'})
        }
    }
    catch(error)
    {
        return res.status(400).send({error: true, message: 'Error al incluir el elemento al carrusel'})
    }
}

async function eliminar_imagen_carusel(req, res)
{
    let id_componente = req.body.id_componente;
    let id_imagen = req.body.id_imagen;
    try{
        bEsAdministrador = await gestion_usuarios.esAdministrador(req.session.nombre);
        if(bEsAdministrador)
        {
            await componente_carusel.eliminar_imagen_carusel(id_componente, id_imagen);
            return res.status(200).send({error: false, message: 'Elemento eliminado'});
        }
        else{
            return res.status(400).send({error: true, message: 'Error al eliminar el elemento'})
        }
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).send({error: true, message: 'Error al eliminar al elemento'})
    }
}

async function actualizar_elementos_simultaneos(req, res)
{
    let id_componente = req.body.id_componente;
    let num_elementos = req.body.num_elementos;
    try{
        bEsAdministrador = await gestion_usuarios.esAdministrador(req.session.nombre);
        if (bEsAdministrador)
        {
            await componente_carusel.actualiza_elementos_simultaneos(id_componente, num_elementos);
            return res.status(200).send({error:false, message:'Componente actualizado'});
        }
        else{
            return res.status(400).send({error: true, message: 'Error al actualizar'})
        }
    }
    catch(error)
    {
        console.log(error); 
        return res.status(400).send({error:true, message: 'No se ha podido realizar la actualizacion'})
    }
}

function registrar_componente(req, res)
{
    servlet_comun.comprobaciones_administrador_jwt(req, res,
        async() =>
        {
            let id = req.body.id;
            let tipo_componente = req.body.tipo_componente;
            let tipo_asociacion = req.body.tipo_asociacion;

            if (tipo_componente == constantes.TIPO_COMPONENTE_TEXTO)
            {  
                if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                {
                    console.log('-- registrar_componente_texto --');
                    await componente.registrar_componente_texto(id, tipo_asociacion);
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
                else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                {
                    let nOrden = req.body.nOrden;
                    console.log('-- registrar_componente_texto_orden -- ' + nOrden);
                    await componente.registrar_componente_texto_orden(id, tipo_asociacion, nOrden)
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
            }
            else if(tipo_componente == constantes.TIPO_COMPONENTE_IMAGEN)
            {
                console.log('Registrar Imagen');
                let titulo = req.body.titulo;

                if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                {
                    await componente.registrar_componente_imagen(id, titulo, tipo_asociacion);
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
                else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                {
                    let nOrden = req.body.nOrden;
                    await componente.registrar_componente_imagen_orden(id, titulo, tipo_asociacion, nOrden);
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
            } 
            else if(tipo_componente == constantes.TIPO_COMPONENTE_VIDEO)
            {
                console.log('Registrar Video');
                let url = req.body.url;

                if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                {
                    await componente.registrar_componente_video(id, url, tipo_asociacion);
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
                else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                {
                    let nOrden = req.body.nOrden;
                    await componente.registrar_componente_video_orden(id, url, tipo_asociacion, nOrden);
                    return res.status(200).send({error: false, message:'Componente creado'});
                } 
            }
            else if(tipo_componente == constantes.TIPO_COMPONENTE_GALERIA)
            {
                console.log('Registrar Galeria');

                let titulo = req.body.titulo;
                let descripcion = req.body.descripcion;

                if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                { 
                    await componente.registrar_componente_galeria(id, titulo, descripcion, tipo_asociacion)
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
                else if(tipo_asociacion == constantes.TIPO_ASOCIACION_COMPONENTE)
                {
                    let nOrden = req.body.nOrden;
                    await componente.registrar_componente_galeria_orden(id, titulo, descripcion, tipo_asociacion, nOrden);
                    return res.status(200).send({error: false, message:'Componente creado'});
                } 
            }
            else if(tipo_componente == constantes.TIPO_COMPONENTE_COMPONENTES)
            {
                let nColumnas = req.body.nColumnas;

                if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                {
                    await componente_componentes.insertar_componente_componentes(id, nColumnas, tipo_asociacion);
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
                else
                {
                    return res.status(400).send({error: true, message:'Operación no permitida'});
                }
            }
            else if(tipo_componente == constantes.TIPO_COMPONENTE_PAGINAS)
            {
                if(tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA)
                {
                    let titulo = req.body.titulo;
                    console.log('Registrar componente páginas')
                    await componente.registrar_componente_paginas(id, titulo, tipo_asociacion);
                    return res.status(200).send({error: false, message:'Componente creado'});
                }
                else
                {
                    return res.status(400).send({error: true, message:'Operación no permitida'});
                }
            }
            else if(tipo_componente == constantes.TIPO_COMPONENTE_CARUSEL)
            {
                console.log('Registrar componente Carrusel')
                registrar_componente_carusel(req, res);
            }
            else if(tipo_componente == constantes.TIPO_COMPONENTE_BLOG)
            {
                console.log('Registrar componente blog')
                servlet_componente_blog.registrar_componente_blog(req, res);
            }
            
        }
    );         

}

module.exports.registrar_componente_carusel = registrar_componente_carusel;
module.exports.obtener_componente_carusel = obtener_componente_carusel;
module.exports.add_imagen_carusel = add_imagen_carusel;
module.exports.eliminar_imagen_carusel = eliminar_imagen_carusel;
module.exports.actualizar_elementos_simultaneos = actualizar_elementos_simultaneos;

module.exports.registrar_componente = registrar_componente; 