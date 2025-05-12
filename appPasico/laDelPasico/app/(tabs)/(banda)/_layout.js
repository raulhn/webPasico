import { Drawer } from "expo-router/drawer";

import { CustomHeader } from "../../../componentes/cabecera.jsx";
import { useRol } from "../../../hooks/useRol"; // Asegúrate de que la ruta sea correcta

const CustomHeaderBanda = ({ navigation, route, options }) => {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Banda",
  });
};

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
        name="partituras"
        options={{
          title: "Partituras",
          drawerItemStyle: esRol("MUSICO") ? {} : { display: "none" },
        }}
      />
    </Drawer>
  );
}
