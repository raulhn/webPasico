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


export async function obtenerPartitura(nid_partitura)
{
  try {

    const respuesta = await ServiceComun.peticionServicio("GET", 
                          Constantes.URL_SERVICIO_MOVIL + "obtener_partitura/" + nid_partitura,  null);

    return respuesta.partitura;
  } catch (error) {
    console.log("Error en el servicio obtenerPartitura");
    throw new Error("Error al obtener la partitura: " + error.message);
  }
}

export async function registrarPartitura(datosPartitura)
{
  try {

    console.log("Datos partitura a registrar: ", datosPartitura);
    const respuesta = await ServiceComun.peticionServicio("POST", 
                          Constantes.URL_SERVICIO_MOVIL + "registrar_partitura", 
                           datosPartitura);

    return respuesta;
  } catch (error) {
    console.log("Error en el servicio registrarPartitura");
    throw new Error("Error al registrar la partitura: " + error.message);
  }
}

export async function actualizarPartitura(datosPartitura)
{
  try {

    const respuesta = await ServiceComun.peticionServicio("POST", 
                          Constantes.URL_SERVICIO_MOVIL + "actualizar_partitura", 
                          datosPartitura);
    console.log("Respuesta al actualizar la partitura: ", respuesta);

    return respuesta;
  } catch (error) {
    console.log("Error en el servicio actualizarPartitura");
    throw new Error("Error al actualizar la partitura: " + error.message);
  }
}