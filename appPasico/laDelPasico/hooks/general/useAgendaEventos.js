import ServiceAgendaEventos from "../../servicios/serviceAgendaEventos";
import { useState, useEffect } from "react";

export const useAgendaEventosFecha = (fecha, cerrar_sesion) => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }
  useEffect(() => {
    ServiceAgendaEventos.obtenerEventosFecha(fecha, cerrar_sesion)
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
  }, [refrescar, cerrar_sesion]);

  return {
    eventos,
    cargando,
    error,
    lanzarRefresco,
  };
};

export const useAgendaEventos = (cerrar_sesion) => {
  function registrarEvento(evento) {
    return ServiceAgendaEventos.registrarEvento(evento, cerrar_sesion);
  }

  function actualizarEvento(evento) {
    return ServiceAgendaEventos.actualizarEvento(evento, cerrar_sesion);
  }

  function eliminarEvento(nid_evento) {
    return ServiceAgendaEventos.eliminarEvento(nid_evento, cerrar_sesion);
  }

  return {
    registrarEvento,
    actualizarEvento,
    eliminarEvento,
  };
};
