import { peticionServicio } from "./ServiceComun";
import * as Constantes  from "../config/Constantes.js";

export async function obtenerCategorias() {
  try {
    const respuesta = await peticionServicio(
      "GET",
      Constantes.URL_SERVICIO_MOVIL + "obtener_categorias_partitura",
      null
    );
    console.log("Respuesta del servicio obtenerCategorias: ", respuesta);
    return respuesta.categorias;
  } catch (error) {
    console.log("Error en el servicio obtenerCategorias");
    throw new Error("Error al obtener las categorias: " + error.message);
  }
}

