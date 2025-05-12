import { Modal, Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import CardEventoPartitura from "../../../componentes/componentesBanda/CardEventoPartitura";
import CardPartitura from "../../../componentes/componentesBanda/CardPartitura";
import BotonFixed from "../../../componentes/componentesUI/BotonFixed";
import FormularioEvento from "../../../componentes/componentesBanda/FormularioEvento";

export default function Partituras() {
  const [modalVisible, setModalVisible] = useState(false);
  const partitura = {
    id: 1,
    nombre: "Concierto fin de curso",
    fecha: "20/06/2025",
    descripcion:
      "Podeis consultar las partituras para el fin de curso desde aqui",
  };

  const partitura1 = {
    id: 1,
    titulo: "La del Pasico",
    categoria: "Pasodobles",
    autor: "Antonio Roca",
  };

  const partitura2 = {
    id: 2,
    nombre: "Concierto de Navidad",
    fecha: "25/12/2025",
    descripcion:
      "Podeis consultar las partituras para el concierto de Navidad desde aqui, este año tenemos un repertorio muy variado que seguro que os gustará",
  };

  const cerrar = () => {
    console.log("Botón presionado");
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <CardEventoPartitura EventoPartitura={partitura} />

        <CardEventoPartitura EventoPartitura={partitura2} />

        <CardPartitura partitura={partitura1} />
        <BotonFixed
          onPress={() => {
            console.log("Botón presionado");
            setModalVisible(true);
          }}
        />
      </View>

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          console.log("Modal cerrado");
        }}
      >
        <FormularioEvento cancelar={cerrar} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});
