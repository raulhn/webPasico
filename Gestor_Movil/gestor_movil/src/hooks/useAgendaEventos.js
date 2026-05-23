import { obtenerEventosRangoFechas } from "../services/ServiceAgendaEventos";

import { useState, useEffect } from "react";

export const useAgendaEventosRangoFechas = (
  fecha_inicio,
  fecha_fin,
  cerrar_sesion,
) => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }

  useEffect(() => {
    if (fecha_inicio == null || fecha_fin == null) {
      setEventos([]);
      setCargando(false);
      setRefrescar(false);
      setError(false);
      return;
    }
    obtenerEventosRangoFechas(
      fecha_inicio,
      fecha_fin,
      cerrar_sesion,
    )
      .then((eventosRecuperados) => {
        setEventos(eventosRecuperados.eventos);
        setCargando(false);
        setRefrescar(false);
        setError(false);
      })
      .catch((error) => {
        setEventos([]);
        setCargando(false);
        setRefrescar(false);
        setError(true);
      });
  }, [refrescar, fecha_inicio, fecha_fin, cerrar_sesion]);

  return {
    eventos,
    cargando,
    error,
    lanzarRefresco,
  };
};
