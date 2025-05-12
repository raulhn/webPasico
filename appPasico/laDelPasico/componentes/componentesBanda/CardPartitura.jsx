import { View, Text, StyleSheet } from "react-native";
export default function CardPartitura({ partitura }) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{partitura.titulo}</Text>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Categoria:
        </Text>
        <Text> {partitura.categoria}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Autor:
        </Text>
        <Text> {partitura.autor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    height: 120,
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
    paddingBottom: 5,
    fontWeight: "bold",
    color: "#007CFA",
    textOverflow: "ellipsis",
  },
});
