import { Drawer } from "expo-router/drawer";
import { StyleSheet, View, Image } from "react-native";
import { CustomHeader } from "../../../componentes/cabecera";

import { useRol } from "../../../hooks/useRol"; // Asegúrate de que la ruta sea correcta

const CustomHeaderAsociacion = ({ navigation, route, options }) => {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Asociación",
  });
};

export default function DrawerLayout() {
  const { esRol } = useRol(); // Hook para verificar roles

  return (
    <Drawer
      screenOptions={{
        headerBackgroundContainerStyle: { backgroundColor: "#fff" },
        header: (props) => <CustomHeaderAsociacion {...props} />,
      }}
    >
      <Drawer.Screen
        name="asociacion"
        options={{
          drawerLabel: "Asociación",
          title: "overview",
          headerTitle: "Asociación",
        }}
      />
      <Drawer.Screen
        name="carnet"
        options={{
          drawerLabel: "Carnet",
          title: "Carnet",
          drawerItemStyle: esRol("SOCIO") ? {} : { display: "none" },
        }}
      />
    </Drawer>
  );
}

const estilos = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: "flex-end", // Centra el contenido verticalmente
    alignItems: "center", // Centra el contenido horizontalmente
    position: "absolute",
    right: "50%",
    left: "50%",
    top: "80%",
  },
  logo: {
    height: 65, // Ajusta la altura del logo según sea necesario
    width: 100, // Ajusta el ancho del logo según sea necesario
  },
  cabecera: {
    backgroundColor: "#fff",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
