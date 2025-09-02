import { URL_SERVICIO_MOVIL } from "../config/Constantes";
import { peticionServicio } from "./ServiceComun";

export function obtenerCursos(cerrar_sesion)
{
    return new Promise((resolve, reject) => {
    peticionServicio("GET", URL_SERVICIO_MOVIL + "obtener_cursos", null, cerrar_sesion).then((data) => {
        if (data) {
            resolve(data.cursos);
        } else {
            reject(new Error("No se obtuvieron cursos"));
        }
    }).catch((error) => {
        reject(error);
    });
});
}
