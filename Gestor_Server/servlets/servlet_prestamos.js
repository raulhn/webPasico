const comun = require('./servlet_comun.js');
const prestamos = require('../logica/prestamos.js');

function registrar_prestamo(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_persona = req.body.nid_persona;
            let fecha_inicio = req.body.fecha_inicio;
            let nid_inventario = req.body.nid_inventario;
            console.log('x')

            await prestamos.registrar_prestamo(nid_persona, nid_inventario, fecha_inicio);
            console.log('y')

            res.status(200).send({error:false, message: 'Prestamo registrado'});
        }
    )
}

function actualizar_prestamo(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_prestamo = req.body.nid_prestamo;
            let fecha_inicio = req.body.fecha_inicio;
            let fecha_fin = req.body.fecha_fin;

            await prestamos.actualizar_prestamo(nid_prestamo, fecha_inicio, fecha_fin);

            res.status(200).send({error:false, message: 'Prestamo actualizado'})
        }
    )
}

function obtener_prestamos(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let resultados = await prestamos.obtener_prestamos();

            res.status(200).send({error: false, prestamos: resultados})
        }
    )
}

function obtener_prestamo(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_prestamo = req.params.nid_prestamo;
            console.log('a')
            console.log(nid_prestamo)
            let resultado = await prestamos.obtener_prestamo(nid_prestamo);

            res.status(200).send({error: false, prestamo: resultado});
        }
    )
}

function eliminar_prestamo(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_prestamo = req.body.nid_prestamo;
            await prestamos.eliminar_prestamo(nid_prestamo);

            res.status(200).send({error: false, message: 'Prestamo elminado'})
        }
    )
}

module.exports.registrar_prestamo = registrar_prestamo;
module.exports.actualizar_prestamo = actualizar_prestamo;
module.exports.obtener_prestamos = obtener_prestamos;
module.exports.obtener_prestamo = obtener_prestamo;
module.exports.eliminar_prestamo = eliminar_prestamo;

