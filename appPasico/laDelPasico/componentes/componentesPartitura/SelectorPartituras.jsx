import { useState, useEffect } from "react";
import ServicePartituras from "../../servicios/servicePartituras";
import { ActivityIndicator, StyleSheet, Modal, TextInput } from "react-native";
import CardPartitura from "./CardPartitura";
import { FlatList, View, Text, Pressable } from "react-native";
import { BotonFixed } from "../componentesUI/ComponentesUI";
import FormularioPartitura from "./FormularioPartitura";
import { SelectorCategoria } from "./SelectorCategoria";
import { useRol } from "../../hooks/useRol";

export default function SelectorPartituras({ callback, edicion }) {
  const [partituras, setPartituras] = useState([]);
  const [partiturasFiltradas, setPartiturasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [presionado, setPresionado] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCategoria, setModalVisibleCategoria] = useState(false);
  const { esRol } = useRol();

  useEffect(() => {
    ServicePartituras.obtenerPartituras()
      .then((response) => {
        console.log("Partituras obtenidas:", response);
        setPartituras(response.partituras);
        setPartiturasFiltradas(response.partituras);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener partituras:", error);
      });
  }, []);

  const cancelar = () => {
    setModalVisible(false);
  };

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const actualizarCategoria = (texto) => {
    console.log("Actualizando categoría con texto:", texto);
    const resultado = partituras.filter((partitura) =>
      partitura.nombre_categoria
        .toLowerCase()
        .includes(texto.etiqueta.toLowerCase())
    );

    setPartiturasFiltradas(resultado);
  };

  const rolDirector = esRol(["DIRECTOR", "ADMINISTRADOR"]);
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <TextInput
          placeholder="Buscar partitura..."
          style={{ width: "50%" }}
          onChangeText={(text) => {
            const filteredPartituras = partituras.filter(
              (partitura) =>
                partitura.titulo.toLowerCase().includes(text.toLowerCase()) ||
                partitura.autor.toLowerCase().includes(text.toLowerCase()) ||
                partitura.nombre_categoria
                  .toLowerCase()
                  .includes(text.toLowerCase())
            );
            setPartiturasFiltradas(filteredPartituras);
          }}
        />

        <SelectorCategoria setTexto={actualizarCategoria} ancho={150} />
      </View>

      <FlatList
        data={partiturasFiltradas}
        keyExtractor={(item) => item.nid_partitura.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => callback(item.nid_partitura)}
            onPressIn={() => setPresionado(item.nid_partitura)}
            onPressOut={() => setPresionado("")}
          >
            <View
              style={[
                {
                  alignItems: "center",
                  gap: 10,
                },
                presionado === item.nid_partitura
                  ? { transform: [{ scale: 1.05 }] }
                  : {},
              ]}
            >
              <CardPartitura
                partitura={item}
                edicion={edicion}
                rolEdicion={rolDirector}
              />
            </View>
          </Pressable>
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
        <FormularioPartitura accionCancelar={cancelar} callback={callback} />
      </Modal>

      <Modal
        animationType="fade"
        visible={modalVisibleCategoria}
        onRequestClose={() => {
          console.log("Modal de categoría cerrado");
          setModalVisibleCategoria(false);
        }}
      ></Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  botonFix: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  botonFixCategoria: {
    position: "absolute",
    bottom: 30,
    left: 20,
  },
});
