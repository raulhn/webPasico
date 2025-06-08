import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useEffect, useState } from "react";

import { EntradaTexto, Boton } from "../componentesUI/ComponentesUI";
import ItemSelectorPersona from "../persona/ItemSelectorPersona";

export default function FormularioNotificacion({
  callback,
  cancelar,
  valorTitulo = "",
  valorMensaje = "",
}) {
  const [titulo, setTitulo] = useState(valorTitulo);
  const [mensaje, setMensaje] = useState(valorMensaje);

  const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);

  useEffect(() => {
    if (valorTitulo) {
      setTitulo(valorTitulo);
    }
    if (valorMensaje) {
      setMensaje(valorMensaje);
    }
  }, [valorTitulo, valorMensaje]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Notificación</Text>
      <EntradaTexto
        placeholder={"Título"}
        valor={titulo}
        setValor={(texto) => {
          setTitulo(texto);
        }}
      />
      <EntradaTexto
        placeholder={"Mensaje"}
        setValor={(texto) => {
          setMensaje(texto);
        }}
        valor={mensaje}
        multiline={true}
        alto={100}
      />
      <ItemSelectorPersona
        callback={(personasSeleccionadas) => {
          setPersonasSeleccionadas(personasSeleccionadas);
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Boton
          nombre={"Enviar"}
          onPress={() => {
            callback();
          }}
        />
        <Boton
          nombre={"Cancelar"}
          onPress={() => {
            cancelar();
          }}
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
