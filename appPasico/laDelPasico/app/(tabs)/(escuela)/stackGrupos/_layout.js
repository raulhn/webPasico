import { Stack } from "expo-router";
import { CustomHeaderEscuela } from "../../../../componentes/cabecera.jsx";
import Constantes from "../../../../config/constantes.js";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function StackGrupos() {
  return (
    <Stack screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Grupos",
          header: (props) => <CustomHeaderEscuela {...props} />,
        }}
      />
      <Stack.Screen
        name="[nidGrupo]"
        options={{
          title: "Grupo",
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
                    router.push("/(tabs)/(escuela)/stackGrupos/index");
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
        }}
      />
    </Stack>
  );
}
