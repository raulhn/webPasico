import { View, Text, Modal } from "react-native";

import { useTipoTablon } from "../../../hooks/useTipoTablon";
import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthContext";
import { useRol } from "../../../hooks/useRol";
import FormularioTablon from "../../../componentes/componentesTablon/formularioTablon.jsx";
import {
  BotonFixed,
  Boton,
} from "../../../componentes/componentesUI/ComponentesUI";
import { StyleSheet } from "react-native";

export default function Tablon() {
  const { cerrarSesion } = useContext(AuthContext);
  const { tiposTablon, cargando, error, lanzarRefresco } =
    useTipoTablon(cerrarSesion);

  const [modalVisible, setModalVisible] = useState(false);

  const { esRol } = useRol();

  console.log("Tipos de tablón:", tiposTablon);

  if (cargando) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error al cargar los tipos de tablón</Text>
        <Boton nombre="Reintentar" onPress={lanzarRefresco}></Boton>
      </View>
    );
  }

  console.log("Tipos de tablón:", esRol(["ADMINISTRADOR", "DIRECTOR"]));
  return (
    <View style={styles.container}>
      <Text>Tablón de anuncios</Text>
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
        <FormularioTablon
          accionCancelar={() => setModalVisible(false)}
          callback={() => {
            setModalVisible(false);
            lanzarRefresco();
          }}
          nidTipoTablon={null}
        />
      </Modal>
    </View>
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
