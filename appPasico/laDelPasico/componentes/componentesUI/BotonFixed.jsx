import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";

export default function BotonFixed({ onPress }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        {
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#007CFA",
          width: 50, // Ancho del botón
          height: 50, // Alto del botón (igual al ancho para que sea redondo)
          borderRadius: 30, //
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        },
        isPressed && {
          backgroundColor: "#005BB5", // Color más oscuro al presionar
          transform: [{ scale: 0.95 }], // Efecto de escala al presionar
        },
      ]}
    >
      <View>
        <MaterialIcons name="add" size={24} color="white" />
      </View>
    </Pressable>
  );
}
