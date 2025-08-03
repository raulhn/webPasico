import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Constantes from "../../config/constantes";

export default function CardAnuncio({ anuncio, onPress }) {
  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{anuncio.titulo}</Text>
      <Text style={styles.descripcion} numberOfLines={2}>
        {anuncio.descripcion}
      </Text>
      <Text style={styles.tipo}>{anuncio.tipo_tablon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    marginHorizontal: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: Constantes.COLOR_AZUL,
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
  },
  tipo: {
    fontSize: 13,
    color: "#0077b6",
    fontWeight: "600",
    alignSelf: "flex-end",
  },
});
