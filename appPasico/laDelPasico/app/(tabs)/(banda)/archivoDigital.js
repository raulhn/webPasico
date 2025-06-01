import { View, Text, StyleSheet, Modal } from "react-native";
import SelectorPartituras from "../../../componentes/componentesPartitura/SelectorPartituras";
import FormularioPartitura from "../../../componentes/componentesPartitura/FormularioPartitura";
import { useState } from "react";

export default function ArchivoDigital() {
  const [nidPartituraSeleccionada, setNidPartituraSeleccionada] =
    useState(null);
  const [refrescar, setRefrescar] = useState(false);

  function refrescarPartituras() {
    setRefrescar(!refrescar);
  }

  const edicion = {
    icono: "mode-edit",
    size: 30,
    accion: (nidPartitura) => {
      console.log("Editar partitura con nid:", nidPartitura);
      setNidPartituraSeleccionada(nidPartitura);
      setModalVisible(true);
    },
  };

  const [modalVisible, setModalVisible] = useState(false);
  const cancelar = () => {
    setModalVisible(false);
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.title}>Archivo Digital</Text>

      <SelectorPartituras edicion={edicion} refrescar={refrescar} />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          console.log("Modal cerrado");
          setModalVisible(false);
        }}
      >
        <FormularioPartitura
          accionCancelar={cancelar}
          callback={() => {
            refrescarPartituras();
          }}
          nidPartitura={nidPartituraSeleccionada}
        />
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    height: "100%",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
