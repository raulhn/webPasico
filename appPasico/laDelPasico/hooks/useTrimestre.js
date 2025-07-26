import serviceTrimestres from "../servicios/serviceTrimestre";
import { useState, useEffect } from "react";

export const useTrimestre = (cerrar_sesion) => {
  const [trimestres, setTrimestres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  useEffect(() => {
    const fetchTrimestres = async () => {
      try {
        const response =
          await serviceTrimestres.obtenerTrimestres(cerrar_sesion);
        setTrimestres(response.trimestres);
      } catch (error) {
        setError(error);
      } finally {
        setCargando(false);
      }
    };

    fetchTrimestres();
  }, [cerrar_sesion, refrescar]);

  return { trimestres, cargando, error, refrescar, setRefrescar };
};
