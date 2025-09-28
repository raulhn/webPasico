import * as ServiceComun from "./ServiceComun.js"
import * as Constantes from "../config/Constantes.js"

export async function obtenerPartituras()
{
  try {

    const respuesta = await ServiceComun.peticionServicio("GET", 
                          Constantes.URL_SERVICIO_MOVIL + "obtener_partituras",  null);

    return respuesta.partituras;
  } catch (error) {
    console.log("Error en el servicio obtenerPartiturasAlumno");
    throw new Error("Error al obtener las partituras del alumno: " + error.message);
  }
}
