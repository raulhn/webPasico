import { obtenerAsistenciasAsignatura } from "../../servicios/serviceAsistencias.js";
import { useState, useEffect } from "react";

export const useAsistencias = (nid_asignatura, nid_curso, cerrar_sesion) => {
  const [asistencias, setAsistencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAsistencias() {
    try {
      setCargando(true);
      if (!nid_asignatura || !nid_curso) {
        const data = await obtenerAsistenciasAsignatura(
          nid_asignatura,
          nid_curso,
          cerrar_sesion
        );

        setAsistencias(data.asistencias || []);
      } else {
        setAsistencias([]);
      }
      setCargando(false);
      return;
    } catch (error) {
      console.log("Error en useAsistencias:", error);
      setCargando(false);
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
