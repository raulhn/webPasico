import { View, Text, StyleSheet } from "react-native";

export default function Dia({ numDia }) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.texto}>{numDia}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  texto: {
    fontSize: 20,
    color: "#333",
  },
});
