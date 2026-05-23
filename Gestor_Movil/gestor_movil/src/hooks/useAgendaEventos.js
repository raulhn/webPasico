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

  function formatearFecha(fecha) {

    let mes = fecha.getMonth() + 1;
    if (mes < 10) {
      mes = '0' + mes;
    }
    let dia = fecha.getDate();
    if (dia < 10) {
      dia = '0' + dia
    }
    return fecha.getFullYear() + "-" + mes + "-" + dia;
  }

  useEffect(() => {
    if (fecha_inicio == null || fecha_fin == null) {
      setEventos([]);
      setCargando(false);
      setRefrescar(false);
      setError(false);
      return;
    }
    console.log("obtenerEventosRangoFechas", fecha_inicio, fecha_fin)
    let fecha_inicio_formateada = formatearFecha(fecha_inicio)
    let fecha_fin_formateada = formatearFecha(fecha_fin)
    console.log("Obtener eventos", fecha_inicio_formateada, fecha_fin_formateada)
    obtenerEventosRangoFechas(
      fecha_inicio_formateada,
      fecha_fin_formateada,
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
