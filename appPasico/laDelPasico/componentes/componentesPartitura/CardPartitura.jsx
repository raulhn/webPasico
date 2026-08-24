/* eslint-disable no-unused-vars */
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { useRol } from "../../hooks/useRol";
import { BotonFixed } from "../componentesUI/ComponentesUI";
import Constantes from "../../config/constantes.js";
import ModalSolicitudImpresion from "./ModalSolicitudImpresion";

export default function CardPartitura({
  partitura,
  edicion,
  rolEdicion = false,
}) {
  const { esRol } = useRol();
  const [modalImpresionVisible, setModalImpresionVisible] = useState(false);

  function botonEditar() {
    if (rolEdicion && edicion) {
      return (
        <BotonFixed
          colorBoton={edicion.colorBoton}
          icon={edicion.icono}
          size={edicion.size}
          onPress={() => edicion.accion(partitura.nid_partitura)}
        />
      );
    }
  }

  function detenerPropagacion(event) {
    event?.stopPropagation?.();
  }

  function descargarPartitura() {
    if (partitura.url_partitura) {
      return (
        <Pressable
          onPress={(event) => {
            detenerPropagacion(event);
            Linking.openURL(partitura.url_partitura);
          }}
        >
          <View style={styles.botonAccion}>
            <MaterialIcons
              name="download"
              size={18}
              color={Constantes.COLOR_AZUL}
            />
            <Text style={styles.textoBotonAccion}>Descargar</Text>
          </View>
        </Pressable>
      );
    }

    return null;
  }

  function botonSolicitudImpresion() {
    const puedeSolicitarImpresion = esRol([
      "MUSICO",
      "DIRECTOR",
      "ADMINISTRADOR",
    ]);

    if (!puedeSolicitarImpresion || !partitura?.nid_partitura) {
      return null;
    }

    return (
      <>
        <Pressable
          onPress={(event) => {
            detenerPropagacion(event);
            setModalImpresionVisible(true);
          }}
        >
          <View style={styles.botonAccion}>
            <MaterialIcons
              name="print"
              size={18}
              color={Constantes.COLOR_AZUL}
            />
            <Text style={styles.textoBotonAccion}>Solicitar impresión</Text>
          </View>
        </Pressable>

        <ModalSolicitudImpresion
          visible={modalImpresionVisible}
          setVisible={setModalImpresionVisible}
          partitura={partitura}
        />
      </>
    );
  }

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.titulo}>{partitura.titulo}</Text>

        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Categoria:
          </Text>
          <Text> {partitura.nombre_categoria}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Autor:
          </Text>
          <Text> {partitura.autor}</Text>
        </View>
        <View style={styles.acciones}>
          {descargarPartitura()}
          {botonSolicitudImpresion()}
        </View>
        <View style={{ position: "absolute", top: 10, right: 20 }}>
          {botonEditar()}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "95%",
    minHeight: 160,
    backgroundColor: Constantes.COLOR_GRIS,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  titulo: {
    fontSize: 15,
    paddingBottom: 5,
    fontWeight: "bold",
    color: Constantes.COLOR_AZUL,
    textOverflow: "ellipsis",
  },
  acciones: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 10,
  },
  botonAccion: {
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderColor: Constantes.COLOR_AZUL,
    marginTop: 3,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  textoBotonAccion: {
    color: Constantes.COLOR_AZUL,
    fontWeight: "bold",
    fontSize: 13,
  },
});
