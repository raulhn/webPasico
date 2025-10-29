import { Drawer } from "expo-router/drawer";
import { CustomHeaderInicio } from "../../../componentes/cabecera.jsx";


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
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="stackGaleria"
        options={{
          title: "Galería",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="stackAnuncios"
        options={{
          title: "Tablón de anuncios",
          headerShown: false,
        }}
      />


    </Drawer>
  );
}
