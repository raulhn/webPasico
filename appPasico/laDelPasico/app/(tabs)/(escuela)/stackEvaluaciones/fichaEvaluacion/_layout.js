import { Stack } from "expo-router";
import * as Constantes from "../../../../../config/constantes.js"
export default function StackMatriculaLayout() {
  return <Stack  
          >
            <Stack.Screen
            name="[nidMatricula]" // Nombre de la pantalla principal
            options={({ route }) => ({
              headerShown: false})}/>
          </Stack>
}