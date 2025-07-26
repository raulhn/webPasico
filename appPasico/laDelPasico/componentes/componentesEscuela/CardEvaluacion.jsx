import { View, Text, StyleSheet } from "react-native";

export default function CardEvaluacion({ evaluacion }) {
  return (
    <View style={estilos.card}>
      <Text style={estilos.titulo}>{evaluacion.tipo_progreso}</Text>
      <Text style={estilos.nota}>
        Nota: <Text style={estilos.notaValor}>{evaluacion.nota}</Text>
      </Text>
      <Text style={estilos.comentario}>{evaluacion.comentario}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#f8faff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e3eaf2",
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007CFA",
    marginBottom: 6,
  },
  nota: {
    fontSize: 15,
    color: "#222",
    marginBottom: 4,
    fontWeight: "500",
  },
  notaValor: {
    color: "#007CFA",
    fontWeight: "bold",
    fontSize: 16,
  },
  comentario: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
    fontStyle: "italic",
  },
});
