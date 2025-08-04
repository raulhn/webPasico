import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTablonAnuncio } from "../../hooks/useTablonAnuncios";
import Constantes from "../../config/constantes.js";
import { BotonFixed } from "../../componentes/componentesUI/ComponentesUI.jsx";
import { useRol } from "../../hooks/useRol.js";
import FormularioTablon from "../../componentes/componentesTablon/formularioTablon.jsx";
import { useState } from "react";
export default function Anuncio() {
  const { nidAnuncio } = useLocalSearchParams();
  const { esRol } = useRol();
  const { anuncio, cargando, error, refrescar, lanzarRefresco } =
    useTablonAnuncio(nidAnuncio);
  const [modalVisible, setModalVisible] = useState(false);
  function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Constantes.COLOR_AZUL} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refrescar} onRefresh={lanzarRefresco} />
      }
    >
      <Text style={styles.titulo}>{anuncio.titulo}</Text>
      <Text style={styles.fecha}>{formatearFecha(anuncio.fecha_creacion)}</Text>
      <Text style={styles.tipo}>{anuncio.tipo_tablon}</Text>
      <View style={styles.descripcionBox}>
        <Text style={styles.descripcion}>{anuncio.descripcion}</Text>
      </View>

      <View
        style={[
          esRol(["ADMINISTRADOR", "DIRECTOR"])
            ? { display: "flex" }
            : { display: "none" },
          styles.botonEditar,
        ]}
      >
        <BotonFixed
          onPress={() => {
            setModalVisible(true);
          }}
          icon="mode-edit"
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
          nidTablonAnuncionDefecto={anuncio.nid_tablon_anuncio}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f6f8fa",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: Constantes.COLOR_AZUL,
    marginBottom: 8,
  },
  fecha: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    alignSelf: "flex-end",
  },
  tipo: {
    fontSize: 15,
    color: "#0077b6",
    fontWeight: "600",
    marginBottom: 12,
  },
  descripcionBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  descripcion: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  botonEditar: { position: "absolute", bottom: 30, right: 20 },
});
