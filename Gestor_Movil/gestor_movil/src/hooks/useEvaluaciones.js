import * as ServicioEvaluaciones from "../services/serviceEvaluacion.js";
import { useState, useEffect } from "react";

export const useEvaluacionesAsignatura = (nidCurso, nidAsignatura, nidTrimestre) => {
    const [evaluaciones, setEvaluaciones] = useState([]);

    useEffect(() => {
        const fetchEvaluaciones = async () => {
            const response = await ServicioEvaluaciones.obtenerEvaluacionesAsignatura(nidCurso, nidAsignatura, nidTrimestre);
            setEvaluaciones(response);
        };

        fetchEvaluaciones();
    }, [nidCurso, nidAsignatura, nidTrimestre]);

    return { evaluaciones };
}