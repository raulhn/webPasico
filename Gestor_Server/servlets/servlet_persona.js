const persona = require('../logica/persona.js')
const musico = require('../logica/musico.js')
const comun = require('./servlet_comun.js')
const socio = require('../logica/socio.js')
const asignatura = require('../logica/asignatura.js')
const matricula = require('../logica/matricula.js')

async function registrar_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nif = req.body.nif;
            let nombre = req.body.nombre;
            let primer_apellido = req.body.primer_apellido;
            let segundo_apellido = req.body.segundo_apellido;
            let telefono = req.body.telefono;
            let fecha_nacimiento = req.body.fecha_nacimiento;
            let correo_electronico = req.body.correo_electronico;
            let codigo = req.body.codigo;

            nid_persona = await persona.registrar_persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif, correo_electronico, codigo);

            res.status(200).send({error: false, message: 'Registro creado', nid_persona: nid_persona});
          
        }
    )
}


async function obtener_personas(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            resultados = await persona.obtener_personas();
            res.status(200).send({error:false, personas: resultados})
        }
    )
}

async function obtener_personas_tipo(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let tipo = req.params.tipo;

            let resultados;
            if (tipo == "1")
            {
                resultados = await persona.obtener_todas_personas();
                res.status(200).send({error:false, tipo: 1, personas: resultados})
            }
            else if(tipo == "2")
            {
                resultados = await socio.obtener_socios();
                res.status(200).send({error:false, tipo: 2, personas: resultados})
            }
            else if(tipo == "3")
            {
                resultados = await asignatura.obtener_profesores_distinct();
                res.status(200).send({error:false, tipo: 3, personas: resultados})
            }
            else if(tipo == "4")
            {
                resultados = await matricula.obtener_alumnos_curso_actual()
                res.status(200).send({error: false, tipo: 4, personas: resultados});
            }
            else
            {
                res.status(401).send({error:true, message: 'No se ha encontrado el tipo'});
            }
        }
    )
}

async function obtener_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid = req.params.nid
            resultados = await persona.obtener_persona(nid);
            res.status(200).send({error:false, persona: resultados})
        }
    )
}

async function actualizar_persona(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid = req.body.nid
            let nif = req.body.nif
            let nombre = req.body.nombre
            let primer_apellido = req.body.primer_apellido
            let segundo_apellido = req.body.segundo_apellido
            let telefono = req.body.telefono
            let fecha_nacimiento = req.body.fecha_nacimiento
            let correo_electronico = req.body.correo_electronico
            let codigo = req.body.codigo
            let nid_socio = req.body.nid_socio

            bResultado = await persona.actualizar_persona(nid, nif, nombre, primer_apellido, 
                         segundo_apellido, telefono, fecha_nacimiento, correo_electronico, codigo, nid_socio);
            if(bResultado)
            {
                res.status(200).send({error: false, message: 'Se ha actualizado la persona de forma correcta'})
            }
            else{
                res.status(400).send({error:true, message: 'Se ha producido un error al actualizar'})
            }
        }
    )
}


async function obtener_ficha_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona =  req.params.nid_persona;
            resultado_persona = await persona.obtener_persona(nid_persona);
            resultado_instrumentos = await musico.obtener_instrumentos_persona(nid_persona);
            res.status(200).send({error:false, persona: resultado_persona, instrumentos: resultado_instrumentos})
        }
    )
}

async function obtener_padre(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.params.nid_persona;
            let nid_padre = await persona.obtener_padre(nid_persona);
            let resultado_padre = await persona.obtener_persona(nid_padre);
            res.status(200).send({error: false, padre: resultado_padre})
        }
    )
}

async function obtener_hijos(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_persona = req.params.nid_persona;

            let resultado_hijos = await persona.obtener_hijos(nid_persona);
            res.status(200).send({error: false, hijos: resultado_hijos})
        }
    )
}


async function obtener_madre(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.params.nid_persona;
            let nid_madre = await persona.obtener_madre(nid_persona);
            let resultado_madre = await persona.obtener_persona(nid_madre);
            res.status(200).send({error: false, madre: resultado_madre})
        }
    )
}

async function registrar_padre(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.body.nid_persona;
            let nid_padre = req.body.nid_padre;

            await persona.registrar_padre(nid_persona, nid_padre);
            res.status(200).send({error: false, message: 'Padre registrado'})
        }
    )
}

async function registrar_madre(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_persona = req.body.nid_persona;
            let nid_madre = req.body.nid_madre;
            
            await persona.registrar_madre(nid_persona, nid_madre);
            res.status(200).send({error: false, message: 'Madre registrada'})
        }
    )
}

async function registrar_forma_pago(req, res)
{
    comun.comprobaciones(req, res, 
        async () =>
        {
            let nid_titular = req.body.nid_titular;
            let iban = req.body.iban;

            await persona.registrar_forma_pago(nid_titular, iban);
            res.status(200).send({error: false, message: 'Forma de pago registrada'});
        }   
        
    )
}

async function obtener_forma_pago(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid_titular = req.params.nid_titular;

            let resultados = await persona.obtener_forma_pago(nid_titular);
            res.status(200).send({error: false, forma_pago: resultados});
        }
    )
}


async function obtener_formas_pago(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let resultados = await persona.obtener_formas_pago();
            res.status(200).send({error: false, formas_pago: resultados})
        }
        
    )
}

async function obtener_pago_persona(req, res)
{
    comun.comprobaciones(req, res, 
        async() =>
        {
            let nid_titular = req.params.nid_titular;
            let resultado = await persona.obtener_pago_persona(nid_titular);

            res.status(200).send({error:false, nid_forma_pago: resultado})
        }
        
    )
}

async function asociar_forma_pago(req, res)

{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nid_forma_pago = req.body.nid_forma_pago;
            let nid_persona = req.body.nid_persona;

            await persona.asociar_pago_persona(nid_persona, nid_forma_pago);
            res.status(200).send({error: false, message: 'Se ha asociado la forma de pago'})
        }
        
    )
}

async function obtener_persona_apellidos(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let primer_apellido = req.params.primer_apellido;
            let segundo_apellido =  req.params.segundo_apellido;

            let resultados = await persona.obtener_persona_apellidos(primer_apellido, segundo_apellido);
            res.status(200).send({error: false, resultados: resultados})
        });
}

async function valida_nif(req, res)
{
    comun.comprobaciones(req, res,
        async() =>
        {
            let nif = req.params.nif;

            let resultado = await persona.valida_nif(nif);
            res.status(200).send({error: false, resultados: resultado})
        }

    )
}

module.exports.registrar_persona = registrar_persona
module.exports.actualizar_persona = actualizar_persona

module.exports.obtener_personas = obtener_personas
module.exports.obtener_persona = obtener_persona
module.exports.obtener_personas_tipo = obtener_personas_tipo;

module.exports.obtener_ficha_persona = obtener_ficha_persona

module.exports.obtener_padre = obtener_padre;
module.exports.obtener_madre = obtener_madre;
module.exports.obtener_hijos = obtener_hijos;

module.exports.registrar_madre = registrar_madre;
module.exports.registrar_padre = registrar_padre;

module.exports.registrar_forma_pago = registrar_forma_pago;
module.exports.obtener_forma_pago = obtener_forma_pago;
module.exports.obtener_formas_pago = obtener_formas_pago;
module.exports.obtener_pago_persona = obtener_pago_persona;
module.exports.asociar_forma_pago = asociar_forma_pago;

module.exports.obtener_persona_apellidos = obtener_persona_apellidos;
module.exports.valida_nif = valida_nif;