const servletComun = require("./servlet_comun.js");
const gestorPersona = require("../logica/persona.js");

function registrarPersona(req, res)
{
    servletComun.comprobacionAccesoAPIKey(req, res, async () => {
    try
    {
    let nombre = req.body.nombre;
    let nid_persona = req.body.nid_persona;
    let primerApellido = req.body.primerApellido;
    let segundoApellido = req.body.segundoApellido;
    let fechaNacimiento = req.body.fechaNacimiento;
    let nif = req.body.nif;
    let telefono = req.body.telefono;
    let email = req.body.email;
    let nid_madre = req.body.nid_madre;
    let nid_padre = req.body.nid_padre;


    let fecha_actualizacion = req.body.fecha_actualizacion;

    await gestorPersona.registrarPersona(nid_persona, nombre, primerApellido, 
        segundoApellido, fechaNacimiento, nif, telefono, email, nid_madre, nid_padre, fecha_actualizacion);

    res.status(200).send({
        error: false,
        mensaje: "Persona registrada correctamente",
    });
}
catch (error)
    {
        console.error("Error al registrar la persona:" + error.message);
        res.status(400).send({
            error: true,
            mensaje: "Error al registrar la persona",
        });
    }
})
}

function obtenerPersona(req, res) {
    servletComun.comprobacionAccesoAPIKey(req, res, async () => {
        try {
            let nid_persona = req.params.nid_persona;
            let persona = await gestorPersona.obtenerPersona(nid_persona);
            if (persona) {
                res.status(200).send({
                    error: false,
                    mensaje: "Persona obtenida correctamente",
                    persona: persona,
                });
            } else {
                res.status(404).send({
                    error: true,
                    mensaje: "Persona no encontrada",
                });
            }
        } catch (error) {
            console.error("Error al obtener la persona:" + error.message);
            res.status(400).send({
                error: true,
                mensaje: "Error al obtener la persona",
            });
        }
    });
}

module.exports.obtenerPersona = obtenerPersona;
module.exports.registrarPersona = registrarPersona;

