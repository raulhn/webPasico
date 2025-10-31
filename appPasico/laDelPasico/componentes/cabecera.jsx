import { View, Image } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Constantes from "../config/constantes.js";
import { AuthContext } from "../providers/AuthContext";
import { useContext, useState, useEffect } from "react";
import serviceUsuario from "../servicios/serviceUsuario";

export const CustomHeader = ({ navigation, route, options, title }) => {
  const { usuario, iniciarSesion, cerrarSesion, guardarRoles } =
    useContext(AuthContext); // Obtiene el contexto de autenticación

  useEffect(() => {
    serviceUsuario
      .obtenerUsuario(cerrarSesion)
      .then((response) => {
        if (response.usuario) {
          iniciarSesion(response.usuario); // Actualiza el estado del usuario en el contexto
          guardarRoles(response.roles); // Guarda los roles en el contexto
        } else {
          console.log("No hay usuario autenticado");
          iniciarSesion(null); // Si no hay usuario, establece el estado como nulo
          guardarRoles([]); // Limpia los roles en el contexto
        }
      })
      .catch((error) => {
        console.log("Error al obtener el usuario", error);
      });
  }, []);

  console.log("Usuario en cabecera:", usuario);
  const logo = require("../assets/logo.png");

  function enlaceLogin() {
    if (usuario) {
      return "/PantallaPerfil";
    } else {
      return "/PantallaLogin";
    }
  }

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
        <Link href={enlaceLogin()} asChild>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={{
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="person"
                size={30}
                color={usuario ? Constantes.COLOR_AZUL : "black"}
              />

              <Text
                style={{
                  fontSize: 10,
                  textAlign: "center",
                  color: usuario ? Constantes.COLOR_AZUL : "black",
                }}
              >
                {usuario ? "Mi perfil" : "Login"}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};


export function CustomHeaderEscuela({ navigation, route, options }) {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Escuela",
  });
};

export function CustomHeaderBanda({ navigation, route, options }) {
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Banda",
  });
};

export function CustomHeaderInicio ({ navigation, route, options }) 
{
  return CustomHeader({
    navigation,
    route,
    options,
    title: "Inicio",
  });
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

    alignItems: "center",
  },
});


