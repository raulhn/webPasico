import React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";

import {
  ViewPropTypes,
  StyleSheet,
  View,
  StyledText,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";

import { Link } from "expo-router";

export default function AppBar() {
  return (
    <View style={estilos.container}>
      <Link asChild href="/">
        <TouchableOpacity>
          <View style={estilos.boton}>
            <MaterialIcons name="home" size={30} color="black" />
            <Text style={{ fontSize: 10 }}>Inicio</Text>
          </View>
        </TouchableOpacity>
      </Link>
      <Link asChild href="/escuela">
        <TouchableOpacity>
          <View style={estilos.boton}>
            <MaterialIcons name="school" size={30} color="black" />
            <Text style={{ fontSize: 10 }}>Escuela</Text>
          </View>
        </TouchableOpacity>
      </Link>
      <Link asChild href="/banda">
        <TouchableOpacity>
          <View style={estilos.boton}>
            <MaterialCommunityIcons name="trumpet" size={30} color="black" />
            <Text style={{ fontSize: 10 }}>Banda</Text>
          </View>
        </TouchableOpacity>
      </Link>
      <Link asChild href="/asociacion">
        <TouchableOpacity>
          <View style={estilos.boton}>
            <MaterialIcons name="group" size={30} color="black" />
            <Text style={{ fontSize: 10 }}>Socios</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    display: "flex",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "gray",
    borderTopColor: "black",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",

    padding: 10,
  },
  boton: {
    padding: 10,
    borderColor: "black",
    textAlign: "center",
    alignItems: "center",
    borderWidth: 1,
    witdh: "auto",
  },
  boton_container: {
    borderWidth: 1,
    borderColor: "black",
  },
});
