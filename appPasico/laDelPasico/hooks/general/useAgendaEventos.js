import ServiceAgendaEventos from "../../services/ServiceAgendaEventos";
import { useState, useEffect } from "react";

export const useAgendaEventos = (fecha, cerrar_sesion) => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const cerrar_sesion = false; // Placeholder, replace with actual session management

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
        console.log("Error al obtener los eventos de la agenda:", error);
        setEventos([]);
        setCargando(false);
        setRefrescar(false);
        setError(true);
      });
  }, [refrescar, cerrar_sesion]);

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
    eventos,
    cargando,
    error,
    lanzarRefresco,
    registrarEvento,
    actualizarEvento,
    eliminarEvento,
  };
};
