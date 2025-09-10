import { Stack } from "expo-router";
import * as Constantes from "../../../../config/constantes.js"
import { CustomHeaderEscuela } from "../../../../componentes/cabecera.jsx";

export default function StackEvaluaciones() {
    return(            <Stack>
  
          <Stack.Screen
            name="selectorEvaluaciones" // Nombre de la pantalla principal
            options={() => ({
              headerShown: true,
              title: "Lista",
      header: (props) => <CustomHeaderEscuela {...props} />
            })}
  
          />
    
          <Stack.Screen
            name="[nidCurso]"
            options={() => ({
              title: "Evaluaciones",
              headerTitleAlign: "center", // Centra el título del encabezado
              headerStyle: {
                backgroundColor: Constantes.COLOR_AZUL, // Color de fondo del encabezado
              },
              headerTintColor: "#fff", // Color del texto del encabezado
              headerTitleStyle: {
                fontWeight: "bold", // Estilo del título
              },
              headerShown: true,
            })} 
          />

          <Stack.Screen
          name="fichaEvaluacion"
           options={() => ({
         title: "Evaluación",
              headerTitleAlign: "center", // Centra el título del encabezado
              headerStyle: {
                backgroundColor: Constantes.COLOR_AZUL, // Color de fondo del encabezado
              },
              headerTintColor: "#fff", // Color del texto del encabezado
              headerTitleStyle: {
                fontWeight: "bold", // Estilo del título
              },
              headerShown: true,
            })} // Oculta el encabezado para esta pantalla
          />

        </Stack>)}
