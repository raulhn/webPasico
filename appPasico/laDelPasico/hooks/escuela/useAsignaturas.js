import serviceAsignaturas from "../../servicios/serviceAsignaturas.js";
import { useState, useEffect } from "react";

export const useAsignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAsignaturas() {
    try {
      const data = await serviceAsignaturas.obtenerAsignaturas();

      setAsignaturas(data.asignaturas);
      setRefrescar(false);
    } catch (error) {
      setError(error);
      setRefrescar(false);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    fetchAsignaturas();
  }, [refrescar]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { asignaturas, cargando, error, lanzarRefresco };
};
