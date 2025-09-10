import { ActivityIndicator, Modal, Pressable, Text } from "react-native";
import { StyleSheet, View, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import CardEventoPartitura from "../../../../componentes/componentesBanda/CardEventoPartitura";

import {
  Boton,
  BotonFixed,
  CheckBox,
} from "../../../../componentes/componentesUI/ComponentesUI";
import FormularioEvento from "../../../../componentes/componentesBanda/FormularioEvento";
import { useRol } from "../../../../hooks/useRol";
import { Link } from "expo-router";

import serviceEventoConcierto from "../../../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente
import { FlatList } from "react-native";

export default function Partituras() {
  const [eventosConciertos, setEventosConciertos] = useState([]);
  const [presionado, setPresionado] = useState(null);
  const [cargado, setCargado] = useState(false);

  const { esRol } = useRol();

  const [modalVisible, setModalVisible] = useState(false);

  const [error, setError] = useState(false);

  const [refrescar, setRefrescar] = useState(false);

  useEffect(() => {
    setPresionado(null);
    serviceEventoConcierto
      .obtenerEventosConciertos()
      .then((response) => {
        setEventosConciertos(response.eventos);
        setCargado(true);
      })
      .catch((error) => {
        console.log("Error al listar eventos:", error);
        setError(true);
        setCargado(true);
      });
    setRefrescar(false);
  }, [refrescar]);

  const cerrar = () => {
    setModalVisible(false);
  };

  const refrescarLista = () => {
    setRefrescar(true);
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

  if (error) {
    // Muestra un mensaje de error si no se pueden cargar las galerías
    return (
      <View style={styles.cargandoContainer}>
        <Text>Error al cargar</Text>
        <Boton
          nombre={"Reintentar"}
          onPress={() => {
            setCargado(false);
            setRefrescar(true);
            setError(false);
          }}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Eventos y Conciertos</Text>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refrescar}
              onRefresh={() => {
                setRefrescar(true); // Cambia el estado de refresco
              }}
            />
          }
          onScrollEndDrag={() => {
            setPresionado(null); // Cambia el estado a no presionado al hacer scroll
          }}
          style={{
            backgroundColor: "white",
          }}
          data={eventosConciertos}
          keyExtractor={(evento) => evento.nid_evento_concierto}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/stackEventos/[nidEvento]",
                params: { nidEvento: item.nid_evento_concierto },
              }}
              key={item.nid_evento_concierto}
              asChild
            >
              <Pressable
                onPress={() => {}}
                onTouchStart={() => {
                  setPresionado(item.nid_evento_concierto); // Cambia el estado a presionado
                }}
                onTouchEnd={() => {
                  setPresionado(null); // Cambia el estado a no presionado
                }}
                style={
                  presionado === item.nid_evento_concierto
                    ? styles.tarjetaPresionada
                    : null
                }
              >
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
  tarjetaPresionada: {
    transform: [{ scale: 1.05 }],
  },
  cargandoContainer: {
    flex: 1, // Centra el indicador de carga en la pantalla
    justifyContent: "center",
    alignItems: "center",
  },
});
