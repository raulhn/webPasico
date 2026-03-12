import { Stack, router } from "expo-router";
import Constantes from "../../../../config/constantes.js";
import { CustomHeaderInicio } from "../../../../componentes/cabecera";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function StackAgenda() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // Muestra el encabezado del Stack
        animation: "slide_from_right", // Animación al navegar
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Agenda",
          header: (props) => (
            <CustomHeaderInicio
              {...props}
              title={Constantes.TITULO_PAGINA_TABLON}
            />
          ),
        }}
      />
      <Stack.Screen
        name="[nidAgenda]" // Nombre de la pantalla principal
        options={({ route, navigation }) => ({
          title: "Detalle de Evento",
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
                    router.push("/(tabs)/(drawer)/stackAgenda/");
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                  }}
                >
                  <MaterialIcons name="home" size={24} color="#fff" />
                  <Text style={{ color: "#fff", marginLeft: 5, fontSize: 16 }}>
                    Agenda
                  </Text>
                </TouchableOpacity>
              );
            }
            // Si puede ir hacia atrás, usar el botón predeterminado
            return null;
          },
        })} // Oculta el encabezado para esta pantalla
      />
      <Stack.Screen
        name="evento"
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
          headerShown: true,
          headerLeft: () => null,
          gestureEnabled: false,
        })} // Oculta el encabezado para esta pantalla
      />
    </Stack>
  );
}
