import { View, Text, Modal } from "react-native";
import Boton from "./Boton";
import { MaterialIcons } from "@expo/vector-icons";

export default function ModalExito({ visible, callback, mensaje, textBoton }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={callback}
    >
      <View style={estilos.modalContainer}>
        <View style={estilos.modalContent}>
          <MaterialIcons
            name="check-circle-outline"
            size={60}
            color="#4caf50"
            style={estilos.iconoWarning}
          />
          <Text style={estilos.mensaje}>{mensaje}</Text>

          <Boton
            onPress={callback}
            nombre={textBoton}
            color="#007BFF"
            colorTexto="#FFF"
          />
        </View>
      </View>
    </Modal>
  );
}

const estilos = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  iconoWarning: {
    marginBottom: 10,
  },
  mensaje: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
};
