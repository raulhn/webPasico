import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Image } from "react-native";
import Constantes from "../../config/constantes.js";

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
          title: "Evaluaciones",
          headerTitleAlign: "center", // Centra el título del encabezado
          headerStyle: {
            backgroundColor: Constantes.COLOR_AZUL, // Color de fondo del encabezado
          },
          headerTintColor: "#fff", // Color del texto del encabezado
          headerTitleStyle: {
            fontWeight: "bold", // Estilo del título
          },
        })} 
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
