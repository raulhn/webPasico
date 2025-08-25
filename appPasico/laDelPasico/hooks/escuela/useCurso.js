import ServiceCurso from "../../servicios/serviceCurso.js";
import { useState, useEffect } from "react";

export const useCursos = (cerrar_sesion) => {
    const [cursos, setCursos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [refrescar, setRefrescar] = useState(false);

    function lanzarRefresco() {
        setRefrescar(true);
    }

    useEffect(() => {
        ServiceCurso.obtenerCursos(cerrar_sesion).then((data) => {
            setCursos(data);
            setCargando(false);
            setRefrescar(false);
        }).catch((error) => {
            console.log("Error al obtener cursos:", error);
            setError(error);
            setCargando(false);
            setRefrescar(false);
        });
    }, [refrescar]);

    return { cursos, cargando, error, lanzarRefresco};
}

