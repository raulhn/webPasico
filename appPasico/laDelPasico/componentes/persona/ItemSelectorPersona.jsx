import { View, Pressable, Text, Modal } from "react-native";
import { useState } from "react";
import SelectorPersona from "./SelectorPersona"; // Asegúrate de que la ruta sea correcta

export default function ItemSelectorPersona({ tipo = "", callback }) {
  const [esVisible, setVisible] = useState(false);
  const [personasSeleccionadas, setPersonasSeleccionadas] = useState(new Set());
  function seleccionPersona(personasSeleccionadasRecuperadas) {
    console.log(
      "Persona seleccionadas " + personasSeleccionadasRecuperadas.length
    );
    setPersonasSeleccionadas(personasSeleccionadasRecuperadas);
    setVisible(false);
    callback();
  }

  function mensajeSeleccionado() {
    if (personasSeleccionadas.size === 0) {
      return "No hay personas seleccionadas";
    } else if (personasSeleccionadas.size === 1) {
      return "1 persona seleccionada";
    } else {
      return `${personasSeleccionadas.size} personas seleccionadas`;
    }
  }
  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#ddd" : "#fff",
            padding: 10,
            borderRadius: 5,
            marginVertical: 5,
          },
        ]}
      >
        <View style={estilos.container}>
          <Text>{mensajeSeleccionado()}</Text>
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        visible={esVisible}
        onRequestClose={() => {
          setVisible(!esVisible);
        }}
      >
        <SelectorPersona
          callback={seleccionPersona}
          personasSeleccionadas={personasSeleccionadas}
          tipo={tipo}
        />
      </Modal>
    </>
  );
}

const estilos = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,

    borderColor: "#ccc",
    borderWidth: 1,
  },
};
