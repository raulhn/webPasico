import serviceComponentes from "../../servicios/serviceComponentes.js";
import { useEffect, useState } from "react";
import constantes from "../../config/constantes.js";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions, Button } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { SafeAreaView } from "react-native-safe-area-context";

export default function ComponenteGaleria(componente) {
  const { nidComponente } = componente;
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [indice, setIndice] = useState(0);
  const [rotado, setRotado] = useState(false);
  const insets = useSafeAreaInsets();
  const url_imagen = constantes.URL_SERVICIO + "imagen_url/";
  const [dimensions, setDimensions] = useState(Dimensions.get("window")); // Estado para las dimensiones
  const [orientation, setOrientation] = useState(null);

  // Detectar la orientación actual al cargar el componente
  useEffect(() => {
    const getOrientation = async () => {
      const orientationInfo = await ScreenOrientation.getOrientationAsync();
      setOrientation(orientationInfo);
    };

    // Escuchar cambios en la orientación
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

    getOrientation();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useEffect(() => {
    const handleDimensionsChange = () => {
      setDimensions(Dimensions.get("window")); // Actualiza las dimensiones cuando cambian
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionsChange
    );

    return () => subscription?.remove(); // Limpia el evento al desmontar el componente
  }, []);

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
    setRotado(false);
    lockToPortrait();
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

  // Función para cambiar la orientación
  const lockToLandscape = async () => {
    await ScreenOrientation.unlockAsync();
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  };

  const lockToPortrait = async () => {
    await ScreenOrientation.unlockAsync();
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  async function rotar() {
    if (rotado) {
      setRotado(false);
      await lockToPortrait();
 
    } else {
      await lockToLandscape();
      setRotado(true);
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
        <View
          style={[styles.modalSafeArea, { paddingTop: insets.top * 2 }]}
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

          <View style={styles.rotateButton}>
            <Pressable
              onPress={async() => {
                await rotar();
              }}
            >
              <View style={styles.tipoBoton}>
                <MaterialIcons name="rotate-right" size={24} color="white" />
              </View>
            </Pressable>
          </View>
          <View style={styles.modalContainer}>
            <Pressable style={styles.modalBackground}>
              <Image
                source={{
                  uri: url_imagen + selectedImage,
                }}
                style={[
                  styles.modalImage,
                  {
                    maxWidth: dimensions.width * 0.85, // Ajusta el ancho al 90% de la pantalla
                    maxHeight: (dimensions.height - insets.top) * 0.80, // Ajusta la altura al 90% de la pantalla
                  },
                ]}
                resizeMode="contain" // Asegura que la imagen mantenga su proporción
              />
            </Pressable>
          </View>
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
  modalSafeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
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
    padding: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,

  },
  rotateButton: {
    position: "absolute",
    top: 20,
    left: 20,

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