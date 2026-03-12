import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Constantes from "../../../../config/constantes.js";
import { CustomHeaderEscuela } from "../../../../componentes/cabecera.jsx";
import { TouchableOpacity } from "react-native";

export default function StackEvaluaciones() {
  return (
    <Stack>
      <Stack.Screen
        name="selectorEvaluaciones" // Nombre de la pantalla principal
        options={() => ({
          headerShown: true,
          title: "Lista",
          header: (props) => <CustomHeaderEscuela {...props} />,
        })}
      />

      <Stack.Screen
        name="[nidCurso]"
        options={() => ({
          title: "Evaluaciones",
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
                    router.push("/(tabs)/(escuela)/stackEvaluaciones/");
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
        })}
      />

      <Stack.Screen
        name="fichaEvaluacion"
        options={() => ({
          title: "Evaluación",
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
                    router.push("/(tabs)/(escuela)/stackEvaluaciones/");
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
        })} // Oculta el encabezado para esta pantalla
      />
    </Stack>
  );
}
