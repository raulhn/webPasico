import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Constantes from "../../../../config/constantes.js";
import { CustomHeaderInicio } from "../../../../componentes/cabecera.jsx";
import { TouchableOpacity } from "react-native";

export default function StackIndex() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // Animación al navegar
      }}
    >
      <Stack.Screen
        name="index" // Nombre de la pantalla principal
        options={() => ({
          headerShown: true,
          title: "Inicio",
          header: (props) => <CustomHeaderInicio {...props} />,
        })}
      />
      <Stack.Screen
        name="Inicio" // Nombre de la pantalla principal
        options={() => ({
          headerShown: true,
          title: "Inicio",
          header: (props) => <CustomHeaderInicio {...props} />,
        })}
      />

      <Stack.Screen
        name="pagina"
        options={({ route }) => ({
          title: route.params.titulo,
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
                    router.replace("Inicio");
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

          headerShown: true,
          gestureEnabled: false,
        })} // Oculta el encabezado para esta pantalla
      />
    </Stack>
  );
}
