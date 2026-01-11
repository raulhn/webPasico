import Agenda from "../../../../componentes/componentesGeneral/agenda/Agenda";
import { View, StyleSheet } from "react-native";
export default function PantallaAgenda() {
  let fecha = new Date();

  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();

  return (
    <View styles={estilos.contenedor}>
      <Agenda mes_={mes} anio_={anio} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
