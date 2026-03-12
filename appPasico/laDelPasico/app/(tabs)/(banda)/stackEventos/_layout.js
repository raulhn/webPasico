import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import Constantes from "../../../../config/constantes.js";
import { CustomHeaderBanda } from "../../../../componentes/cabecera.jsx";
import { MaterialIcons } from "@expo/vector-icons";
export default function PaginaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // Muestra el encabezado del Stack
        animation: "slide_from_right", // Animación al navegar
      }}
    >
      <Stack.Screen
        name="eventos"
        options={() => ({
          headerShown: true,
          header: (props) => <CustomHeaderBanda {...props} />,
        })}
      />
      <Stack.Screen
        name="[nidEvento]" // Nombre de la pantalla principal
        options={({ route }) => ({
          title: "Evento",
          headerTitleAlign: "center", // Centra el título del encabezado
          headerStyle: {
            backgroundColor: Constantes.COLOR_AZUL, // Color de fondo del encabezado
          },
          headerTintColor: "#fff", // Color del texto del encabezado
          headerTitleStyle: {
            fontWeight: "bold", // Estilo del título
          },
          headerLeft: ({ canGoBack }) => {
            // Si no se puede ir hacia atrás (navegación directa), mostrar botón personalizado
            if (!canGoBack) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(tabs)/(banda)/stackEventos/eventos");
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                  }}
                >
                  <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              );
            }
            // Si puede ir hacia atrás, usar el botón predeterminado
            return null;
          },
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
