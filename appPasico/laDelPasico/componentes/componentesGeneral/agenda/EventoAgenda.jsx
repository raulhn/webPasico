import { View, Text, StyleSheet, Modal } from "react-native";
import { obtenerFechaFormateada } from "../../../comun/fechas.js";
import { BotonFixed } from "../../componentesUI/ComponentesUI.jsx";
import * as Constantes from "../../../config/constantes.js";
import { useState } from "react";
import { useRol } from "../../../hooks/useRol.js";
import FormularioAgenda from "./FormularioAgenda.jsx";

export default function EventoAgenda({ evento }) {
  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
  const { esRol } = useRol();
  function addBotonEditar() {
    if (esRol([Constantes.ROL_ADMINISTRADOR])) {
      return (
        <BotonFixed
          onPress={() => {
            setModalEdicionVisible(true);
          }}
          icon="mode-edit"
          color={Constantes.COLOR_AZUL}
          size={30}
        />
      );
    }
    return null;
  }

  return (
    <View style={estilos.contenedorEvento}>
      <Text style={estilos.tituloEvento}>{evento.nombre}</Text>
      <Text style={estilos.descripcionEvento}>{evento.descripcion}</Text>
      <Text style={estilos.fechaEvento}>
        {obtenerFechaFormateada(evento.fecha)}
      </Text>
      {addBotonEditar()}
      <Modal
        visible={modalEdicionVisible}
        animationType="slide"
        onRequestClose={() => setModalEdicionVisible(false)}
      >
        {/* Aquí iría el formulario de edición del evento */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <FormularioAgenda
            evento={evento}
            volver={() => {
              setModalEdicionVisible(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorEvento: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descripcionEvento: {
    fontSize: 14,
    color: "#666",
  },
  fechaEvento: {
    fontSize: 12,
    color: "#999",
  },
});
