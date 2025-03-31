import React from "react";
import { StyleSheet, View, Text } from "react-native";
import AppBar from "../../../componentes/appBar.jsx"; // Adjust the path if necessary
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Asociacion() {
  return (
    <SafeAreaProvider>
      <View style={estilos.principal}>
        <Text style={estilos.titulo}>
          Asociación Amigos de la Música de Torre Pacheco
        </Text>
        <Text style={estilos.texto}>
          La Asociación de Amigos de la Música de Torre Pacheco
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  principal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
  texto: {
    fontSize: 20,
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
});
