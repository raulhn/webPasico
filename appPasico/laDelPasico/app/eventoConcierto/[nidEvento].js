import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState, useContext } from "react";

import CardPartitura from "../../componentes/componentesPartitura/CardPartitura";
import ServiceEventoConcierto from "../../servicios/serviceEventoConcierto";
import { ActivityIndicator, Modal } from "react-native";
import { AuthContext } from "../../providers/AuthContext";
import { BotonFixed } from "../../componentes/componentesUI/ComponentesUI";
import FormularioPartitura from "../../componentes/componentesPartitura/FormularioPartitura";
import SelectorPartituras from "../../componentes/componentesPartitura/SelectorPartituras";

export default function EventoConcierto() {
  const [evento, setEvento] = useState(null);
  const [partituras, setPartituras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const { nidEvento } = useLocalSearchParams();

  const { cerrarSesion } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  function registrarPartituraEvento(nidPartitura) {
    try {
      ServiceEventoConcierto.registrarPartituraEvento(
        nidPartitura,
        nidEvento,
        cerrarSesion
      ).then((response) => {
        if (response.error) {
          console.error("Error al registrar la partitura:", response.mensaje);

          return;
        } else {
          console.log("Partitura registrada en el evento:", response);
          setModalVisible(false); // Cerrar el modal después de registrar la partitura
          setRefrescar(!refrescar);
        }
      });
    } catch (error) {
      console.error("Error al registrar la partitura en el evento:", error);
    }
  }

  useEffect(() => {
    ServiceEventoConcierto.obtenerEventoConcierto(nidEvento, cerrarSesion)
      .then((eventoData) => {
        console.log("Evento obtenido:", eventoData);
        setEvento(eventoData.evento_concierto);
        console.log("Partituras del evento:", eventoData.partituras);
        setPartituras(eventoData.partituras);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener el evento:", error);
      });
  }, [nidEvento, refrescar]);

  if (cargando) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <View style={estilos.container}>
        <View style={estilos.infoEvento}>
          <Text style={estilos.tituloEvento}>
            {evento ? evento.nombre : "Cargando..."}
          </Text>
          <Text> {evento.descripcion}</Text>
          <Text> {evento.fecha_evento}</Text>
        </View>
        <View style={estilos.contenedorPartituras}>
          <Text style={estilos.legend}>Partituras del Evento</Text>
        </View>
        <FlatList
          data={partituras}
          style={{ width: "100%", flexGrow: 1 }}
          keyExtractor={(item) => item.nid_partitura.toString()}
          contentContainerStyle={{}}
          renderItem={({ item }) => (
            <View style={{ alignItems: "center" }}>
              <CardPartitura
                partitura={item}
                onPress={() => {
                  console.log("Partitura seleccionada:", item);
                }}
              />
            </View>
          )}
        />
        <View style={estilos.botonFix}>
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
            setModalVisible(false);
          }}
        >
          <SelectorPartituras callback={registrarPartituraEvento} />
        </Modal>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    height: "100%",
  },
  infoEvento: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tituloEvento: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007CFA",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 6,
  },
  valor: {
    color: "#444",
    marginBottom: 4,
  },
  legend: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
    marginBottom: 5,
  },
  contenedorPartituras: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,

    borderColor: "#ccc",

    alignItems: "center",
  },
  botonFix: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
});
