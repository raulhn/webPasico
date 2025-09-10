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
            name="index" // Nombre de la pantalla principal
            options={() => ({
              headerShown: true,
              title: "Inicio",
              header: (props) => <CustomHeaderInicio {...props} />,
            })}
          />
    
          <Stack.Screen
            name="pagina"
            options={({ route }) => ({
              title: route.params.titulo,
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