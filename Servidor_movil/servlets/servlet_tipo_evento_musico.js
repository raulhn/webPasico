const gestor_tipo_evento_musico = require("../logica/tipo_evento_musico")

async function registrar_tipo_evento_musico(req, res)
{
    try
    {
        let nid_evento_concierto = req.body.nid_evento_concierto;
        let nid_tipo_musico = req.body.nid_tipo_musico;

        await gestor_tipo_evento_musico.registrar_tipo_evento_musico(
            nid_evento_concierto,
            nid_evento_concierto
        );

       res.status(200).send({error: false, mensaje: "Tipo de evento registrado"})
    }
    catch(e)
    {
        console.log("servlet_tipo_evento_musico -> registrar_tipo_evento_musico: " + e);
        res.status(400).send({error: true, mensaje: "Se ha producido un error durante el registro del tipo de evento"})
    }
}

async function obtener_tipos_evento(req, res)
{
    try
    {
        let nid_evento_concierto = req.params.nid_evento_concierto;

        let tipos_evento = await gestor_tipo_evento_musico.obtener_tipos_evento(
            nid_evento_concierto
        )

        res.status(200).send({error:false, mensaje: "Tipos de eventos obtenidos", tipos_evento: tipos_evento})
    }
    catch(e)
    {
        console.log("servlet_tipo_evento_musico -> obtener_tipos_evento: " + e)
        res.status(400).send({error: true, mensaje: "Se ha producido un error al obtener los tipos del evento"})
    }
}

async function eliminar_tipo_evento_musico(req, res)
{
    try
    {
        let nid_evento_concierto = req.body.nid_evento_concierto;
        let nid_tipo_musico = req.body.nid_tipo_musico;

        await gestor_tipo_evento_musico.eliminar_tipo_evento_musico(nid_evento_concierto, nid_tipo_musico);

        res.status(200).send({error: false, mensaje: "Se ha eliminado el tipo de evento"});
    }
    catch(e)
    {
        console.log("servlet_tipo_evento_musico -> eliminar_tipo_evento_musico: " + e);
        res.status(400).send({error: true, mensaje: "Se ha producido un error al eliminar el tipo de evento"})
    }
}

module.exports.registrar_tipo_evento_musico = registrar_tipo_evento_musico;
module.exports.obtener_tipos_evento = obtener_tipos_evento;
module.exports.eliminar_tipo_evento_musico = eliminar_tipo_evento_musico;