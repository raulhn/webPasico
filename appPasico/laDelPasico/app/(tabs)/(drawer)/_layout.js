import { Drawer } from "expo-router/drawer";
import { CustomHeader } from "../../../componentes/cabecera.jsx";

const CustomHeaderInicio = ({ navigation, route, options }) => {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Inicio",
  });
};

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerBackgroundContainerStyle: { backgroundColor: "#fff" },
        header: (props) => <CustomHeaderInicio {...props} />,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Inicio",
        }}
      />
      <Drawer.Screen
        name="galeria"
        options={{
          title: "Galería",
        }}
      />
      <Drawer.Screen
        name="tablon"
        options={{
          title: "Tablón de anuncios",
        }}
      />
    </Drawer>
  );
}
