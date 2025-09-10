import { Stack } from "expo-router";
import * as Constantes from "../../../../config/constantes.js"
import { CustomHeaderInicio } from "../../../../componentes/cabecera.jsx";


export default function StackIndex() {
    return(            <Stack
          screenOptions={{
            animation: "slide_from_right", // Animación al navegar
          }}
        >

          <Stack.Screen
            name="galeria"
            options={{headerShown: false}}
      />
        </Stack>)}