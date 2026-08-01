import serviceAsistencias from "../../servicios/serviceAsistencias.js";
import { useState, useEffect } from "react";

export const useAsistencias = (nid_asignatura, nid_curso, cerrar_sesion) => {
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAsistencias() {
    try {
      setLoading(true);
      const data = await serviceAsistencias.obtenerAsistenciasAsignatura(
        nid_asignatura,
        nid_curso,
        cerrar_sesion
      );

      setAsistencias(data.asistencias || []);
      setLoading(false);
    } catch (error) {
      console.log("Error en useAsistencias:", error);
      setLoading(false);
      throw new Error("No se han podido cargar las asistencias.");
    }
  }

  useEffect(() => {
    fetchAsistencias();
  }, [nid_asignatura, nid_curso, cerrar_sesion, refrescar]);

  function refrescarAsistencias() {
    setRefrescar(!refrescar);
  }
  return { asistencias, refrescarAsistencias, cargando, error };
};
