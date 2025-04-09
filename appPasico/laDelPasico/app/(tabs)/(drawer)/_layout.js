import { Drawer } from "expo-router/drawer";
import { StyleSheet, View, Image, Touchable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
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

        header: CustomHeaderInicio,
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
    </Drawer>
  );
}
