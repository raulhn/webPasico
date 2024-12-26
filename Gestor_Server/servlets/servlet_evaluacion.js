const evaluacion = require('../logica/evaluacion.js')
const comun = require('./servlet_comun.js')


function registrar_evaluacion(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let notas = req.body.notas;
            let progresos = req.body.progresos;
            let matriculas = req.body.matriculas;
            let comentarios = req.body.comentarios;

            let nid_trimestre = req.body.nid_trimestre;

            let notas_array = JSON.parse(notas);
            let progreso_array = JSON.parse(progresos);
            let matricula_array = JSON.parse(matriculas)
            let comentarios_array = JSON.parse(comentarios);

            for (let nid_persona in notas_array)
            {
                let nota = notas_array[nid_persona];
                let nid_progreso = progreso_array[nid_persona]
                let nid_matricula_asignatura = matricula_array[nid_persona];
                let comentario = comentarios_array[nid_persona];

                await evaluacion.registrar_evaluacion(nota, nid_trimestre, nid_progreso, nid_matricula_asignatura, comentario)
            }

            res.status(200).send({error: false})
        }
    )
}


function obtener_trimestres(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let trimestres = await evaluacion.obtener_trimestres()

            res.status(200).send({error: false, trimestres: trimestres})
        }
    )
}



module.exports.registrar_evaluacion = registrar_evaluacion;
module.exports.obtener_trimestres = obtener_trimestres;