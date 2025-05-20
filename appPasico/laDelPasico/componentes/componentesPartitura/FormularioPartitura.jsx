import { View, Text } from "react-native";

import ServicePartituras from "../../servicios/servicePartituras";

import { useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";
import {
  Boton,
  EntradaTexto,
  ModalAviso,
  ModalExito,
} from "../componentesUI/ComponentesUI";

export default function FormularioPartitura() {
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

  return (
    <View>
      <Text>Formulario de Partitura</Text>

      <Text>Titulo</Text>
      <EntradaTexto
        placeholder="Titulo"
        setValor={(text) => setNombre(text)}
      ></EntradaTexto>

      <Text>Categoria</Text>

      <Text>Autor</Text>
      <EntradaTexto placeholder="Autor" setValor={(text) => setAutor(text)} />
      <Text>Url Partitura</Text>
      <EntradaTexto
        placeholder="Url Partitura"
        setValor={(text) => setUrlPartitura(text)}
      />
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
    </View>
  );
}
