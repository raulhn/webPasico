import { obtenerAsistenciaAsignaturas } from "../services/serviceGrupos";
import { useState, useEffect, useCallback } from "react";

export const useAsistencias = (nid_asignatura, nid_curso) => {
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  const fetchAsistencias = useCallback(async () => {
    try {
      const respuesta = await obtenerAsistenciaAsignaturas(
        nid_asignatura,
        nid_curso,
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message ||
            respuesta.mensaje ||
            "No se han podido obtener las asistencias",
        );
      }
      setAsistencias(
        Array.isArray(respuesta.asistencias) ? respuesta.asistencias : [],
      );
      setError(null);
      setRefrescar(false);
    } catch (error) {
      setError(error);
      setAsistencias([]);
      setRefrescar(false);
    } finally {
      setCargando(false);
    }
  }, [nid_asignatura, nid_curso]);

  useEffect(() => {
    if (nid_asignatura && nid_curso) {
      setCargando(true);
      fetchAsistencias();
      return;
    }
    setAsistencias([]);
    setError(null);
    setCargando(false);
  }, [nid_asignatura, nid_curso, refrescar, fetchAsistencias]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { asistencias, cargando, error, lanzarRefresco };
};
