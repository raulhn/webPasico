import { View, Image } from "react-native";
import { StyleSheet } from "react-native";
import ComponenteTexto from "./componenteTexto";
import constantes from "../../constantes.js";

export default function Componente(pComponente) {
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
          style={styles.imagen}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagen: {
    width: "100%",
    height: 400,
    shadowRadius: 10,
  },
  imageContainer: {
    width: "100%",

    backgroundColor: "white",
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
