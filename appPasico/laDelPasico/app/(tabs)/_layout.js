import { Tabs } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContext"; // Ajusta la ruta según tu estructura de carpetas

export default function TabsLayout() {
  const { roles } = useContext(AuthContext); // Obtiene el contexto de autenticación

  function opcionesRol(icono, tipoIcono, rol, titulo) {
    let opciones = {
      headerShown: false,
      title: titulo,
      tabBarIcon: ({ color }) => {
        console.log("TipoIcono", tipoIcono);
        if (tipoIcono === 1) {
          return (
            <MaterialCommunityIcons name="trumpet" size={30} color={color} />
          );
        } else {
          return <MaterialIcons name={icono} size={30} color={color} />;
        }
      },
    };

    return opciones;
    /**  Mostrar Tabs dpendiendo del rol
    if (!roles || roles.length === 0) {
      return {
        ...opciones,
        href: null,
      }; // Si no hay roles, no se muestra la opción
    }

    const rolSocio = roles.find((elemento) => elemento.rol === rol);

    if (!rolSocio) {
      return {
        ...opciones,
        href: null,
      }; // Si no hay rol de socio, no se muestra la opción
    } else {
      return opciones;
    }*/
  }

  function opcionesInicio() {
    return {
      title: "Inicio",
      headerShown: false,
      tabBarIcon: ({ color }) => (
        <MaterialIcons name="home" size={30} color={color} />
      ),
    };
  }

  return (
    <Tabs>
      <Tabs.Screen name="(drawer)" options={opcionesInicio()} />
      <Tabs.Screen
        name="(escuela)"
        options={opcionesRol("school", 2, "ALUMNO", "Escuela")}
      />
      <Tabs.Screen
        name="(banda)"
        options={opcionesRol("trumpet", 1, "MUSICO", "Banda")}
      />
      <Tabs.Screen
        ScreenOptions={{
          headerShown: false,
        }}
        name="(socios)"
        options={opcionesRol("group", 2, "SOCIO", "Asociación")}
      />
    </Tabs>
  );
}
