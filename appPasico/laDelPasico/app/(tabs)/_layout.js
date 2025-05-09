import { Tabs } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContext"; // Ajusta la ruta según tu estructura de carpetas

export default function TabsLayout() {
  const { roles } = useContext(AuthContext); // Obtiene el contexto de autenticación

  function opcionesSocio() {
    let opciones = {
      headerShown: false,
      title: "Asociación",
      tabBarIcon: ({ color }) => (
        <MaterialIcons name="group" size={30} color={color} />
      ),
    };

    if (!roles || roles.length === 0) {
      return {
        ...opciones,
        href: null,
      }; // Si no hay roles, no se muestra la opción
    }

    const rolSocio = roles.find((elemento) => elemento.rol === "SOCIO");

    if (!rolSocio) {
      return {
        ...opciones,
        href: null,
      }; // Si no hay rol de socio, no se muestra la opción
    } else {
      return opciones;
    }
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="(drawer)"
        options={{
          title: "Inicio",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(escuela)"
        options={{
          headerShown: false,
          title: "Escuela",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="school" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(banda)"
        options={{
          headerShown: false,
          title: "Banda",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="trumpet" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        ScreenOptions={{
          headerShown: false,
        }}
        name="(socios)"
        options={opcionesSocio()}
      />
    </Tabs>
  );
}
