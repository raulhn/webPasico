import { View, Text, StyleSheet } from "react-native";

export default function Dia({ numDia, disabled = false }) {
  return (
    <View style={estilos.contenedor}>
      <Text style={disabled ? estilos.textoDisabled : estilos.texto}>
        {numDia}
      </Text>
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
  textoDisabled: {
    color: "#ccc",
    fontSize: 20,
  },
});
