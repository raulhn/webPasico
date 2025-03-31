import { Drawer } from "expo-router/drawer";
import { StyleSheet, View, Image } from "react-native";
export default function DrawerLayout() {
  const logo = require("../../../assets/logo.png");
  return (
    <Drawer
      screenOptions={{
        headerBackgroundContainerStyle: { backgroundColor: "#fff" },
        headerBackground: () => (
          <View style={estilos.headerContainer}>
            <Image source={logo} style={estilos.logo} resizeMode="contain" />
          </View>
        ),
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
  },
  logo: {
    height: 65, // Ajusta la altura del logo según sea necesario
    width: 100, // Ajusta el ancho del logo según sea necesario
  },
});
