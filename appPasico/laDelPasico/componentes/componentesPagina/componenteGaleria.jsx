import serviceComponentes from "../../servicios/serviceComponentes.js";
import { useEffect, useState } from "react";
import constantes from "../../constantes.js";
import { MaterialIcons } from "@expo/vector-icons";

import {
  FlatList,
  Pressable,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { StyleSheet } from "react-native";
import ComponenteImagenGaleria from "./componenenteImagenGaleria.jsx";

export default function ComponenteGaleria(componente) {
  const { nidComponente } = componente;
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [indice, setIndice] = useState(0);
  const url_imagen = constantes.URL_SERVICIO + "imagen_url/";

  useEffect(() => {
    if (nidComponente) {
      serviceComponentes
        .recuperarImagenesGaleria(nidComponente)
        .then((data) => {
          setImagenes(data.imagenes);
          setLoading(false);
        })
        .catch((error) => {});
    }
  }, [nidComponente]);

  if (loading) {
    return null;
  }

  function closeModal() {
    setModalVisible(false);
    setSelectedImage(null);
  }

  function anterior() {
    if (indice > 0) {
      setIndice(indice - 1);
      setSelectedImage(imagenes[indice - 1].nid_imagen);
    }
  }
  function siguiente() {
    if (indice < imagenes.length - 1) {
      setIndice(indice + 1);
      setSelectedImage(imagenes[indice + 1].nid_imagen);
    }
  }

  return (
    <View>
      <FlatList
        style={{ flexGrow: 1, backgroundColor: "white" }}
        data={imagenes}
        keyExtractor={(item) => item.nid_imagen.toString()}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.pressabeStyle}
            onPress={() => {
              setModalVisible(true);
              setSelectedImage(item.nid_imagen);
              setIndice(index);
            }}
          >
            <ComponenteImagenGaleria url={item.nid_imagen} />
          </Pressable>
        )}
        contentContainerStyle={styles.flatListContent}
      ></FlatList>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.closeButton}>
          <Pressable
            onPress={() => {
              closeModal();
            }}
          >
            <View style={styles.tipoBoton}>
              <MaterialIcons name="close" size={24} color="white" />
            </View>
          </Pressable>
        </View>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackground}>
            <Image
              source={{
                uri: url_imagen + selectedImage,
              }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </Pressable>
          <View style={styles.botones}>
            <Pressable
              onPress={() => {
                anterior();
              }}
            >
              <View style={styles.tipoBoton}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                siguiente();
              }}
            >
              <View style={styles.tipoBoton}>
                <MaterialIcons name="arrow-forward" size={24} color="white" />
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    flexGrow: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pressabeStyle: {
    width: "50%",
  },
  modalImage: {
    width: 900,
    height: 900,
    maxWidth: "90%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1,
  },
  tipoBoton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  botones: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
});
