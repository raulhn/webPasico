import { ScrollView, StyleSheet, View } from "react-native";

import HistorialSolicitudesImpresion from "../../../componentes/componentesPartitura/HistorialSolicitudesImpresion";

export default function HistorialSolicitudesImpresionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <View style={styles.contenido}>
        <HistorialSolicitudesImpresion />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  contenido: {
    padding: 16,
  },
});
