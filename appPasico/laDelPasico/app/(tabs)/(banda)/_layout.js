import { Drawer } from "expo-router/drawer";

import { CustomHeader } from "../../../componentes/cabecera.jsx";

const CustomHeaderBanda = ({ navigation, route, options }) => {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Banda",
  });
};

export default function DrawerLayout() {
  const logo = require("../../../assets/logo.png");
  return (
    <Drawer
      screenOptions={{
        headerBackgroundContainerStyle: { backgroundColor: "#fff" },

        header: CustomHeaderBanda,
      }}
    >
      <Drawer.Screen
        name="banda"
        options={{
          title: "Banda",
        }}
      />
      <Drawer.Screen
        name="parituras"
        options={{
          title: "Partituras",
        }}
      />
    </Drawer>
  );
}
