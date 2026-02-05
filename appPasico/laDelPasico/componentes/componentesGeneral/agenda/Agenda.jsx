import { useState, useEffect } from "react";
import Dia from "./Dia";
import { View, StyleSheet, FlatList, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectorMes from "./SelectorMes";
import {
  useAgendaEventosMes,
  useAgendaEventosRangoFechas,
} from "../../../hooks/general/useAgendaEventos";
import { AuthContext } from "../../../providers/AuthContext";
import { useContext } from "react";
import EventoAgenda from "./EventoAgenda";
import FormularioAgenda from "./FormularioAgenda";
import { BotonFixed } from "../../componentesUI/ComponentesUI";
import Constantes from "../../../config/constantes.js";
import { useRol } from "../../../hooks/useRol.js";

export default function Agenda({ mes_, anio_ }) {
  const [mes, setMes] = useState(mes_);
  const [anio, setAnio] = useState(anio_);
  const [diasMes, setDiasMes] = useState([]);
  const [eventosDia, setEventosDia] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  useEffect(() => {
    setMes(mes_);
    setAnio(anio_);
  }, [mes_, anio_]);
  const { esRol } = useRol();
  const { cerrarSesion } = useContext(AuthContext);
  const [diaSelecionado, setDiaSeleccionado] = useState(null);

  const { eventos, cargando, error, lanzarRefresco } =
    useAgendaEventosRangoFechas(fechaInicio, fechaFin, cerrarSesion);
  const [visibleFormulario, setVisibleFormulario] = useState(false);

  function ButtonAdd() {
    if (esRol([Constantes.ROL_ADMINISTRADOR])) {
      return (
        <BotonFixed
          onPress={() => {
            setVisibleFormulario(true);
          }}
        />
      );
    }
    return null;
  }

  console.log("Eveentos recuperados", eventos);
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

  useEffect(() => {
    const arrayCalendario = getCalendarWeeks(anio, mes);
    setDiasMes(arrayCalendario);
    if (arrayCalendario.length > 0) {
      setFechaInicio(arrayCalendario[0][0].date);
      setFechaFin(arrayCalendario[arrayCalendario.length - 1][6].date);
    }
  }, [mes, anio]);

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

  function mostrarCalendario() {
    const diasSemanas = ["L", "M", "X", "J", "V", "S", "D"];
    var semanasCalendario = [];
    var componentesDiaSemana = [];

    const fechaHoy = new Date();
    for (let i = 0; i < diasSemanas.length; i++) {
      componentesDiaSemana.push(
        <Dia key={diasSemanas[i]} numDia={diasSemanas[i]} />
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
        ))
      );
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

  return (
    <>
      <SafeAreaView style={estilos.contenedor}>
        <SelectorMes
          mes={mes}
          anio={anio}
          setMes={(nMes, nAnio) => {
            setMes(nMes);
            setAnio(nAnio);
          }}
        />
        <MostrarSemanas />
        <View style={{ marginTop: 20, width: "100%", paddingHorizontal: 10 }}>
          <FlatList
            data={eventosDia}
            keyExtractor={(item) => item.nid_evento.toString()}
            onRefresh={() => lanzarRefresco()}
            refreshing={cargando}
            renderItem={({ item }) => (
              <EventoAgenda
                evento={item}
                accion={() => {
                  lanzarRefresco();
                }}
              />
            )}
          />
        </View>

        <View style={estilos.botonFix}>
          <ButtonAdd />
        </View>
        <Modal
          animationType="slide"
          visible={visibleFormulario}
          onRequestClose={() => {
            setVisibleFormulario(false);
          }}
        >
          <FormularioAgenda
            cerrar_sesion={cerrarSesion}
            volver={() => {
              setVisibleFormulario(false);
              lanzarRefresco();
            }}
          />
        </Modal>
      </SafeAreaView>
    </>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: "white",
    padding: 10,
    height: "100%",
  },
  contendorAgenda: {
    alignItems: "center",
  },
  botonFix: {
    position: "absolute",
    bottom: 200,
    right: 20,
  },
});
