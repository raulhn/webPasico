import serviceEvaluaciones from "../../servicios/serviceEvaluaciones.js";
import { useState, useEffect } from "react";

export const useEvaluaciones = (nidMatricula, cerrar_sesion) => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const data = await serviceEvaluaciones.obtenerEvaluaciones(
          nidMatricula,
          cerrar_sesion
        );

        setEvaluaciones(data.evaluaciones || []);
        setCargando(false);
        setError(false);
      } catch (error) {
        console.log("Error al obtener las evaluaciones:", error);
        setEvaluaciones([]);
        setCargando(false);
        setError(true);
      }
    };

    fetchEvaluaciones();
  }, [nidMatricula, refrescar]);

  return { evaluaciones, cargando, error, refrescar, setRefrescar };
};


export const useEvaluacionesAsignatura = (nidCurso, nidAsignatura, nidTrimestre, cerrar_sesion) => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  const lanzarRefresco = () => {
    setRefrescar(true);
  };

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const data = await serviceEvaluaciones.obtenerEvaluacionesAsignatura(
          nidCurso,
          nidAsignatura,
          nidTrimestre,
          cerrar_sesion
        );
        setEvaluaciones(data.evaluaciones || []);
        setCargando(false);
        setError(false);
        setRefrescar(false);
      } catch (error) {
        console.log("Error al obtener las evaluaciones:", error);
        setEvaluaciones([]);
        setCargando(false);
        setRefrescar(false)
        setError(true);
      }
    };

    fetchEvaluaciones();
  }, [nidCurso, nidAsignatura, nidTrimestre, refrescar]);

  return { evaluaciones, cargando, error, refrescar, lanzarRefresco };
};