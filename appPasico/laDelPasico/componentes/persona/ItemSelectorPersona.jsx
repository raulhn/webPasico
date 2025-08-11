import { View, Pressable, Text, Modal } from "react-native";
import { useState } from "react";
import SelectorPersona from "./SelectorPersona"; // Asegúrate de que la ruta sea correcta
import TabSelector from "./TabSelector";
import Constantes from "../../config/constantes"; // Asegúrate de que la ruta sea correcta

export default function ItemSelectorPersona({
  tipo = "",
  callback,
  nid_asignatura = null,
}) {
  const [esVisible, setVisible] = useState(false);
  const [personasSeleccionadas, setPersonasSeleccionadas] = useState(null);

  function seleccionPersona(personasSeleccionadasRecuperadas) {
    setVisible(false);
    setPersonasSeleccionadas(personasSeleccionadasRecuperadas);
    callback(personasSeleccionadasRecuperadas);
  }

  function mensajeSeleccionado() {
    if (!personasSeleccionadas) {
      return "No hay selección";
    }

    if (
      personasSeleccionadas.tipo === Constantes.INDIVIDUAL &&
      personasSeleccionadas.conjunto.size > 0
    ) {
      return "Personas Seleccionadas: " + personasSeleccionadas.conjunto.size;
    } else if (personasSeleccionadas.tipo === Constantes.BANDA) {
      const conjuntoMusicos = personasSeleccionadas.conjunto.filter(
        (musico) => musico !== null
      );
      return "Grupos Seleccionados: " + conjuntoMusicos.length;
    } else if (personasSeleccionadas.tipo === Constantes.ESCUELA) {
      const conjuntoAlumnos = personasSeleccionadas.conjunto.filter(
        (alumno) => alumno !== null
      );
      return "Asignaturas Seleccionadas: " + conjuntoAlumnos.length;
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
        <TabSelector
          callback={seleccionPersona}
          personasSeleccionadas={personasSeleccionadas}
          tipo={tipo}
          nid_asignatura={nid_asignatura}
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
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
};
