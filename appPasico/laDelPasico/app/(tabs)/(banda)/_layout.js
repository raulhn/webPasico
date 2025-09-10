import { Drawer } from "expo-router/drawer";

import { CustomHeader } from "../../../componentes/cabecera.jsx";
import { useRol } from "../../../hooks/useRol"; // Asegúrate de que la ruta sea correcta
import { CustomHeaderBanda } from "../../../componentes/cabecera.jsx";


export default function DrawerLayout() {
  const { esRol } = useRol();

  const logo = require("../../../assets/logo.png");

  return (
    <Drawer
      screenOptions={{
        headerBackgroundContainerStyle: { backgroundColor: "#fff" },
        header: (props) => <CustomHeaderBanda {...props} />,
      }}
    >
      <Drawer.Screen
        name="banda"
        options={{
          title: "Banda",
        }}
      />
      <Drawer.Screen
        name="stackEventos"
        options={{
          title: "Eventos",
          headerShown: false,
          drawerItemStyle: esRol(["MUSICO"]) ? {} : { display: "none" },
        }}
      />

      <Drawer.Screen
        name="archivoDigital"
        options={{
          title: "Archivo Digital",
          drawerItemStyle: esRol(["MUSICO"]) ? {} : { display: "none" },
        }}
      />


    </Drawer>
  );
}
