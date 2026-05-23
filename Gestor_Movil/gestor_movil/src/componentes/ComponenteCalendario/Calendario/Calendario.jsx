import React, { useState, useEffect } from "react";
import Dia from "../Dia/Dia";
import { useAgendaEventosRangoFechas } from "../../../hooks/useAgendaEventos";

export default function Calendario({ mes_, anio_ }) {
  const [mes, setMes] = useState(mes_);
  const [anio, setAnio] = useState(anio_);
  const [diasMes, setDiasMes] = useState([]);
  const [eventosDia, setEventosDia] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const [diaSelecionado, setDiaSeleccionado] = useState(null);

  const [numSemanas, setNumSemanas] = useState(0);

  const { eventos, cargando, error, lanzarRefresco } =
    useAgendaEventosRangoFechas(fechaInicio, fechaFin);

  useEffect(() => {
    setMes(mes_);
    setAnio(anio_);
  }, [mes_, anio_]);

  useEffect(() => {
    const arrayCalendario = getCalendarWeeks(anio, mes);
    setDiasMes(arrayCalendario);
    if (arrayCalendario.length > 0) {
      setFechaInicio(arrayCalendario[0][0].date);
      setFechaFin(arrayCalendario[arrayCalendario.length - 1][6].date);
    }
  }, [mes, anio]);

  useEffect(() => {
    if (diaSelecionado) {
      actualizarEventosDia(diaSelecionado);
    } else {
      const diaHoy = new Date();
      const diaFormateado = {
        dia: diaHoy.getDate(),
        mes: diaHoy.getMonth() + 1,
        año: diaHoy.getFullYear(),
      };
      setDiaSeleccionado(diaFormateado);
      actualizarEventosDia(diaFormateado);
    }
  }, [eventos]);

  function existeAlgunEvento(dia_) {
    if (!eventos) {
      return false;
    }
    const existe = eventos.some((evento) => {
      const fechaEvento = new Date(evento.fecha);
      return (
        fechaEvento.getDate() == dia_.day &&
        fechaEvento.getMonth() + 1 == dia_.month &&
        fechaEvento.getFullYear() == dia_.year
      );
    });
    return existe;
  }

  function actualizarEventosDia(dia_) {
    if (!eventos) {
      setEventosDia([]);
      return;
    }
    const eventosDiaHoy = eventos.filter((evento) => {
      const fechaEvento = new Date(evento.fecha);
      return (
        fechaEvento.getDate() == dia_.dia &&
        fechaEvento.getMonth() + 1 == dia_.mes &&
        fechaEvento.getFullYear() == dia_.año
      );
    });
    setEventosDia(eventosDiaHoy);
  }

  function mostrarCalendario() {
    const diasSemanas = ["L", "M", "X", "J", "V", "S", "D"];
    var semanasCalendario = [];
    var componentesDiaSemana = [];

    const fechaHoy = new Date();
    for (let i = 0; i < diasSemanas.length; i++) {
      componentesDiaSemana.push(
        <Dia key={diasSemanas[i]} numDia={diasSemanas[i]} />,
      );
    }
    semanasCalendario.push(componentesDiaSemana);
    for (let i = 0; i < diasMes.length; i++) {
      semanasCalendario.push(
        diasMes[i].map((dia) => (
          <Dia
            key={dia.day + "-" + dia.month + "-" + dia.year}
            numDia={dia.day}
            disabled={mes != dia.month}
            accion={() => {
              const diaFormateado = {
                dia: dia.day,
                mes: dia.month,
                año: dia.year,
              };
              setDiaSeleccionado(diaFormateado);
              actualizarEventosDia(diaFormateado);
            }}
            esHoy={
              dia.year == fechaHoy.getFullYear() &&
              dia.month == fechaHoy.getMonth() + 1 &&
              dia.day == fechaHoy.getDate()
            }
            esSeleccionado={
              diaSelecionado &&
              dia.year == diaSelecionado.año &&
              dia.month == diaSelecionado.mes &&
              dia.day == diaSelecionado.dia
            }
            tieneEvento={existeAlgunEvento(dia)}
          />
        )),
      );
    }
    return semanasCalendario;
  }
  const semanasCalendario = mostrarCalendario();
  useEffect(() => {
    setNumSemanas(semanasCalendario.length);
  }, [mes, anio, eventos]);

  function MostrarSemanas() {
    return semanasCalendario.map((semana, index) => (
      <div key={index} style={{ flexDirection: "row", height: 50 }}>
        {semana}
      </div>
    ));
  }

  //Funcion para obtener las semanas del calendario
  function getCalendarWeeks(year, month) {
    const weeks = [];

    // Primer día del mes
    const firstDay = new Date(year, month - 1, 1);

    // Último día del mes
    const lastDay = new Date(year, month, 0);

    // Día de la semana del primer día (0=Domingo, 1=Lunes, ..., 6=Sábado)
    let firstDayOfWeek = firstDay.getDay();

    // Convertir para que lunes sea 0 (0=Lunes, .. ., 6=Domingo)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Calcular el primer lunes (puede ser del mes anterior)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);

    // Día de la semana del último día
    let lastDayOfWeek = lastDay.getDay();
    lastDayOfWeek = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;

    // Calcular el último domingo (puede ser del mes siguiente)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfWeek));

    // Iterar por semanas
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const week = [];

      // Agregar 7 días (lunes a domingo)
      for (let i = 0; i < 7; i++) {
        const dayInfo = {
          day: currentDate.getDate(),
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          isCurrentMonth: currentDate.getMonth() === month - 1,
          date: new Date(currentDate),
        };

        week.push(dayInfo);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
    }

    return weeks;
  }


  return (
    <mostrarCalendario />
  )
}
