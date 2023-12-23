const constantes = require('../constantes.js')
const comun = require('./servlet_comun.js')
const remesa = require('../logica/remesa.js')

function registrar_remesa_persona(req, res)
{
    comun.comprobaciones(req, res,
        async () =>
        {
            let nid = req.body.nid;

            await remesa.registrar_remesa_persona(nid);
        }
    );
}


module.exports.registrar_remesa_persona = registrar_remesa_persona;