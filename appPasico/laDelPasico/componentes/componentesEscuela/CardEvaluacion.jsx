import { View, Text, StyleSheet } from "react-native";

export default function CardEvaluacion({ evaluacion }) {
  return (
    <View style={estilos.card}>
      <Text style={estilos.titulo}>{evaluacion.nombre_asignatura}</Text>
      {evaluacion.nota !== 0 && (
        <View style={estilos.notaRow}>
          <Text style={estilos.notaLabel}>Nota:</Text>
          <Text style={estilos.notaValor}>{evaluacion.nota}</Text>
        </View>
      )}
      {evaluacion.comentario !== "" && (
        <View style={estilos.comentarioBox}>
          <Text style={estilos.comentarioLabel}>Comentario:</Text>
          <Text style={estilos.comentario}>{evaluacion.comentario}</Text>
        </View>
      )}
      <View style={estilos.infoRow}>
        <Text style={estilos.infoLabel}>{evaluacion.tipo_progreso}</Text>
      </View>
      <View style={estilos.infoRow}>
        <Text style={estilos.infoLabel}>Profesor:</Text>
        <Text style={estilos.infoValue}>{evaluacion.nombre_profesor}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#f8faff",
    borderRadius: 14,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#007CFA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e3eaf2",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007CFA",

    letterSpacing: 0.5,
  },
  notaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  notaLabel: {
    fontSize: 15,
    color: "#222",
    fontWeight: "bold",
  },
  notaValor: {
    fontSize: 17,
    color: "#007CFA",
    fontWeight: "bold",
    backgroundColor: "#eaf2fb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  comentarioBox: {
    backgroundColor: "#eef6ff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  comentarioLabel: {
    fontSize: 13,
    color: "#007CFA",
    fontWeight: "bold",
    marginBottom: 2,
  },
  comentario: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
  },
  infoRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#007CFA",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
    flexShrink: 1,
  },
});
