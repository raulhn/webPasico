import { Stack } from "expo-router";
import { CustomHeaderEscuela } from "../../../../componentes/cabecera.jsx";

export default function StackGrupos() {
  return (
    <Stack screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Asistencia por asignatura",
          header: (props) => <CustomHeaderEscuela {...props} />,
        }}
      />
    </Stack>
  );
}
