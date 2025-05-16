import { ActivityIndicator, Modal, Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import CardEventoPartitura from "../../../componentes/componentesBanda/CardEventoPartitura";
import CardPartitura from "../../../componentes/componentesBanda/CardPartitura";
import BotonFixed from "../../../componentes/componentesUI/BotonFixed";
import FormularioEvento from "../../../componentes/componentesBanda/FormularioEvento";
import { useRol } from "../../../hooks/useRol";

import serviceEventoConcierto from "../../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente
import { FlatList } from "react-native-gesture-handler";

export default function Partituras() {
  const [eventosConciertos, setEventosConciertos] = useState([]);
  const [cargado, setCargado] = useState(false);

  const { esRol } = useRol();

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    serviceEventoConcierto
      .obtenerEventosConciertos()
      .then((response) => {
        console.log("Eventos obtenidos:", response);
        setEventosConciertos(response.eventos);
        if (response.eventos.length > 0) {
          setCargado(true);
        }
        console.log("Eventos obtenidos:", response.eventos);
      })
      .catch((error) => {
        console.error("Error al listar eventos:", error);
      });
  }, []);

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

  if (!cargado) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <View style={styles.container}>
        <FlatList
          style={{
            backgroundColor: "white",
            width: "100%",
          }}
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
            borderWidth: 1,
            borderColor: "black",
          }}
          data={eventosConciertos}
          keyExtractor={(evento) => evento.nid_evento_concierto}
          renderItem={({ item }) => (
            <CardEventoPartitura EventoPartitura={item} />
          )}
        ></FlatList>

        <CardEventoPartitura EventoPartitura={partitura} />

        <CardEventoPartitura EventoPartitura={partitura2} />

        <CardPartitura partitura={partitura1} />

        <View
          style={[
            esRol("ADMINISTRADOR") || esRol("DIRECTOR")
              ? { display: "flex" }
              : { display: "none" },
            styles.botonAdd,
          ]}
        >
          <BotonFixed
            onPress={() => {
              console.log("Botón presionado");
              setModalVisible(true);
            }}
          />
        </View>
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
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
    width: "100%",
  },
  botonAdd: { position: "absolute", bottom: 20, right: 20 },
});
