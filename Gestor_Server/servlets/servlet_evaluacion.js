const evaluacion = require('../logica/evaluacion.js')
const comun = require('./servlet_comun.js')
const gestion_usuarios = require('../logica/usuario.js')
const profesor = require('../logica/profesor.js')
const matricula = require('../logica/matricula.js')
const gestorCurso = require('../logica/curso.js')


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
            let nid_asignatura = req.body.nid_asignatura;
            let nid_profesor = req.body.nid_profesor;

            const nid_curso = await gestorCurso.obtener_ultimo_curso();

            let nid_evaluacion = await evaluacion.registrar_evaluacion(nid_trimestre, nid_asignatura, nid_profesor, nid_curso);

            let notas_array = JSON.parse(notas);
            let progreso_array = JSON.parse(progresos);
            let matricula_array = JSON.parse(matriculas)
            let comentarios_array = JSON.parse(comentarios);

            let array_persona = Object.keys(notas_array);

            for (let i = 0; i < array_persona.length; i++) 
            {
                let nid_persona = array_persona[i];
                let nid_matricula_asignatura = matricula_array[nid_persona];

                let nota = notas_array[nid_persona];
                let nid_tipo_progreso = progreso_array[nid_persona]
                let comentario = comentarios_array[nid_persona];

                await evaluacion.registrar_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura, nota, nid_tipo_progreso, comentario);
            }

            res.status(200).send({error: false, message: 'Evaluacion registrada'})
        }
    )
}

function registrar_evaluacion_profesor(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {

            let notas = req.body.notas;
            let progresos = req.body.progresos;
            let matriculas = req.body.matriculas;
            let comentarios = req.body.comentarios;

            let nid_trimestre = req.body.nid_trimestre;
            let nid_asignatura = req.body.nid_asignatura;

            let usuario = req.session.nombre;
            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario)

            
            let nid_evaluacion = await evaluacion.registrar_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);

            let notas_array = JSON.parse(notas);
            let progreso_array = JSON.parse(progresos);
            let matricula_array = JSON.parse(matriculas)
            let comentarios_array = JSON.parse(comentarios);

            let array_persona = Object.keys(notas_array);

            for (let i = 0; i < array_persona.length; i++) 
            {
            
                let nid_persona = array_persona[i];
                console.log(nid_persona)
                let nid_matricula_asignatura = matricula_array[nid_persona];

                let nota = notas_array[nid_persona];
                let nid_tipo_progreso = progreso_array[nid_persona]
                let comentario = comentarios_array[nid_persona];

                await evaluacion.registrar_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura, nota, nid_tipo_progreso, comentario);
            }

            res.status(200).send({error: false, message: 'Evaluacion registrada'})
        }
    )
}

function obtener_evaluacion(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_trimestre = req.params.nid_trimestre;
            let nid_asignatura = req.params.nid_asignatura;
            let nid_profesor = req.params.nid_profesor;

            bExiste_evaluacion = await evaluacion.existe_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);
            
            if (bExiste_evaluacion)
            {
                let evaluacion_recuperada = await evaluacion.obtener_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);

                let evaluaciones_matriculas = await evaluacion.obtener_evaluaciones_matricula(evaluacion_recuperada['nid_evaluacion']);

                res.status(200).send({error: false, evaluacion: evaluacion_recuperada, evaluaciones_matriculas: evaluaciones_matriculas});
            }
            else {res.status(200).send({error: false, evaluacion: null, evaluaciones_matriculas: []});}
        }
    )
}

function obtener_evaluacion_profesor(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let usuario = req.session.nombre;

            let nid_trimestre = req.params.nid_trimestre;
            let nid_asignatura = req.params.nid_asignatura;

            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            bExiste_evaluacion = await evaluacion.existe_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);

            if (bExiste_evaluacion)
            {
                let evaluacion_recuperada = await evaluacion.obtener_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);

                let evaluaciones_matriculas = await evaluacion.obtener_evaluaciones_matricula(evaluacion_recuperada['nid_evaluacion']);

                res.status(200).send({error: false, evaluacion: evaluacion_recuperada, evaluaciones_matriculas: evaluaciones_matriculas});
            }
            else {res.status(200).send({error: false, evaluacion: null, evaluaciones_matriculas: []});}
        }
    )
}


function obtener_trimestres(req, res)
{
    comun.comprobaciones_general(req, res,
        async() =>
        {
            let trimestres = await evaluacion.obtener_trimestres()

            res.status(200).send({error: false, trimestres: trimestres})
        }
    )
}

function obtener_evaluacion_matricula_asginatura(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_matricula = req.params.nid_matricula;

            let resultado = await evaluacion.obtener_evaluacion_matricula_asginatura(nid_matricula);

            res.status(200).send({error: false, evaluaciones: resultado})
        }
    )
}

function obtener_evaluacion_matricula_asignatura_profesor(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nid_matricula = req.params.nid_matricula;

            let usuario = req.session.nombre;
            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            let v_matricula = await matricula.obtener_matricula(nid_matricula);
            let nid_alumno = v_matricula.nid_persona;
            let nid_curso = v_matricula.nid_curso;

            let bEsProfesor = await profesor.esAlumnoProfesor(nid_alumno, nid_profesor, nid_curso);

            if (bEsProfesor)
            {
                let resultado = await evaluacion.obtener_evaluacion_matricula_asginatura(nid_matricula);
                res.status(200).send({error: false, evaluaciones: resultado})
            }
            else
            {
                res.status(403).send({error: true, message: 'El profesor no tiene acceso a las evaluaciones de este alumno'});
            }
        }
    )
}

function generar_boletin(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_matricula = req.params.nid_matricula;
            let nid_trimestre = req.params.nid_trimestre;

            let fichero = await evaluacion.generar_boletin(nid_matricula, nid_trimestre);

            res.status(200).send({error: false, fichero: fichero});

        }
    )
}

function generar_boletin_profesor(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nid_matricula = req.params.nid_matricula;
            let nid_trimestre = req.params.nid_trimestre;

            let usuario = req.session.nombre;
            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            let v_matricula = await matricula.obtener_matricula(nid_matricula);
            let nid_alumno = v_matricula.nid_persona;
            let nid_curso = v_matricula.nid_curso;

            let bEsProfesor = await profesor.esAlumnoProfesor(nid_alumno, nid_profesor, nid_curso);

            if(bEsProfesor)
            {
                let fichero = await evaluacion.generar_boletin(nid_matricula, nid_trimestre);
                res.status(200).send({error: false, fichero: fichero});
            }
            else
            {
                res.status(403).send({error: true, message: 'El profesor no tiene acceso a las evaluaciones de este alumno'});
            }

        }
    )
}


module.exports.registrar_evaluacion = registrar_evaluacion;
module.exports.registrar_evaluacion_profesor = registrar_evaluacion_profesor;
module.exports.obtener_evaluacion_profesor = obtener_evaluacion_profesor;
module.exports.obtener_trimestres = obtener_trimestres;
module.exports.obtener_evaluacion = obtener_evaluacion;

module.exports.obtener_evaluacion_matricula_asignatura = obtener_evaluacion_matricula_asginatura;
module.exports.obtener_evaluacion_matricula_asignatura_profesor = obtener_evaluacion_matricula_asignatura_profesor;

module.exports.generar_boletin = generar_boletin;
module.exports.generar_boletin_profesor = generar_boletin_profesor;