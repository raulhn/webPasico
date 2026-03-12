import { Stack, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function StackMatriculaLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[nidMatricula]" // Nombre de la pantalla principal
        options={({ route }) => ({
          headerShown: false,
          headerLeft: ({ canGoBack }) => {
            // Si no se puede ir hacia atrás (navegación directa), mostrar botón personalizado
            if (!canGoBack) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.push(
                      "/(tabs)/(escuela)/stackEvaluaciones/selectorEvaluaciones"
                    );
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
          headerLeft: () => null,
          gestureEnabled: false,
        })}
      />
    </Stack>
  );
}
