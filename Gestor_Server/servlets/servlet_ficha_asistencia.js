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


module.exports.crear_ficha_asistencia = crear_ficha_asistencia;
module.exports.obtener_fichas_asistencias = obtener_fichas_asistencias;
module.exports.obtener_alumnos_seleccion = obtener_alumnos_seleccion;