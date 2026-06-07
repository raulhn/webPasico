import { Stack, router } from "expo-router";
import * as Constantes from "../../../../config/constantes.js";
import { CustomHeaderInicio } from "../../../../componentes/cabecera.jsx";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function StackAdministracion() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right", // Animación al navegar
      }}
    >
      <Stack.Screen
        name="pantallaListadoPersonas"
        options={() => ({
          headerShown: true,
          title: "Personas",

          header: (props) => <CustomHeaderInicio {...props} />,
        })}
      />
    </Stack>
  );
}
