import React from "react";
import { View, Image } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Pressable } from "react-native";

export const CustomHeader = ({ navigation, route, options, title }) => {
  const logo = require("../assets/logo.png");
  return (
    <SafeAreaView style={estilos.cabecera}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <MaterialIcons name="menu" size={25} color="#000" />
            <Text style={{ fontSize: 13 }}>{title}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Image source={logo} style={estilos.logo} resizeMode="contain" />
      </View>
      <View style={estilos.login}>
        <Link href="/PantallaLogin" asChild>
          <TouchableOpacity onPress={() => console.log("Login")}>
            <View style={{ padding: 10 }}>
              <MaterialIcons name="person" size={30} color="#000" />

              <Text style={{ fontSize: 10 }}>Login</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

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
    justifyContent: "space-between",
  },
  login: {
    flexDirection: "column",
    padding: 10,
    justifyContent: "flex-end",
    borderColor: "#000",
  },
});
