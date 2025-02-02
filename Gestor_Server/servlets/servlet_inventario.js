const inventario = require('../logica/inventario.js')
const servlet_comun = require('./servlet_comun.js')

function registrar_inventario(req, res)
{
    servlet_comun.comprobaciones(req, res, 
        async () =>
        {
            let nid_inventario = req.body.nid_inventario;
            let descripcion = req.body.descripcion;
            let cantidad = req.body.cantidad;
            let modelo = req.body.modelo;
            let num_serie = req.body.num_serie;
            let comentarios = req.body.comentarios;

            let resultado = await inventario.registrar_inventario(nid_inventario, descripcion, cantidad, modelo, num_serie, comentarios);

            res.status(200).send({error:false, mensaje: 'Registro completado', nid_inventario: resultado})
        }
    )
}


function obtener_inventarios(req, res)
{
    servlet_comun.comprobaciones(req, res,
        async() =>
        {
            let lista_inventarios = await inventario.obtener_inventarios();
            res.status(200).send({error:false, inventarios: lista_inventarios})
        }
    )
}

function obtener_inventario(req, res)
{
    servlet_comun.comprobaciones(req, res,
        async () =>
        {
            let nid_inventario = req.params.nid_inventario;

            let resultado = await inventario.obtener_inventario(nid_inventario);
            res.status(200).send({error: false, inventario: resultado})
        }
    )
}

function eliminar_inventario(req, res)
{
    servlet_comun.comprobaciones(req, res,
        async() =>
        {
            let nid_inventario = req.body.nid_inventario;

            await inventario.eliminar_inventario(nid_inventario);
            res.status(200).send({error: false, mensaje: 'Inventario eliminado'})
        }
    )
}

module.exports.registrar_inventario = registrar_inventario;
module.exports.obtener_inventarios = obtener_inventarios;
module.exports.obtener_inventario = obtener_inventario;
module.exports.eliminar_inventario = eliminar_inventario;