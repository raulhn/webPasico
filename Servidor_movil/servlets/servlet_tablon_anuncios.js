const gestorTablonAnuncios = require("../logica/tablon_anuncios")
const gestorTablonAnuncionsAsignatura = require("../logica/tablon_anuncios_asignatura")
const constantes = require("../constantes")
const servlet_comun = require("./servlet_comun")
const gestorProfesores = require("../logica/profesores")
const servletPersona = require("./servlet_persona")

async function insertarTablonAnuncioProfesor(req, res)
{
    try
    {
        const rolAdministrador =[constantes.ADMINISTRADOR];
        const rolProfesor = [constantes.PROFESOR];

        const bAdministrador = await servlet_comun.comprobarRol(req, rolAdministrador)
        const bProfesor = await servlet_comun.comprobarRol(req, rolProfesor);
        
        if (!bAdministrador && !bProfesor)
        {
            throw new Error("Acceso no autorizado");
        }
        else
        {
            const titulo = req.body.titulo;
            const descripcion = req.body.descripcion;
            const nidTipoTablon = req.body.nid_tipo_tablon;
            const nid_asignatura = req.body.nid_asignatura;


            if(!bAdministrador)
            {
              const nid_persona = servletPersona.obtenerNidPersona(req);
              const bEsProfesor = gestorProfesores.esProfesor(nid_persona, nid_asignatura);
                           
              if(!bEsProfesor)
              {
                // No es profesor de esa asignatura
                throw new Error("Acceso no autorizado")
              }
            }

            const nid_tablon_anuncio = await gestorTablonAnuncios.insertarTablonAnuncio(titulo, descripcion, nidTipoTablon);
            const nid_tablon_anuncio_asignatura = await gestorTablonAnuncionsAsignatura.actualizarTablonAnuncioAsignatura(nid_tablon_anuncio, nid_asignatura);
        
            res.status(200).send(
                {
                    error: false,
                    mensaje: "Anuncio registrado"
                }
            )
        }
    }
    catch(error)
    {
        console.log("servlet_tablon_anuncios.js -> insertarTablonAnuncioProfesor: ", error);
        throw new Error("Error al insertar anuncio")
    }
}


async function insertarTablonAnuncio(req, res)
{
    try
    {
        const nid_tipo_tablon = req.body.nid_tipo_tablon;

        if(nid_tipo_tablon == constantes.PROFESOR)
        {
            await insertarTablonAnuncioProfesor(req, res);
        }
    }
    catch(error)
    {
        console.log("servlet_tablon_anuncios.js -> insertarTablonAnuncio: ", error);
        res.status(400).send(
            {
                error:true,
                mensaje: "Se ha producido un error al insertar el tablon de anuncios"
            }
        )
    }
}