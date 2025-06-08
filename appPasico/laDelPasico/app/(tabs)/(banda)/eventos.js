import { ActivityIndicator, Modal, Pressable, Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import CardEventoPartitura from "../../../componentes/componentesBanda/CardEventoPartitura";

import {
  Boton,
  BotonFixed,
  CheckBox,
} from "../../../componentes/componentesUI/ComponentesUI";
import FormularioEvento from "../../../componentes/componentesBanda/FormularioEvento";
import { useRol } from "../../../hooks/useRol";
import { Link } from "expo-router";

import serviceEventoConcierto from "../../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente
import { FlatList } from "react-native";

import SelectorPersona from "../../../componentes/persona/SelectorPersona";

export default function Partituras() {
  const [eventosConciertos, setEventosConciertos] = useState([]);
  const [cargado, setCargado] = useState(false);

  const { esRol } = useRol();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleSelector, setModalVisibleSelector] = useState(false);

  const [refrescar, setRefrescar] = useState(false);

  useEffect(() => {
    serviceEventoConcierto
      .obtenerEventosConciertos()
      .then((response) => {
        setEventosConciertos(response.eventos);

        setCargado(true);
      })
      .catch((error) => {
        console.error("Error al listar eventos:", error);
      });
  }, [refrescar]);

  const cerrar = () => {
    setModalVisible(false);
  };

  const refrescarLista = () => {
    setRefrescar(!refrescar);
    setModalVisible(false);
  };

  if (!cargado) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (eventosConciertos.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text>No hay eventos disponibles</Text>

        <View
          style={[
            esRol(["ADMINISTRADOR", "DIRECTOR"])
              ? { display: "flex" }
              : { display: "none" },
            styles.botonAdd,
          ]}
        >
          <BotonFixed
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {}}
        >
          <FormularioEvento cancelar={cerrar} callback={refrescarLista} />
        </Modal>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Eventos y Conciertos</Text>
        <FlatList
          style={{
            backgroundColor: "white",
          }}
          data={eventosConciertos}
          keyExtractor={(evento) => evento.nid_evento_concierto}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/eventoConcierto/[nidEvento]",
                params: { nidEvento: item.nid_evento_concierto },
              }}
              key={item.nid_evento_concierto}
              asChild
            >
              <Pressable onPress={() => {}}>
                <View style={{ width: "100%", alignItems: "center" }}>
                  <CardEventoPartitura EventoPartitura={item} />
                </View>
              </Pressable>
            </Link>
          )}
        ></FlatList>
      </View>

      <View
        style={[
          esRol(["ADMINISTRADOR", "DIRECTOR"])
            ? { display: "flex" }
            : { display: "none" },
          styles.botonAdd,
        ]}
      >
        <BotonFixed
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <FormularioEvento cancelar={cerrar} callback={refrescarLista} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  botonAdd: { position: "absolute", bottom: 30, right: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
