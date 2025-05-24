import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  Boton,
  GroupRadioInput,
  EntradaTexto,
} from "../componentesUI/ComponentesUI";
import { useEffect, useState } from "react";

import ServiceCategoriaPartituras from "../../servicios/serviceCategoriaPartitura";
import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";

function CrearCategoria({ modalVisible, setModalVisible }) {
  const [valor, setValor] = useState(null);
  const { cerrarSesion } = useContext(AuthContext);

  const crearCategoria = async () => {
    try {
      const categoria = { nombre_categoria: valor };
      const respuesta =
        await ServiceCategoriaPartituras.registrarCategoriaPartitura(
          categoria,
          cerrarSesion
        );
      if (respuesta.error) {
        console.error("Error al crear la categoría:", respuesta.error);
      } else {
        console.log("Categoría creada exitosamente:", respuesta);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error al crear la categoría:", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => {
        console.log("Modal cerrado");
        setModalVisible(false);
      }}
    >
      <View style={estilos.modalContainer}>
        <Text style={estilos.titulo}> Crear Categoría </Text>
        <EntradaTexto
          placeholder="Nombre de la categoría"
          valor={valor}
          setValor={setValor}
        />
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
        >
          <Boton
            onPress={() => {
              crearCategoria();
              setModalVisible(false);
            }}
            nombre="Crear"
            color="#007BFF"
            colorTexto="#FFF"
          />
          <Boton
            onPress={() => {
              setModalVisible(false);
            }}
            nombre="Cancelar"
            color="#FF0000"
            colorTexto="#FFF"
          />
        </View>
      </View>
    </Modal>
  );
}

export function SelectorCategoria() {
  const [valor, setValor] = useState(null);

  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [opciones, setOpciones] = useState(opciones);

  const { cerrarSesion } = useContext(AuthContext);

  const setValorSeleccionado = (valor) => {
    setValor(valor);
    console.log("Valor seleccionado:", valor);
  };

  useEffect(() => {
    ServiceCategoriaPartituras.obtenerCategoriasPartitura(cerrarSesion).then(
      (respuesta) => {
        if (respuesta.error) {
          console.error("Error al obtener las categorías:", respuesta.error);
        } else {
          console.log("Categorías obtenidas:", respuesta);
          const categorias = respuesta.categorias.map((categoria) => ({
            etiqueta: categoria.nombre_categoria,
            valor: categoria.nid_categoria,
          }));
          setOpciones(categorias);
          setCargando(false);
        }
      }
    );
  }, []);

  const cerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <View style={estilos.entradaTexto}>
          <Text>{valor ? valor.etiqueta : ""}</Text>
        </View>
      </Pressable>
      <Modal
        animationType="fade"
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View style={estilos.modalContainer}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            Selecciona una opción:
          </Text>
          <GroupRadioInput
            opciones={opciones}
            setValorSeleccionado={setValorSeleccionado}
            valor={valor}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
          >
            <Boton
              onPress={() => {
                setModalVisible(true);
              }}
              nombre="Crear Categoría"
              color="#28A745"
              colorTexto="#FFF"
            />
            <Boton
              onPress={() => {
                setVisible(false);
              }}
              nombre="Cerrar"
              color="red"
              colorTexto="#FFF"
            />
          </View>
        </View>

        <CrearCategoria
          modalVisible={modalVisible}
          setModalVisible={cerrarModal}
        />
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  entradaTexto: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
