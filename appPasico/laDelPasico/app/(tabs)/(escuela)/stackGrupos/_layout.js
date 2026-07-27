import { Stack } from "expo-router";
import { CustomHeaderEscuela } from "../../../../componentes/cabecera.jsx";

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
          header: (props) => <CustomHeaderEscuela {...props} />,
        }}
      />
    </Stack>
  );
}
