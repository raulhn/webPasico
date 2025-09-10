import { Stack } from "expo-router";
import * as Constantes from "../../../../config/constantes.js"
import { CustomHeaderEscuela } from "../../../../componentes/cabecera.jsx";


export default function StackAlumnos() {
    return(            <Stack
          screenOptions={{
            animation: "slide_from_right", // Animación al navegar
          }}
        >
          <Stack.Screen
            name="alumnos" // Nombre de la pantalla principal
            options={() => ({
         
              title: "Alumnos",
              header: (props) => <CustomHeaderEscuela {...props} />,
            })}
          />
    
          <Stack.Screen
            name="[nidAlumno]"
            options={({ route }) => ({
              title: "Ficha de Alumno",
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
              gestureEnabled: false
            })} // Oculta el encabezado para esta pantalla
          />
        </Stack>)}