import { useState, useEffect } from "react";
import Dia from "./Dia";
import { View } from "react-native";
import SelectorMes from "./SelectorMes";

export default function Agenda({ mes_, anio_ }) {
  const [mes, setMes] = useState(mes_);
  const [anio, setAnio] = useState(anio_);
  const [diasMes, setDiasMes] = useState([]);

  useEffect(() => {
    setMes(mes_);
    setAnio(anio_);
  }, [mes_, anio_]);

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

  useEffect(() => {
    setDiasMes(getCalendarWeeks(anio, mes));
  }, [mes, anio]);

  function mostrarCalendario() {
    const diasSemanas = ["L", "M", "X", "J", "V", "S", "D"];
    var semanasCalendario = [];
    var componentesDiaSemana = [];
    for (let i = 0; i < diasSemanas.length; i++) {
      componentesDiaSemana.push(<Dia numDia={diasSemanas[i]} />);
    }
    semanasCalendario.push(componentesDiaSemana);
    for (let i = 0; i < diasMes.length; i++) {
      semanasCalendario.push(diasMes[i].map((dia) => <Dia numDia={dia.day} />));
    }
    return semanasCalendario;
  }

  function MostrarSemanas() {
    var semanasCalendario = mostrarCalendario();

    return semanasCalendario.map((semana, index) => (
      <View key={index} style={{ flexDirection: "row" }}>
        {semana}
      </View>
    ));
  }

  console.log("Anio inicial:", anio_, "Mes inicial:", mes_);
  console.log("Anio:", anio, "Mes:", mes);
  return (
    <>
      {mes && (
        <SelectorMes
          mes={mes}
          anio={anio}
          setMes={(nMes, nAnio) => {
            setMes(nMes);
            setAnio(nAnio);
          }}
        />
      )}
      <MostrarSemanas />{" "}
    </>
  );
}
