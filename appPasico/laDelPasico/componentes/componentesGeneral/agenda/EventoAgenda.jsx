import { View, Text, StyleSheet } from "react-native";
import { obtenerFechaFormateada } from "../../../comun/fechas.js";

export default function EventoAgenda({ evento }) {
  return (
    <View style={estilos.contenedorEvento}>
      <Text style={estilos.tituloEvento}>{evento.nombre}</Text>
      <Text style={estilos.descripcionEvento}>{evento.descripcion}</Text>
      <Text style={estilos.fechaEvento}>
        {obtenerFechaFormateada(evento.fecha)}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorEvento: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descripcionEvento: {
    fontSize: 14,
    color: "#666",
  },
  fechaEvento: {
    fontSize: 12,
    color: "#999",
  },
});
