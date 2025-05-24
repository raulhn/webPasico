import { View, Text, StyleSheet } from "react-native";

import ServicePartituras from "../../servicios/servicePartituras";

import { useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";
import {
  Boton,
  EntradaTexto,
  ModalAviso,
  ModalExito,
  RadioInput,
  GroupRadioInput,
} from "../componentesUI/ComponentesUI";

import { SelectorCategoria } from "./SelectorCategoria";

export default function FormularioPartitura({ accionCancelar }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [autor, setAutor] = useState("");
  const [urlPartitura, setUrlPartitura] = useState("");

  const [aviso, setAviso] = useState(false);
  const [exito, setExito] = useState(false);

  const { cerrarSesion } = useContext(AuthContext);

  async function registrarPartitura() {
    const partitura = {
      titulo: nombre,
      autor: autor,
      categoria: categoria,
      url_partitura: urlPartitura,
    };

    try {
      const respuesta = await ServicePartituras.registrarPartitura(
        partitura,
        cerrarSesion
      );
      if (respuesta.error) {
        setExito(true);
      } else {
        setAviso(true);
      }
    } catch (error) {
      setAviso(true);
    }
  }

  const opciones = [
    { etiqueta: "Categoria 1", valor: "categoria1" },
    { etiqueta: "Categoria 2", valor: "categoria2" },
  ];
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Formulario de Partitura</Text>

      <Text>Titulo</Text>
      <EntradaTexto
        placeholder="Titulo"
        setValor={(text) => setNombre(text)}
      ></EntradaTexto>

      <Text>Categoria</Text>
      <SelectorCategoria opciones={opciones} />

      <Text>Autor</Text>
      <EntradaTexto placeholder="Autor" setValor={(text) => setAutor(text)} />
      <Text>Url Partitura</Text>
      <EntradaTexto
        placeholder="Url Partitura"
        setValor={(text) => setUrlPartitura(text)}
      />
      <View style={estilos.botones}>
        <Boton
          nombre="Registrar Partitura"
          onPress={() => {
            if (nombre === "" || categoria === "" || autor === "") {
              alert("Por favor, completa todos los campos.");
              return;
            }
            registrarPartitura();
          }}
        />
        <Boton
          nombre="Cancelar"
          color="red"
          onPress={() => {
            accionCancelar();
          }}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  botones: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  titulo: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: "bold", // Negrita para destacar
    color: "#007CFA", // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
});
