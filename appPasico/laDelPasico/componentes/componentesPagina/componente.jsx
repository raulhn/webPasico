import { View, Image } from "react-native";
import { StyleSheet } from "react-native";
import ComponenteTexto from "./componenteTexto";
import constantes from "../../config/constantes.js";
import ComponenteGaleria from "./componenteGaleria.jsx";
import ComponenteCard from "./componenteCard.jsx";
import { useEffect, useState } from "react";

export default function Componente(pComponente) {
  const [orientation, setOrientation] = useState(null);
  useEffect(() => {
    if (pComponente.componente.nTipo === 2) {
      Image.getSize(
        url_imagen + componente.nid_Componente,
        (width, height) => {
          if (width > height) {
            setOrientation("horizontal");
          } else if (height > width) {
            setOrientation("vertical");
          } else {
            setOrientation("square");
          }
        },
        (error) => {
          setOrientation("unknown");
        }
      );
    }
  }, []);
  const url_imagen = constantes.URL_SERVICIO + "imagen/";
  let componente = pComponente.componente;
  if (componente.nTipo === 1) {
    return (
      <View style={styles.textoContainer} key={componente.nid_Componente}>
        <ComponenteTexto nid_componente={componente.nid_Componente} />
      </View>
    );
  } else if (componente.nTipo === 2) {
    return (
      <View style={styles.imageContainer} key={componente.nid_Componente}>
        <Image
          source={{ uri: url_imagen + componente.nid_Componente }}
          style={[
            styles.imagen,
            orientation === "horizontal"
              ? { width: 320, height: 230 }
              : { height: 380, width: 320 },
          ]}
          resizeMode="contain"
        />
      </View>
    );
  } else if (componente.nTipo === 5) {
    return (
      <View style={styles.imageContainer} key={componente.nid_Componente}>
        <ComponenteGaleria nidComponente={componente.nid_Componente} />
      </View>
    );
  } else if (componente.nTipo === 9) {
    return (
      <View style={styles.cardContaner} key={componente.nid_Componente}>
        <ComponenteCard nid_componente={componente.nid_Componente} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagen: {
    shadowRadius: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  imageContainer: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  textoContainer: {
    backgroundColor: "white",
    borderRadius: 5,
  },
});
