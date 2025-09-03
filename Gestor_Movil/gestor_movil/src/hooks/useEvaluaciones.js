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


    async function registrarEvaluaciones(evaluaciones_, nidCurso_, nidAsignatura_, nidTrimestre_)
    {
        try {
            await ServicioEvaluaciones.registrarEvaluaciones(evaluaciones_, nidCurso_, nidAsignatura_, nidTrimestre_);
        } catch (error) {
            console.error("Error al registrar evaluaciones:", error);
        }
    }
    return { evaluaciones, registrarEvaluaciones };
}


export const useEvaluaciones = (nidMatricula) => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const data = await ServicioEvaluaciones.obtenerEvaluaciones(
          nidMatricula
        );

        setEvaluaciones(data.evaluaciones || []);
        setNombreAlumno(data.nombre_alumno || "");
        setCargando(false);
        setError(false);
      } catch (error) {
        console.log("Error al obtener las evaluaciones:", error);
        setEvaluaciones([]);
        setNombreAlumno("");
        setCargando(false);
        setError(true);
      }
    };

    fetchEvaluaciones();
  }, [nidMatricula, refrescar]);

  return { evaluaciones, nombreAlumno, cargando, error, refrescar, setRefrescar };
};
