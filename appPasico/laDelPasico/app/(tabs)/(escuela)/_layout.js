import { Drawer } from "expo-router/drawer";
import { StyleSheet, View, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomHeader } from "../../../componentes/cabecera.jsx";

import { useRol } from "../../../hooks/useRol"; // Asegúrate de que la ruta sea correcta

const CustomHeaderEscuela = ({ navigation, route, options }) => {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Escuela",
  });
};

export default function DrawerLayout() {
  const { esRol } = useRol(); // Hook para verificar roles


  const logo = require("../../../assets/logo.png");


  return (
    <Drawer
      screenOptions={{
        title: "Escuela",
        headerBackgroundContainerStyle: { backgroundColor: "#fff" },
        header: (props) => <CustomHeaderEscuela {...props} />,
      }}
    >
      <Drawer.Screen
        name="escuela"
        options={{
          title: "Escuela",
        }}
      />



   <Drawer.Screen name="FichaAlumno" options={{ title: "Alumnos" }} />


      <Drawer.Screen
        name="expediente"
        options={{
          title: "Matriculas",
          drawerItemStyle: esRol(["ALUMNO"]) ? {} : { display: "none" },
        }}
      ></Drawer.Screen>

   
      <Drawer.Screen
        name="evaluaciones"
        options={{
          title: "Evaluaciones",
          drawerItemStyle: esRol(["PROFESOR"]) ? {} : { display: "none" },
        }}
      />


    </Drawer>
  );
}
