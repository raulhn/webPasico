import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

export default function Boton({
  nombre,
  onPress,
  color = "#007BFF",
  colorTexto = "#fff",
}) {
  const [presionado, setPresionado] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPresionado(true)}
      onPressOut={() => setPresionado(false)}
    >
      <View
        style={[
          estilos.boton,
          { backgroundColor: color },
          presionado && { opacity: 0.5, transform: [{ scale: 0.95 }] },
        ]}
      >
        <Text style={([estilos.textoBoton], { color: colorTexto })}>
          {nombre}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  textoBoton: {
    textAlign: "center",
  },
});
