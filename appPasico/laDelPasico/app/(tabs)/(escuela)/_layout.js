import { Drawer } from "expo-router/drawer";
import { StyleSheet, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomHeader } from "../../../componentes/cabecera.jsx";

const CustomHeaderEscuela = ({ navigation, route, options }) => {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Escuela",
  });
};

export default function DrawerLayout() {
  const logo = require("../../../assets/logo.png");
  return (
    <Drawer
      screenOptions={{
        title: "Escuela",
        headerBackgroundContainerStyle: { backgroundColor: "#fff" },
        header: CustomHeaderEscuela,
      }}
    >
      <Drawer.Screen
        name="escuela"
        options={{
          title: "Escuela",
        }}
      />
      <Drawer.Screen
        name="boletines"
        options={{
          title: "Boletines",
        }}
      />
    </Drawer>
  );
}
