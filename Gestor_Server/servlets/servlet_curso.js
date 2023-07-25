const curso = require('../logica/curso.js')
const comun = require('./servlet_comun.js')

function registrar_curso(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let descripcion = req.body.descripcion;
            await curso.registrar_curso(descripcion);

            res.status(200).send({error:false, message: 'Curso registrado'});
        }
    )
}

function obtener_cursos(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            resultado = await curso.obtener_cursos();
            res.status(200).send({error:false, cursos: resultado});
        }
        
    )
}

function eliminar_curso(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_curso = req.body.nid_curso;
            await curso.eliminar_curso(nid_curso);

            res.status(200).send({error: false, message: 'Curso eliminado'})
        }
    )
}

module.exports.registrar_curso = registrar_curso;
module.exports.obtener_cursos = obtener_cursos;
module.exports.eliminar_curso = eliminar_curso;