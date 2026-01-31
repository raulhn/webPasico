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

export const useAgendaEventosMes = (mes, anio, cerrar_sesion) => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  const [mesActual, setMesActual] = useState(mes);
  const [anioActual, setAnioActual] = useState(anio);

  useEffect(() => {
    setMesActual(mes);
    setAnioActual(anio);
  }, [mes, anio]);

  function lanzarRefresco() {
    setRefrescar(true);
  }
  useEffect(() => {
    ServiceAgendaEventos.obtenerEventosMes(mesActual, anioActual, cerrar_sesion)
      .then((eventosRecuperados) => {
        setEventos(eventosRecuperados.eventos);
        setCargando(false);
        setRefrescar(false);
        setError(false);
        if (!eventosRecuperados.eventos) {
          setEventos([]);
        }
      })
      .catch((error) => {
        setEventos([]);
        setCargando(false);
        setRefrescar(false);
        setError(true);
      });
  }, [refrescar, mesActual, anioActual, cerrar_sesion]);

  return {
    eventos,
    cargando,
    error,
    lanzarRefresco,
  };
};

export const useAgendaEventosRangoFechas = (
  fecha_inicio,
  fecha_fin,
  cerrar_sesion
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
    ServiceAgendaEventos.obtenerEventosRangoFechas(
      fecha_inicio,
      fecha_fin,
      cerrar_sesion
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

export const useAgendaEventos = (cerrar_sesion) => {
  async function registrarEvento(evento) {
    return await ServiceAgendaEventos.registrarEvento(evento, cerrar_sesion);
  }

  async function actualizarEvento(evento) {
    return await ServiceAgendaEventos.actualizarEvento(evento, cerrar_sesion);
  }

  async function eliminarEvento(nid_evento) {
    return await ServiceAgendaEventos.eliminarEvento(nid_evento, cerrar_sesion);
  }

  return {
    registrarEvento,
    actualizarEvento,
    eliminarEvento,
  };
};
