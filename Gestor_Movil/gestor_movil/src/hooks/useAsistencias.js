import { obtenerAsistenciaAsignaturas } from "../services/serviceGrupos";
import { useState, useEffect } from "react";

export const useAsistencias = (nid_asignatura, nid_curso) => {
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAsistencias() {
    try {
      const data = await obtenerAsistenciaAsignaturas(
        nid_asignatura,
        nid_curso,
      );
      setAsistencias(data);
      setRefrescar(false);
    } catch (error) {
      setError(error);
      setRefrescar(false);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (nid_asignatura && nid_curso) {
      fetchAsistencias();
    }
  }, [nid_asignatura, nid_curso, refrescar]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { asistencias, cargando, error, lanzarRefresco };
};
