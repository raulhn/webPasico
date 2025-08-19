import { useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";
import ServiceCategoriaPartituras from "../../servicios/serviceCategoriaPartitura";
import { Modal, View, Text, StyleSheet } from "react-native";
import { EntradaTexto, Boton } from "../componentesUI/ComponentesUI";

export default function CrearCategoria({
  modalVisible,
  setModalVisible,
  callback,
}) {
  const [valor, setValor] = useState(null);
  const { cerrarSesion } = useContext(AuthContext);

  const crearCategoria = async () => {
    try {
      if (!valor) {
        console.log("El valor no puede estar vacío");
        return;
      }
      const categoria = { nombre_categoria: valor };
      const respuesta =
        await ServiceCategoriaPartituras.registrarCategoriaPartitura(
          categoria,
          cerrarSesion
        );
      if (respuesta.error) {
        console.log("Error al crear la categoría:", respuesta.error);
      } else {
        console.log("Categoría creada:", respuesta);
        setModalVisible(false);
        callback(); // Llamar al callback para recargar las categorías
      }
    } catch (error) {
      console.log("Error al crear la categoría:", error);
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

const estilos = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  entradaTexto: {
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
