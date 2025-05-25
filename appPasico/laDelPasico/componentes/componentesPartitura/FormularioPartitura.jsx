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

export default function FormularioPartitura({ accionCancelar, callback }) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [autor, setAutor] = useState("");
  const [urlPartitura, setUrlPartitura] = useState("");

  const [aviso, setAviso] = useState(false);
  const [exito, setExito] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const { cerrarSesion } = useContext(AuthContext);

  async function registrarPartitura() {
    const partitura = {
      titulo: nombre,
      autor: autor,
      categoria: categoria.valor,
      url_partitura: urlPartitura,
    };

    console.log("Partitura a registrar:", partitura); // Para depuración
    try {
      const respuesta = await ServicePartituras.registrarPartitura(
        partitura,
        cerrarSesion
      );
      console.log("Respuesta del registro:", respuesta); // Para depuración
      if (!respuesta.error) {
        callback(respuesta.nid_partitura);
        setExito(true);
      } else {
        setMensaje("Error al registrar la partitura");
        setAviso(true);
      }
    } catch (error) {
      setMensaje("Error al registrar la partitura");
      setAviso(true);
    }
  }

  const actualizarCategoria = (valor) => {
    setCategoria(valor);
  };

  const refrescarModal = () => {
    console.log("Refrescando modal");
    setAviso(false);
    setExito(false);
    setMensaje("");
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Formulario de Partitura</Text>

      <Text>Titulo</Text>
      <EntradaTexto
        placeholder="Titulo"
        setValor={(text) => setNombre(text)}
      ></EntradaTexto>

      <Text>Categoria</Text>
      <SelectorCategoria setTexto={actualizarCategoria} />

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
            if (nombre === "") {
              setMensaje("El campo Titulo es obligatorio");
              setAviso(true);
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

      <ModalAviso
        visible={aviso}
        setVisible={refrescarModal}
        mensaje={mensaje}
        textBoton={"Aceptar"}
      />
      <ModalExito
        visible={exito}
        setVisible={refrescarModal}
        mensaje={"Partitura registrada exitosamente"}
        textBoton={"Aceptar"}
      />
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
