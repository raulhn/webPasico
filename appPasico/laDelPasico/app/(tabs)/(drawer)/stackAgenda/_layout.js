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
    </Stack>
  );
}
