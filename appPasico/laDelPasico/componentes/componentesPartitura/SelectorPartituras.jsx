import { useState, useEffect, useContext } from "react";
import ServicePartituras from "../../servicios/servicePartituras";
import { ActivityIndicator, StyleSheet, Modal, TextInput } from "react-native";
import CardPartitura from "./CardPartitura";
import { FlatList, View, Text, Pressable, RefreshControl } from "react-native";
import {
  BotonFixed,
  Boton,
  EntradaGroupRadioButton,
} from "../componentesUI/ComponentesUI";
import FormularioPartitura from "./FormularioPartitura";

import { useRol } from "../../hooks/useRol";
import { AuthContext } from "../../providers/AuthContext";
import { useCategoriasPartitura } from "../../hooks/banda/useCategoriasPartitura";

export default function SelectorPartituras({ callback, edicion, refrescar }) {
  const [partituras, setPartituras] = useState([]);
  const [partiturasFiltradas, setPartiturasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [presionado, setPresionado] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCategoria, setModalVisibleCategoria] = useState(false);
  const [refresco, setRefresco] = useState(false);
  const [error, setError] = useState(false);
  const { cerrarSesion } = useContext(AuthContext);
  const { categorias, lanzarRefresco } = useCategoriasPartitura(cerrarSesion);

  const { esRol } = useRol();

  useEffect(() => {
    ServicePartituras.obtenerPartituras()
      .then((response) => {
        setPartituras(response.partituras);
        setPartiturasFiltradas(response.partituras);
        setCargando(false);
        setRefresco(false);
      })
      .catch((error) => {
        setError(true);
        setCargando(false);
        setRefresco(false);
      });
  }, [refrescar, refresco]);

  const cancelar = () => {
    setModalVisible(false);
  };

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const actualizarCategoria = (texto) => {
    const resultado = partituras.filter((partitura) =>
      partitura.nombre_categoria
        .toLowerCase()
        .includes(texto.etiqueta.toLowerCase())
    );

    setPartiturasFiltradas(resultado);
  };

  function botonAdd() {
    let rolDirector = esRol(["DIRECTOR", "ADMINISTRADOR"]);
    if (rolDirector) {
      return (
        <View style={estilos.botonFix}>
          <BotonFixed
            onPress={() => {
              console.log("Botón presionado");
              setModalVisible(true);
            }}
          />
        </View>
      );
    }
    return null;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error al cargar las partituras</Text>
        <Boton
          nombre={"Reintentar"}
          onPress={() => {
            setCargando(true);
            setRefresco(true);
            setError(false);
          }}
        />
      </View>
    );
  }

  const rolDirector = esRol(["DIRECTOR", "ADMINISTRADOR"]);
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <TextInput
          placeholder="Buscar partitura..."
          style={{ width: "50%", color: "black" }}
          onChangeText={(text) => {
            const filteredPartituras = partituras.filter(
              (partitura) =>
                (partitura.titulo.toLowerCase().includes(text.toLowerCase()) ||
                  partitura.autor.toLowerCase().includes(text.toLowerCase())) &&
                partitura.nombre_categoria
                  .toLowerCase()
                  .includes(text.toLowerCase())
            );
            setPartiturasFiltradas(filteredPartituras);
          }}
        />

        <EntradaGroupRadioButton
          opciones={categorias}
          titulo={"Categorias"}
          setValorSeleccionado={actualizarCategoria}
        />
      </View>

      <FlatList
        data={partiturasFiltradas}
        keyExtractor={(item) => item.nid_partitura.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refresco}
            onRefresh={() => setRefresco(true)}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (callback !== undefined) {
                callback(item.nid_partitura);
              }
            }}
            onPressIn={() => setPresionado(item.nid_partitura)}
            onPressOut={() => setPresionado("")}
          >
            <View
              style={[
                {
                  alignItems: "center",
                  gap: 10,
                },
                presionado === item.nid_partitura && callback !== undefined
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
      {botonAdd()}

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
            setRefresco(true);
            setModalVisible(false);
          }}
        />
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
