import ServiceAgendaEventos from "../../servicios/serviceAgendaEventos";

import ServiceAgendaEventosConcierto from "../../servicios/serviceEventoConcierto";
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
    try {
      return await ServiceAgendaEventos.registrarEvento(evento, cerrar_sesion);
    } catch (error) {
      console.log("Error al registrar el evento:", error);
      throw new Error("Error al registrar el evento");
    }
  }

  async function actualizarEvento(evento) {
    try {
      return await ServiceAgendaEventos.actualizarEvento(evento, cerrar_sesion);
    } catch (error) {
      console.log("Error al actualizar el evento:", error);
      throw new Error("Error al actualizar el evento");
    }
  }

  async function eliminarEvento(nid_evento) {
    try {
      return await ServiceAgendaEventos.eliminarEvento(
        nid_evento,
        cerrar_sesion
      );
    } catch (error) {
      console.log("Error al eliminar el evento:", error);
      throw new Error("Error al eliminar el evento");
    }
  }

  return {
    registrarEvento,
    actualizarEvento,
    eliminarEvento,
  };
};

export const useAgendaEvento = (nid_evento, tipo, cerrar_sesion) => {
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerEvento(tipo, nid_evento)
      .then((eventoRecuperado) => {
        setEvento(eventoRecuperado);
        setCargando(false);
        setError(false);
      })
      .catch((error) => {
        setEvento(null);
        setCargando(false);
        setError(true);
      });
  }, [nid_evento, tipo, cerrar_sesion]);

  async function obtenerAgendaEvento(nid_agenda_evento) {
    try {
      return await ServiceAgendaEventos.obtenerAgendaEvento(
        nid_agenda_evento,
        cerrar_sesion
      );
    } catch (error) {
      console.log("Error al obtener el evento:", error);
      throw new Error("Error al obtener el evento");
    }
  }

  async function obtenerEventoConcierto(nid_evento_concierto) {
    try {
      return await ServiceAgendaEventosConcierto.obtenerEventoConcierto(
        nid_evento_concierto,
        cerrar_sesion
      );
    } catch (error) {
      console.log("Error al obtener el evento de concierto:", error);
      throw new Error("Error al obtener el evento de concierto");
    }
  }

  async function obtenerEvento(tipo, nid_evento) {
    try {
      if (tipo === "Concierto") {
        const eventoConcierto = await obtenerEventoConcierto(nid_evento);
        setEvento(eventoConcierto);
      } else {
        const eventoAgenda = await obtenerAgendaEvento(nid_evento);
        setEvento(eventoAgenda);
      }
    } catch (error) {
      console.log("Error al obtener el evento:", error);
      throw new Error("Error al obtener el evento");
    }
  }
  return {
    evento,
    error,
    cargando,
  };
};
