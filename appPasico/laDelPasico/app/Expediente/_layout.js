import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Image } from "react-native";

export default function PaginaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // Muestra el encabezado del Stack
        animation: "slide_from_right", // Animación al navegar
      }}
    >
      <Stack.Screen
        name="[nidMatricula]" // Nombre de la pantalla principal
        options={({ route }) => ({
          title: `${route.params?.titulo || ""}`,
        })} // Oculta el encabezado para esta pantalla
      />
    </Stack>
  );
}

const estilos = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 70,
  },
});
