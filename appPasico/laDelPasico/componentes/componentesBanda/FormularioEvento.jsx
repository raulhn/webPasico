import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import EntradaTexto from "../componentesUI/EntradaTexto";
import Boton from "../componentesUI/Boton";

export default function FormularioEvento({ cancelar, guardar }) {
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Crear evento</Text>
      <Text>Nombre de Evento</Text>
      <EntradaTexto
        placeholder="Nombre del Evento"
        setValor={(text) => setNombreEvento(text)}
      ></EntradaTexto>

      <Text>Descripción</Text>
      <EntradaTexto
        placeholder="Descripción del Evento"
        setValor={(text) => setDescripcion(text)}
        ancho={300}
        alto={100}
        multiline={true}
      ></EntradaTexto>

      <Text>Fecha</Text>
      <EntradaTexto
        placeholder="Fecha del Evento"
        setValor={(text) => setDescripcion(text)}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <Boton nombre="Guardar" />
        <Boton nombre="Cancelar" color="red" onPress={cancelar} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: "bold", // Negrita para destacar
    color: "#007CFA", // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
});
