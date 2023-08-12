const matricula = require('../logica/matricula.js')
const asignatura = require('../logica/asignatura.js')
const comun = require('./servlet_comun.js')


function registrar_matricula(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.body.nid_persona;
            let nid_curso = req.body.nid_curso;
            let nid_asignatura = req.body.nid_asignatura;
            let nid_profesor = req.body.nid_profesor;

            bExisteMatricula = await matricula.existe_matricula(nid_persona, nid_curso);

            if(!bExisteMatricula)
            {
                await matricula.registrar_matricula(nid_persona, nid_curso);
            }

            let nid_matricula = await matricula.obtener_nid_matricula(nid_persona, nid_curso);
            bExisteAsignatura = await asignatura.existe_asignatura(nid_asignatura);

            if(bExisteAsignatura)
            {
                await matricula.add_asignatura(nid_matricula, nid_asignatura, nid_profesor);
                res.status(200).send({error:false, message: 'Matricula registrada'});
            }
            else
            {
                res.status(400).send({error:true, message: 'Error al registrar la matricula'});
            }
        }
    );
}

function eliminar_asignatura(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_matricula = req.body.nid_matricula;
            let nid_asignatura = req.body.nid_asignatura;

            await matricula.eliminar_asignatura(nid_matricula, nid_asignatura);
            res.status(200).send({error:false, message: 'Se ha eliminado al alumno de la asignatura'});
        }
    )
}

function actualizar_matricula(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_matricula = req.body.nid_matricula;
            let nid_curso = req.body.nid_curso;

            await matricula.actualizar_matricula(nid_matricula, nid_curso);
            
            res.status(200).send({error: false, message: 'Matricula actualizada'});
        }
    );
}

function obtener_matriculas(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            resultados = await matricula.obtener_matriculas();
            res.status(200).send({error:false, matriculas: resultados})
        }
    )
}

function obtener_alumnos_asignaturas(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_curso = req.params.nid_curso;
            let nid_asignatura = req.params.nid_asignatura;
            let activo = req.params.activo
            
            let resultados;

            if (activo == 1)
            {
                resultados = await matricula.obtener_alumnos_asignaturas_alta(nid_curso, nid_asignatura);
            }
            else if(activo == 2)
            {
                resultados = await matricula.obtener_alumnos_asignaturas_baja(nid_curso, nid_asignatura);
            }
            else if(activo == 3)
            {
                resultados = await matricula.obtener_alumnos_asignaturas(nid_curso, nid_asignatura);
            }

            res.status(200).send({error: false, alumnos: resultados})
        }
    )
}




function obtener_matriculas_alumno(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_alumno = req.params.nid_alumno;

            resultados = await matricula.obtener_matriculas_alumno(nid_alumno);
            res.status(200).send({error: false, matriculas: resultados});
        }
    )
}

function obtener_asignaturas_matricula(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_matricula = req.params.nid_matricula;

            resultados = await matricula.obtener_asignaturas_matricula(nid_matricula);
            res.status(200).send({error: false, asignaturas: resultados})
        }
    )
}

function dar_baja_asignatura(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_matricula = req.body.nid_matricula;
            let nid_asignatura = req.body.nid_asignatura;
            let fecha_baja = req.body.fecha_baja;

            await matricula.dar_baja_asignatura(nid_matricula, nid_asignatura, fecha_baja);
            res.status(200).send({error: false, message: 'Alumno dado de baja'})
        }
    )
}


module.exports.registrar_matricula = registrar_matricula;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.actualizar_matricula = actualizar_matricula;
module.exports.obtener_matriculas = obtener_matriculas;

module.exports.obtener_alumnos_asignaturas = obtener_alumnos_asignaturas;

module.exports.obtener_matriculas_alumno = obtener_matriculas_alumno;
module.exports.obtener_asignaturas_matricula = obtener_asignaturas_matricula;
module.exports.dar_baja_asignatura = dar_baja_asignatura;
