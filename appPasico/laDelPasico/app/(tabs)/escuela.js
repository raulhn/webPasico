import React from "react";
import AppBar from "../../componentes/appBar.jsx"; // Adjust the path if necessary
import { StyleSheet, View, Text } from "react-native";

export default function Escuela() {
  return (
    <View style={estilos.principal}>
      <Text style={estilos.titulo}>Escuela de Música de Torre Pacheco</Text>
      <Text style={estilos.texto}>
        La Escuela de Música de Torre Pacheco es un centro educativo dedicado a
        la enseñanza musical y artística. Ofrecemos una amplia variedad de
        cursos y actividades para todas las edades y niveles. Nuestro objetivo
        es fomentar el amor por la música y brindar a nuestros estudiantes las
        herramientas necesarias para desarrollar su talento.
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
