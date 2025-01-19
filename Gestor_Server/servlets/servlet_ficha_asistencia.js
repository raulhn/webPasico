const ficha_asistencia = require('../logica/ficha_asistencia.js')
const comun = require('./servlet_comun.js')
const gestion_usuarios = require('../logica/usuario.js');


function crear_ficha_asistencia(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nombre = req.body.nombre;
            let fecha = req.body.fecha;
            let nid_asignatura = req.body.nid_asignatura;

            let usuario = req.session.nombre;

            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            let nid_ficha_asistencia = ficha_asistencia.crear_ficha_asistencia(nombre, fecha, nid_asignatura, nid_profesor);

            res.status(200).send({error:false, nid_ficha_asistencia: nid_ficha_asistencia})
        }
    )
}

function copiar_ficha_asistencia(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nombre = req.body.nombre;
            let fecha = req.body.fecha;
            let nid_ficha_asistencia = req.body.nid_ficha_asistencia;

            let usuario = req.session.nombre;

            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            let nid_nueva_ficha_asistencia = ficha_asistencia.copiar_ficha_asistencia(nombre, fecha, nid_profesor, nid_ficha_asistencia);

            res.status(200).send({error:false, nid_ficha_asistencia: nid_nueva_ficha_asistencia})
        }
    )
}



function obtener_fichas_asistencias(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let usuario = req.session.nombre;
            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            let fichas_asistencias = await ficha_asistencia.obtener_fichas_asistencias(nid_profesor);

            res.status(200).send({error:false, fichas_asistencias: fichas_asistencias})
        }
    )
}

function obtener_ficha_asistencia(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nid_ficha_asistencia = req.params.nid_ficha_asistencia;
            let usuario = req.session.nombre;
            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            let ficha = await ficha_asistencia.obtener_ficha_asistencia(nid_profesor, nid_ficha_asistencia);

            res.status(200).send({error:false, ficha_asistencia: ficha})
        }
    )
}

function obtener_alumnos_seleccion(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nid_ficha_asistencia = req.params.nid_ficha_asistencia;

            let usuario = req.session.nombre;
            let nid_profesor = await gestion_usuarios.obtener_nid_persona(usuario);

            let alumnos_seleccion = await ficha_asistencia.obtener_alumnos_ficha_seleccion(nid_ficha_asistencia, nid_profesor);
            res.status(200).send({error: false, alumnos_seleccion: alumnos_seleccion});
        }
    )
}


function registrar_ficha_asistencia_alumno(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nid_alumno = req.body.nid_alumno;
            let nid_ficha_asistencia = req.body.nid_ficha_asistencia;

            await ficha_asistencia.registrar_ficha_asistencia_alumno(nid_ficha_asistencia, nid_alumno);

            res.status(200).send({error: false, mensaje: 'Ficha actualizada'})
        }
    )
}

function eliminar_ficha_asistencia_alumno(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nid_ficha_asistencia_alumno = req.body.nid_ficha_asistencia_alumno;

            await ficha_asistencia.eliminar_ficha_asistencia_alumno(nid_ficha_asistencia_alumno);

            res.status(200).send({error: false, mensaje: 'Ficha actualizada'})
        }
    )
}

function obtener_fichas_asistencias_alumno(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let nid_ficha_asistencia = req.params.nid_ficha_asistencia;

            let resultados = await ficha_asistencia.obtener_fichas_asistencias_alumno(nid_ficha_asistencia);
            res.status(200).send({error: false, fichas_asistencias_alumno: resultados})
        }
    )
}



function actualizar_ficha_asistencia_alumnos(req, res)
{
    comun.comprobaciones_profesor(req, res,
        async() =>
        {
            let lista_ficha_asistencia_alumnos = req.body.fichas_asistencias_alumno;
            let lista_fichas = JSON.parse(lista_ficha_asistencia_alumnos);

            for (let i = 0; i < lista_fichas.length; i++) 
            {
                await ficha_asistencia.actualizar_ficha_asistencia_alumnos(lista_fichas[i]['nid_ficha_asistencia_alumno'], 
                                                                           lista_fichas[i]['asistencia'],
                                                                           lista_fichas[i]['comentario']
                );
            }

            res.status(200).send({error: false, mensaje: 'Ficha actualizada'})
        }

    )
}


module.exports.crear_ficha_asistencia = crear_ficha_asistencia;
module.exports.copiar_ficha_asistencia = copiar_ficha_asistencia;

module.exports.obtener_fichas_asistencias = obtener_fichas_asistencias;
module.exports.obtener_ficha_asistencia = obtener_ficha_asistencia
module.exports.obtener_alumnos_seleccion = obtener_alumnos_seleccion;
module.exports.obtener_fichas_asistencias_alumno = obtener_fichas_asistencias_alumno;

module.exports.registrar_ficha_asistencia_alumno = registrar_ficha_asistencia_alumno;
module.exports.eliminar_ficha_asistencia_alumno = eliminar_ficha_asistencia_alumno;
module.exports.actualizar_ficha_asistencia_alumnos = actualizar_ficha_asistencia_alumnos;