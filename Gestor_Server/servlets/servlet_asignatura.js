const asignatura = require('../logica/asignatura.js')
const comun = require('./servlet_comun.js')

function registrar_asignatura(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let descripcion = req.body.descripcion;

            await asignatura.registrar_asignatura(descripcion);
            res.status(200).send({error: false, message: 'Asignatura registrada'});
        }
    )
}

function actualizar_asignatura(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let descripcion = req.body.descripcion;
            let nid_asignatura = req.body.nid_asignatura;

            await asignatura.actualizar_asignatura(nid_asignatura, descripcion);
            res.status(200).send({error:false, message: 'Asignatura actualizada'});
        }
    )
}

function eliminar_asignatura(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_asignatura = req.body.nid_asignatura;

            await asignatura.eliminar_asignatura(nid_asignatura);
            res.status(200).send({error:false, message: 'Asignatura eliminada'});
        }
    )
}

function obtener_asignaturas(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            resultado_asignaturas = await asignatura.obtener_asignaturas();
            res.status(200).send({error:false, asignaturas: resultado_asignaturas});
        }
    )
}

function obtener_asignatura(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_asignatura = req.params.nid_asignatura;

            resultado = await asignatura.obtener_asignatura(nid_asignatura);
            res.status(200).send({error:false, asignatura: resultado})
        }
    )
}

function add_profesor(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.body.nid_persona;
            let nid_asignatura = req.body.nid_asignatura;

            await asignatura.add_profesor(nid_asignatura, nid_persona);
            res.status(200).send({error: false, message: 'Se ha registrado el profesor'});
        } 
    )
}

function eliminar_profesor(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.body.nid_persona;
            let nid_asignatura = req.body.nid_asignatura;

            await asignatura.eliminar_profesor(nid_asignatura, nid_persona);
            res.status(200).send({error: false, message: 'Se ha eliminado el profesor'})
        }
    );
}

function obtener_profesores(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            resultado_profesores = await asignatura.obtener_profesores();
            res.status(200).send({error: false, profesores: resultado_profesores})
        }
    )
}

function obtener_profesores_asignatura(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_asignatura = req.params.nid_asignatura;

            resultado_profesores = await asignatura.obtener_profesores_asignatura(nid_asignatura);
            res.status(200).send({error: false, profesores: resultado_profesores});
        }
    )
}

function obtener_asignaturas_profesor(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_profesor = req.params.nid_profesor;

            resultados = await asignatura.obtener_asignaturas_profesor(nid_profesor);
            res.status(200).send({error: false, asignaturas: resultados});
        }
        
    )
}

module.exports.registrar_asignatura = registrar_asignatura;
module.exports.actualizar_asignatura = actualizar_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.obtener_asignaturas = obtener_asignaturas;
module.exports.obtener_asignatura = obtener_asignatura;

module.exports.add_profesor = add_profesor;
module.exports.eliminar_profesor = eliminar_profesor;
module.exports.obtener_profesores = obtener_profesores;
module.exports.obtener_profesores_asignatura = obtener_profesores_asignatura;

module.exports.obtener_asignaturas_profesor = obtener_asignaturas_profesor;