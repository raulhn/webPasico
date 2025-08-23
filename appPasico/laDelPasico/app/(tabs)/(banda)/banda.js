import React from "react";
import AppBar from "../../../componentes/appBar.jsx"; // Adjust the path if necessary
import { StyleSheet, View, Text } from "react-native";


export default function Banda() {
  return (
    <View style={estilos.principal}>
      <Text style={estilos.titulo}>Banda de Música de Torre Pacheco</Text>
      <Text style={estilos.texto}>
        La Banda de Música de Torre Pacheco es una agrupación musical que se
        dedica a la interpretación de obras musicales en diferentes estilos y
        géneros. Ofrecemos conciertos y eventos para la comunidad, promoviendo
        la cultura musical y el arte en nuestra localidad.
      </Text>
    </View>
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
