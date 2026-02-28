import { Stack } from "expo-router";
import Constantes from "../../../../config/constantes.js";
import { CustomHeaderInicio } from "../../../../componentes/cabecera";

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
        options={({ route }) => ({
          title: "Detalle de Evento",
          headerTitleAlign: "center", // Centra el título del encabezado
          headerStyle: {
            backgroundColor: Constantes.COLOR_AZUL, // Color de fondo del encabezado
          },
          headerTintColor: "#fff", // Color del texto del encabezado
          headerTitleStyle: {
            fontWeight: "bold", // Estilo del título
          },
        })} // Oculta el encabezado para esta pantalla
      />
    </Stack>
  );
}
