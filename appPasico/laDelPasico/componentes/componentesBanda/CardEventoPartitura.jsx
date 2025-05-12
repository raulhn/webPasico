import { Text, View, StyleSheet } from "react-native";

export default function CardEventoPartitura({ EventoPartitura }) {
  return (
    <View style={styles.card}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titulo}>
        {EventoPartitura.nombre}
      </Text>

      <Text numberOfLines={3} ellipsizeMode="tail">
        {EventoPartitura.descripcion}
      </Text>

      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 10,
          right: 20,
        }}
      >
        <Text style={{ color: "#007CFA", fontWeight: "bold" }}>Fecha: </Text>
        <Text>{EventoPartitura.fecha}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    width: "90%",
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007CFA",
  },
});
