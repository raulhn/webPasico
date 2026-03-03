import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAgendaEvento } from "../../../hooks/general/useAgendaEventos.js";

export default function DetalleEvento({ nid_evento, tipo, cerrar_sesion }) {
  const { evento, error, cargando } = useAgendaEvento(
    nid_evento,
    tipo,
    cerrar_sesion
  );

  console.log("Evento", evento);
  if (cargando) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando evento</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.cargandoContainer}>
        <Text>Error al cargar el evento</Text>
      </View>
    );
  }

  console.log("DetalleEvento: ", evento);
  return <ScrollView></ScrollView>;
}

const styles = StyleSheet.create({
  cargandoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
