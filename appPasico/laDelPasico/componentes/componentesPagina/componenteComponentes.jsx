import { useComponenteComponentes } from "../../hooks/componentes/useComponenteComponentes";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Componente from "./componente";

export default function ComponenteComponentes({ nidComponente }) {
  const { componentes, cargando, error } =
    useComponenteComponentes(nidComponente);
  if (cargando) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los componentes.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {componentes.map((componente) => (
        <Componente
          key={componente.nid_Componente_hijo}
          componente={componente}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cargandoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
